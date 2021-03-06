package com.spd.flashflood.app;

import java.sql.PreparedStatement;
import java.util.Calendar;
import java.util.List;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.weathermap.objects.Datasource;
import com.spd.config.GridConfig;
import com.spd.flashflood.app.child.CommonAlert;
import com.spd.flashflood.database.DataSourceSingleton;
import com.spd.flashflood.model.Application;
import com.spd.flashflood.model.CountyRain;
import com.spd.flashflood.model.GridDataBaseConfig;
import com.spd.util.DateUtil;

public class CalCountyForecastRain {
	private static String root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	public static void main(String[] args) {
		Boolean debug = false;
		GridConfig gridConfig = new GridConfig();
		GridDataBaseConfig gridDataBaseConfig = gridConfig.get();
		//1、连接风格数据引擎
		String strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
				gridDataBaseConfig.getType(), gridDataBaseConfig.getAlias(), gridDataBaseConfig.getServer(), 
				gridDataBaseConfig.getUser(),gridDataBaseConfig.getPassword(), gridDataBaseConfig.getDatabase(), 
				gridDataBaseConfig.getPort());
		Datasource m_datasource = Application.m_workspace.OpenDatasource(strJson);
		int count = m_datasource.GetDatasetCount();
		System.out.println(count);
		System.out.println("1、连接数据引擎完成");
		Calendar cal = Calendar.getInstance();
		if(debug){
			cal.set(Calendar.YEAR, 2017);
			cal.set(Calendar.MONTH, 6);
			cal.set(Calendar.DAY_OF_MONTH, 4);
			cal.set(Calendar.HOUR_OF_DAY, 10);
		}
		//2、创建一个内存数据源
		System.out.println("2、创建一个内存数据源");
		strJson = "{\"Type\":\"Memory\",\"Alias\":\"SHForecast\",\"Server\":\"\"}";
		Datasource dsTemp = Application.m_workspace.CreateDatasource(strJson);
		
		//3、获取预报
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
		String strProductDatetime = DateUtil.format("yyyy-MM-dd HH:00:00", cal);
		String yyMMdd = DateUtil.format("yyMMdd", cal);
		fTableName = String.format(fTableName, yyMMdd,strMakeTime,yyMMdd,strForcastTime,"%s");
		int[] forcastHR = {3,6,24};
		CommonAlert commonAlert = new CommonAlert();
		Boolean b = commonAlert.calForcast(forcastHR,startHourspan,m_datasource,dsTemp,fTableName);
		if(!b){
			System.out.println(strProductDatetime+",该时效产品制作失败!");
			return;
		}
		System.out.println("3、获取预报完成");
		List<CountyRain> lsCountyRain = commonAlert.calCountyRain(dsTemp,"T_ADMINDIV_COUNTY.shp",forcastHR);
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
		String fSql = "insert into t_county_rain(countyName,datetime,strategy,r3,r6,r24) values(?,?,3,?,?,?)";
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
