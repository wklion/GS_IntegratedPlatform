package com.spd.flashflood.app;

import java.awt.geom.Rectangle2D;
import java.io.File;
import java.nio.file.Path;
import java.sql.PreparedStatement;
import java.util.Calendar;
import java.util.List;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.weathermap.objects.Dataset;
import com.weathermap.objects.DatasetRaster;
import com.weathermap.objects.Datasource;
import com.weathermap.objects.Scanline;
import com.weathermap.objects.Workspace;
import com.spd.config.ConfigC;
import com.spd.flashflood.app.child.CommonAlert;
import com.spd.flashflood.database.DataSourceSingleton;
import com.spd.flashflood.file.FileHelper;
import com.spd.flashflood.model.Application;
import com.spd.flashflood.model.Config;
import com.spd.flashflood.model.CountyRain;
import com.spd.util.DateUtil;

/**
 * @作者:wangkun
 * @日期:2017年11月2日
 * @公司:spd
 * @说明:
*/
public class CalCountyLiveRain {
	public static void main(String[] args) {
		Boolean debug = false;
		Calendar cal = Calendar.getInstance();
		if(debug){
			cal.set(Calendar.YEAR, 2017);
			cal.set(Calendar.MONTH, 9);
			cal.set(Calendar.DAY_OF_MONTH, 30);
			cal.set(Calendar.HOUR_OF_DAY, 14);
		}
		else{
			cal.add(Calendar.HOUR, -1);//要晚一个小时
		}
		String strProductDatetime = DateUtil.format("yyyy-MM-dd HH:00:00", cal);
		System.out.println("产品时间:"+strProductDatetime);
		
		CommonAlert commonAlert = new CommonAlert();
		ConfigC configC = new ConfigC();
		Config config = configC.get();
		//1、创建临时数据集
		Workspace ws = Application.m_workspace;
		String strJSON = "{\"Type\":\"Memory\",\"Alias\":\"FlashLFloodLiveAlert\",\"Server\":\"\"}";
		Datasource ds = ws.CreateDatasource(strJSON);
		Rectangle2D r2d = new Rectangle2D.Double(91.975,31.975,109.025-91.975,43.025-31.975);
		int w= 341;
		int h= 221;
		//1、查找文件,并写入临时数据中
		int[] forcastHR = {3,6,24};
		FileHelper fileHelper = new FileHelper();
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
		//4、计算区县面雨量
		List<CountyRain> lsCountyRain = commonAlert.calCountyRain(ds,"T_ADMINDIV_COUNTY.shp",forcastHR);
		//5、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("5、连接数据库完成");
		//6、入库
		String fSql = "insert into t_county_rain(countyName,datetime,strategy,r3,r6,r24) values(?,?,1,?,?,?)";
		try {
			dpConn.setAutoCommit(false);
			PreparedStatement ps = dpConn.prepareStatement(fSql);
			for(CountyRain countyRain:lsCountyRain){
				ps.setString(1, countyRain.getName());
				ps.setString(2, strProductDatetime);
				ps.setDouble(3, countyRain.getR3());
				ps.setDouble(4, countyRain.getR6());
				ps.setDouble(5, countyRain.getR24());
				ps.addBatch();
			}
			ps.executeBatch();
			dpConn.commit();
			ps.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		
		
		try {
			dpConn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(strProductDatetime+",该时次产品制作成功!");
	}
}
