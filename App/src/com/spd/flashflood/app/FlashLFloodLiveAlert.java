package com.spd.flashflood.app;

import java.awt.geom.Rectangle2D;
import java.io.File;
import java.sql.PreparedStatement;
import java.util.Calendar;
import java.util.List;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.weathermap.objects.DatasetRaster;
import com.weathermap.objects.Datasource;
import com.weathermap.objects.Workspace;
import com.spd.config.ConfigC;
import com.spd.flashflood.app.child.CommonAlert;
import com.spd.flashflood.database.DataSourceSingleton;
import com.spd.flashflood.file.FileHelper;
import com.spd.flashflood.model.Application;
import com.spd.flashflood.model.Config;
import com.spd.flashflood.model.FlashFloodAlert;
import com.spd.util.DateUtil;

/**
 * @作者:wangkun
 * @日期:2017年11月2日
 * @公司:spd
 * @说明:
*/
public class FlashLFloodLiveAlert {
	private static int strategy = 1;//1为实况
	public static void main(String[] args) {
		ConfigC configC = new ConfigC();
		Config config = configC.get();
		CommonAlert commonAlert = new CommonAlert();
		FileHelper fileHelper = new FileHelper();
		Boolean debug = false;
		Calendar cal = Calendar.getInstance();
		if(debug){
			cal.set(Calendar.YEAR, 2017);
			cal.set(Calendar.MONTH, 9);
			cal.set(Calendar.DAY_OF_MONTH, 30);
			cal.set(Calendar.HOUR_OF_DAY, 14);
		}
		String strProductDatetime = DateUtil.format("yyyy-MM-dd HH:00:00", cal);
		System.out.println("产品时间:"+strProductDatetime);
		//1、创建临时数据集
		Workspace ws = Application.m_workspace;
		String strJSON = "{\"Type\":\"Memory\",\"Alias\":\"FlashLFloodLiveAlert\",\"Server\":\"\"}";
		Datasource ds = ws.CreateDatasource(strJSON);
		Rectangle2D r2d = new Rectangle2D.Double(91.975,31.975,109.025-91.975,43.025-31.975);
		int w= 341;
		int h= 221;
		int[] forcastHR = {3,6,24};
		int size = forcastHR.length;
		for(int i=0;i<size;i++){
			int curHR = forcastHR[i];
			Calendar calTem = (Calendar) cal.clone();
			strJSON = String.format("{\"Name\":\"d%d\",\"ValueType\":\"Single\",\"Width\":%d,\"Height\":%d}", curHR,w, h);
			DatasetRaster dr = ds.CreateDatasetRaster(strJSON);
			dr.SetProjection("+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
			dr.SetBounds(r2d);
			dr.Open();
			for(int j=1;j<=curHR;j++){
				File findFile = fileHelper.getFileByDateTime(calTem,config.getLiveGridDic());
				if(findFile==null){//没找到文件
					continue;
				}
				commonAlert.getGridFromGrid2(ws,findFile,dr,j);
				calTem.add(Calendar.HOUR, -1);
			}
		}
		//2、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("2、连接数据库完成");
		
		//3、获取最大产品ID
		int productID = commonAlert.getMaxProductID(dpConn, strategy);
		List<FlashFloodAlert> lsResult = null;
		lsResult = commonAlert.calDisasterPoint(ds, forcastHR, "disasterPoint.shp", "地质灾害隐患点", productID, strProductDatetime, strategy);//地质灾害隐患点
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(ds, forcastHR, "riveRegion.shp", "中小河流", productID, strProductDatetime,strategy);//中小河流
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(ds, forcastHR, "SHGRegion.shp", "山洪沟", productID, strProductDatetime,strategy);//山洪沟
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		try {
			dpConn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("实况计算完成");
		ws.CloseDatasource("FlashLFloodLiveAlert");
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
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
