package com.spd.flashflood.app;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.mg.objects.Analyst;
import com.mg.objects.Dataset;
import com.mg.objects.DatasetRaster;
import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.mg.objects.GeoPoint;
import com.mg.objects.GeoRegion;
import com.mg.objects.Geometry;
import com.mg.objects.Recordset;
import com.mg.objects.Scanline;
import com.spd.flashflood.model.Threshold;
import com.spd.grid.domain.Application;
import com.spd.grid.domain.ApplicationContextFactory;
import com.spd.grid.domain.DatasourceConnectionConfigInfo;
import com.spd.grid.domain.FlashFloodAlert;
import com.spd.grid.jdbc.DataSourceSingleton;
import com.spd.grid.tool.DateUtil;
/**     
 * @公司:	spd
 * @作者: wangkun       
 * @创建: 2017-10-31
 * @最后修改: 2017-10-31
 * @功能: 山洪预报预警
 **/
public class FlashLFloodForcastAlert {
	private static String root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	private static int strategy = 3;//3为预报
	public static void main(String[] args) throws Exception {
		Boolean debug = true;
		//1、连接数据引擎
		DatasourceConnectionConfigInfo datasourceConnectionConfigInfo = (DatasourceConnectionConfigInfo)ApplicationContextFactory.getInstance().getBean("datasourceConnectionConfigInfo");
		String strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
				datasourceConnectionConfigInfo.getType(), datasourceConnectionConfigInfo.getAlias(), datasourceConnectionConfigInfo.getServer(), 
				datasourceConnectionConfigInfo.getUser(),datasourceConnectionConfigInfo.getPassword(), datasourceConnectionConfigInfo.getDatabase(), 
				datasourceConnectionConfigInfo.getPort());
		Datasource m_datasource = Application.m_workspace.OpenDatasource(strJson);	
		int count = m_datasource.GetDatasetCount();
		System.out.println(count);
		Calendar cal = Calendar.getInstance();
		if(debug){
			cal.set(Calendar.YEAR, 2017);
			cal.set(Calendar.MONTH, 6);
			cal.set(Calendar.DAY_OF_MONTH, 4);
			cal.set(Calendar.HOUR_OF_DAY, 10);
		}
		System.out.println("1、连接数据引擎完成");
		CommonAlert commonAlert = new CommonAlert();
		//2、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("2、连接数据库完成");
		//3、获取产品ID
		int productID = commonAlert.getMaxProductID(dpConn, strategy);
		System.out.println("3、获取产品ID完成,产品ID:"+productID);
		//4、创建一个内存数据源
		strJson = "{\"Type\":\"Memory\",\"Alias\":\"SHForecast\",\"Server\":\"\"}";
		Datasource dsTemp = Application.m_workspace.CreateDatasource(strJson);
		System.out.println("4、创建一个内存数据源完成");
		//5、获取预报
		String fTableName = "t_prvn_r3_%s%s00_p_%s%s_%s_1000";
		int curHour = cal.get(Calendar.HOUR_OF_DAY);
		Calendar calProduct = (Calendar) cal.clone();
		String strMakeTime = "";
		String strForcastTime = "";
		int startHourspan = 3;
		if(curHour>8&&curHour<20){//用早上的预报
			strMakeTime = "05";
			strForcastTime = "08";
			startHourspan = ((curHour-8)/3+1)*3;
			calProduct.set(Calendar.HOUR_OF_DAY, 8);
			calProduct.add(Calendar.HOUR, ((curHour-8)/3)*3);
		}
		else{//下午的预报
			strMakeTime = "16";
			strForcastTime = "20";
			if(curHour<8){//前一天的预报
				cal.add(Calendar.DATE, -1);
				startHourspan = ((curHour+24-20)/3+1)*3;
				calProduct.add(Calendar.DATE, -1);
			}
			else{
				startHourspan = ((curHour-20)/3+1)*3;
			}
			calProduct.set(Calendar.HOUR_OF_DAY, 20);
			calProduct.add(Calendar.HOUR, ((curHour-20)/3)*3);
		}
		String strProductDatetime = DateUtil.format("yyyy-MM-dd HH:00:00", calProduct);
		System.out.println("产品时间:"+strProductDatetime);
		String yyMMdd = DateUtil.format("yyMMdd", cal);
		fTableName = String.format(fTableName, yyMMdd,strMakeTime,yyMMdd,strForcastTime,"%s");
		int[] forcastHR = {3,6,24};
		//int[] forcastHR = {3};
		commonAlert.calForcast(forcastHR,startHourspan,m_datasource,dsTemp,fTableName);
		System.out.println("5、获取预报完成");
		//3、获取数据库阀值
		List<Threshold> lsThreshold = commonAlert.getThreshold(dpConn);
		//4、获取山洪基础数据(中小河,山洪沟，隐患点)
		List<FlashFloodAlert> lsResult = null;
		lsResult = commonAlert.calDisasterPoint(dsTemp, forcastHR, "disasterPoint.shp", "地质灾害隐患点", productID, strProductDatetime, strategy,lsThreshold);
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(dsTemp, forcastHR, "riveRegion.shp", "中小河流", productID, strProductDatetime,strategy,lsThreshold);//中小河流
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(dsTemp, forcastHR, "SHGRegion.shp", "山洪沟", productID, strProductDatetime,strategy,lsThreshold);//山洪沟
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		try {
			dpConn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("Over");
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:隐患点
	 */
	private static List<FlashFloodAlert> calDisasterPoint(Datasource dsTemp,int[] forcastHR,String shpFile,String dataType,int productID,String strProductDatetime){
		List<FlashFloodAlert> lsFlashFloodAlert = new ArrayList();
		String strJson = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"disasterPoint\",\"Server\":\"%s\"}", root + "../data/"+shpFile);
		Datasource dsBase = Application.m_workspace.OpenDatasource(strJson);
		DatasetVector dvBase = (DatasetVector) dsBase.GetDataset(0);
		Recordset rs = dvBase.Query("", null);
		if(rs == null){
			System.out.println("隐患点记录为空!");
			return lsFlashFloodAlert;
		}
		rs.MoveFirst();
		while(!rs.IsEOF()){
			String name = rs.GetFieldValue("Name").toString();
			String type = rs.GetFieldValue("Type").toString();
			String id = rs.GetFieldValue("ID").toString();
			GeoPoint gp = (GeoPoint) rs.GetGeometry();
			double lon = gp.GetPoint().getX();
			double lat = gp.GetPoint().getY();
			int level = 4;
			for(int h=0,hrSize=forcastHR.length;h<hrSize;h++){//时效,时效在外，由等级高到底判断
				//取当前时效的降水数据
				DatasetRaster dr = (DatasetRaster) dsTemp.GetDataset("D"+forcastHR[h]);
				Point2D p2d = new Point2D.Double(lon,lat);
				Point2D pCell = dr.PointToCell(p2d);
				double fVal = dr.GetValue((int)pCell.getX(), (int)pCell.getY());//预报值
				if(fVal<0.1){//什么都不会发生，不用后台判断
					continue;
				}
				for(int l=1;l<level;l++){//等级
					String filed = "L"+l+"_H"+forcastHR[h];
					double thresholdVal = Double.parseDouble(rs.GetFieldValue(filed).toString());//临界值
					thresholdVal = thresholdVal/2;//用作测试
					fVal = ((int)(fVal*100))/100.0;
					if(fVal>thresholdVal){
						FlashFloodAlert flashFloodAlert = new FlashFloodAlert();
						flashFloodAlert.setProductID(productID);
						flashFloodAlert.setType(dataType);
						flashFloodAlert.setGeoID(id);
						flashFloodAlert.setLevel(l);
						flashFloodAlert.setHourspan(forcastHR[h]);
						flashFloodAlert.setDatetime(strProductDatetime);
						flashFloodAlert.setRain(fVal);
						flashFloodAlert.setStrategy(strategy);
						lsFlashFloodAlert.add(flashFloodAlert);
						break;
					}
				}
			}
			rs.MoveNext();
		}
		rs.Destroy();
		return lsFlashFloodAlert;
	}
	private static void calForcast(int[] forcastHR,int startHS,Datasource dsDB,Datasource dsTemp,String fTableName){
		int hrSize = forcastHR.length;
		for(int i=0;i<hrSize;i++){
			int curHR = forcastHR[i];
			int resCount = curHR/3;//用到的资料数
			DatasetRaster tempDR = null;
			for(int j=0;j<resCount;j++){
				int curHS = startHS+j*3;
				String strCurHS = String.format("%03d", curHS);
				String tempTableName = String.format(fTableName, strCurHS);//完整表名
				Dataset dataset = dsDB.GetDataset(tempTableName);
				DatasetRaster dr = (DatasetRaster) dataset;
				dr.CalcExtreme();
				if(j==0){
					tempDR = createTempDS(dsTemp,dr,curHR);
					tempDR.Open();
				}
				int rows = dr.GetHeight();
				int cols = dr.GetWidth();
				Scanline sl = new Scanline(dr.GetValueType(),cols);
				Scanline slResult = new Scanline(tempDR.GetValueType(),cols);
				for(int r=0;r<rows;r++){
					dr.GetScanline(0, r, sl);
					tempDR.GetScanline(0, r, slResult);
					for(int c=0;c<cols;c++){
						double thisVal = sl.GetValue(c);
						if(j==0){
							slResult.SetValue(c, thisVal);
						}
						else{
							double oldVal = slResult.GetValue(c);
							double sum = oldVal+thisVal;
							slResult.SetValue(c, sum);
						}
					}
					tempDR.SetScanline(0, r, slResult);
				}
				tempDR.CalcExtreme();
				tempDR.FlushCache();
			}
		}
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:创建临时数据集
	 */
	private static DatasetRaster createTempDS(Datasource ds,DatasetRaster srcDR,int hr){
		Rectangle2D rcBounds = srcDR.GetBounds();
		String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", rcBounds.getX(), rcBounds.getY(), rcBounds.getX() + rcBounds.getWidth(), rcBounds.getY() + rcBounds.getHeight()); //左 上 宽 高
		String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
				"D"+hr, "Single", srcDR.GetWidth(), srcDR.GetHeight(), "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, srcDR.GetNoDataValue());
		DatasetRaster drResult = ds.CreateDatasetRaster(str);
		drResult.SetBounds(rcBounds);
		return drResult;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:插入数据库
	 */
	private static void insertProduct(DruidPooledConnection conn,List<FlashFloodAlert> lsFlashFloodAlert){
		String fSql = "insert into t_flashflood_alert(productID,type,geoID,level,hourspan,datetime,strategy,rain) values(?,?,?,?,?,?,?,?)";
		try {
			conn.setAutoCommit(false);
			PreparedStatement ps = conn.prepareStatement(fSql);
			for(FlashFloodAlert flashFloodAlert:lsFlashFloodAlert){
				ps.setInt(1, flashFloodAlert.getProductID());
				ps.setString(2, flashFloodAlert.getType());
				ps.setString(3, flashFloodAlert.getGeoID());
				ps.setInt(4, flashFloodAlert.getLevel());
				ps.setInt(5, flashFloodAlert.getHourspan());
				ps.setString(6, flashFloodAlert.getDatetime());
				ps.setInt(7, flashFloodAlert.getStrategy());
				ps.setDouble(8, flashFloodAlert.getRain());
				ps.addBatch();
			}
			ps.executeBatch();
			conn.commit();
			ps.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
