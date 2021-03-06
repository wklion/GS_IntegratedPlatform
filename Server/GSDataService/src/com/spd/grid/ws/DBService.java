package com.spd.grid.ws;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import jcifs.smb.NtlmPasswordAuthentication;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFilenameFilter;

import org.codehaus.jettison.json.JSONObject;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.context.ContextLoader;

import sun.misc.BASE64Decoder;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.spd.grid.domain.ApplicationContextFactory;
import com.spd.grid.model.Hail;
import com.spd.grid.pojo.CommonConfig;
import com.spd.grid.service.ICalamityService;
import com.spd.grid.tool.TypeFileFilter;
import com.sun.org.apache.xpath.internal.operations.And;

@Stateless
@Path("DBService")
public class DBService {
	private static CommonConfig commonfig;
	private static String root;
	static {
		commonfig = (CommonConfig) ApplicationContextFactory.getInstance()
				.getBean("commonConifg");
			root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1); 
	}

	// 查询实况
	@POST
	@Path("getCalamity")
	@Produces("application/json")
	public Object getCalamity(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String strObservTimes = jsonObject.getString("ObservTimes");
			int type = jsonObject.getInt("type");
			ICalamityService calamityService = (ICalamityService) ContextLoader
					.getCurrentWebApplicationContext().getBean(
							"CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("ObservTimes", strObservTimes);
			HashMap paramMapLight = new HashMap();
			paramMapLight.put("ObservTimesStart", strObservTimes);
			paramMapLight.put("ObservTimesEnd",
					(strObservTimes.substring(0, 14) + "59:59.000"));
			ArrayList result = (ArrayList) calamityService.getData(paramMap);
			ArrayList resultLight = (ArrayList) calamityService
					.getLight(paramMapLight);
			ArrayList resultHeavy = (ArrayList) calamityService
					.getHeavy(paramMap);
			if (type == 0) {
				ArrayList resultPre = (ArrayList) calamityService
						.getPre(paramMap);
				result.addAll(resultPre);
			}
			result.addAll(resultHeavy);
			result.addAll(resultLight);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	// 查询实况bytimes
	@POST
	@Path("getCalamityByTimes")
	@Produces("application/json")
	public Object getCalamityByTimes(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String ObservTimesStart = jsonObject.getString("ObservTimesStart");
			String ObservTimesEnd = jsonObject.getString("ObservTimesEnd");
			int type = jsonObject.getInt("type");
			ICalamityService calamityService = (ICalamityService) ContextLoader
					.getCurrentWebApplicationContext().getBean(
							"CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("ObservTimesStart", ObservTimesStart);
			paramMap.put("ObservTimesEnd", ObservTimesEnd);
			ArrayList result = (ArrayList) calamityService
					.getDataByTimes(paramMap);
			ArrayList resultLight = (ArrayList) calamityService
					.getLightByTimes(paramMap);
			ArrayList resultHeavy = (ArrayList) calamityService
					.getHeavyByTimes(paramMap);
			if (type == 0) {
				ArrayList resultPre = (ArrayList) calamityService
						.getPreByTimes(paramMap);
				result.addAll(resultPre);
			}
			result.addAll(resultHeavy);
			result.addAll(resultLight);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	//综合监测查询实况
	@POST
	@Path("getAll")
	@Produces("application/json")
	public Object getAll(@FormParam("para") String para){
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String strObservTimes = jsonObject.getString("ObservTimes");
			int type = jsonObject.getInt("type");
			ICalamityService calamityService = (ICalamityService)ContextLoader.getCurrentWebApplicationContext().getBean("CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("ObservTimes", strObservTimes);
			HashMap paramMapLight = new HashMap();
			paramMapLight.put("ObservTimesStart", strObservTimes);
			paramMapLight.put("ObservTimesEnd", (strObservTimes.substring(0,14)+"59:59.000"));
			ArrayList result = (ArrayList) calamityService.getDataByTimes(paramMap);
			ArrayList resultAll= (ArrayList) calamityService.getAllByTimes(paramMap);
			if(type == 0){
				ArrayList resultPre = (ArrayList) calamityService.getPreByTimes(paramMap);
				result.addAll(resultPre);
			}
			result.addAll(resultAll);
			return result;
		 } 
		 catch (Exception e) {
			 e.printStackTrace();
			 } 
		 return null;
	}
	
	
	//查询实况bytimes
	@POST
	@Path("getAllByTimes")
	@Produces("application/json")
	public Object getAllByTimes(@FormParam("para") String para){
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String ObservTimesStart = jsonObject.getString("ObservTimesStart");
			String ObservTimesEnd = jsonObject.getString("ObservTimesEnd");
			int type = jsonObject.getInt("type");
			ICalamityService calamityService = (ICalamityService)ContextLoader.getCurrentWebApplicationContext().getBean("CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("ObservTimesStart", ObservTimesStart);
			paramMap.put("ObservTimesEnd", ObservTimesEnd);
			ArrayList result = (ArrayList) calamityService.getDataByTimes(paramMap);
			ArrayList resultAll= (ArrayList) calamityService.getAllByTimes(paramMap);
			if(type == 0){
				ArrayList resultPre = (ArrayList) calamityService.getPreByTimes(paramMap);
				result.addAll(resultPre);
			}
			result.addAll(resultAll);
			return result;
		 } 
		 catch (Exception e) {
			 e.printStackTrace();
			 } 
		 return null;
	}
	


	// 查询雷达图是否存在
	@POST
	@Path("getRadarByTimes")
	@Produces("application/json")
	public Object getRadarByTimes(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		SimpleDateFormat simpleDateFormat = null;
		List<Long> list = new ArrayList<Long>();
		try {
			jsonObject = new JSONObject(para);
			String format = jsonObject.getString("format");
			String timeStart = jsonObject.getString("time1");
			String timeEnd = jsonObject.getString("time2");
			String filePath = jsonObject.getString("url");
			simpleDateFormat = new SimpleDateFormat(format);
			Long time1 = simpleDateFormat.parse(timeStart).getTime();
			Long time2 = simpleDateFormat.parse(timeEnd).getTime();
			while (time1 <= time2) {
				String timeStr = simpleDateFormat.format(new Date(time1 - 8
						* 60 * 60 * 1000));
				String fileNameNormal = filePath.replaceAll("time", timeStr);
				File file = new File(fileNameNormal);
				if (file.exists()) {
					list.add(time1);
				}
				time1 += 60 * 1000;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}
	
	
	//查询最近24小时云图是否存在
	@POST
	@Path("getSatteliteByTimes")
	@Produces("application/json")
	public Object getSatteliteByTimes(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		SimpleDateFormat simpleDateFormat = null;
		Long timeSeconds = null;
		try {
			jsonObject = new JSONObject(para);
			String format = "yyyyMMdd_HHmm";
			timeSeconds = jsonObject.getLong("time");
			int hourSpan = jsonObject.getInt("hourSpan");
			String filePath = jsonObject.getString("url");
			simpleDateFormat = new SimpleDateFormat(format);
			int i=0;
			while(i<24){
				String timeStr = simpleDateFormat.format(new Date(timeSeconds-8*60*60*1000));
				String fileNameNormal = filePath.replaceAll("time",timeStr);
				File file = new File(fileNameNormal);
				if (file.exists()) {
					return timeSeconds;
				}
				timeSeconds -= hourSpan * 60 * 1000;
				i += 1;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	//获取最新文件的文件名
	@POST
	@Path("getLastFileName")
	@Produces("application/json")
	public Object getLastFileName(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		String fileName = "";
		try {
			jsonObject = new JSONObject(para);
			String filePath = jsonObject.getString("url");
			File file = new File(filePath);
			File[] fileList = file.listFiles();
			for(int i=fileList.length-1;i>=0;i--){
	            if(fileList[i].isFile()){
	            	fileName = fileList[fileList.length-1].getName();
	            	break;
	            }
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return fileName;
	}
	
	@POST
	@Path("uploadImg")
	@Produces("application/json")
	public Object uploadImg(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String imagePath = commonfig.getForecastPath();
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");// 设置日期格式
			String nowtime = df.format(new Date());
			String productName = jsonObject.getString("productName");
			String background = jsonObject.getString("background");
			String product = jsonObject.getString("product");
			File fileProduct = new File(imagePath + productName);
			if (!fileProduct.exists()) {
				fileProduct.mkdirs();
			}
			File file = new File(imagePath + productName + "/" + nowtime
					+ "background.png");
			FileOutputStream outputStream = null;
			byte[] image = decode(background);
			outputStream = new FileOutputStream(file);
			outputStream.write(image);
			outputStream.close();
			file = new File(imagePath + productName + "/" + nowtime
					+ "product.png");
			image = decode(product);
			outputStream = new FileOutputStream(file);
			outputStream.write(image);
			outputStream.close();
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}

		return null;
	}

	@POST
	@Path("getAllDisaster")
	@Produces("application/json")
	public Object getAllDisaster(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String strObservTimes = jsonObject.getString("ObservTimes");
			ICalamityService calamityService = (ICalamityService) ContextLoader
					.getCurrentWebApplicationContext().getBean(
							"CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("ObservTimes", strObservTimes);
			HashMap paramMapLight = new HashMap();
			ArrayList result = (ArrayList) calamityService.getAllDisaster(paramMap);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	// 查询实况bytimes
	@POST
	@Path("getAllDisasterByTimes")
	@Produces("application/json")
	public Object getAllDisasterByTimes(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String ObservTimesStart = jsonObject.getString("ObservTimesStart");
			String ObservTimesEnd = jsonObject.getString("ObservTimesEnd");
			int type = jsonObject.getInt("type");
			ICalamityService calamityService = (ICalamityService) ContextLoader
					.getCurrentWebApplicationContext().getBean(
							"CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("ObservTimesStart", ObservTimesStart);
			paramMap.put("ObservTimesEnd", ObservTimesEnd);
			ArrayList resultAll = (ArrayList) calamityService
					.getAllDisasterByTimes(paramMap);
			return resultAll;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	// 获取分类站点
	@POST
	@Path("getAllStations")
	@Produces("application/json")
	public Object getAllStations(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String type = jsonObject.getString("type");
			String name = jsonObject.getString("name");
			ICalamityService calamityService = (ICalamityService) ContextLoader
					.getCurrentWebApplicationContext()
					.getBean("CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("type", type);
			paramMap.put("name", name);
			ArrayList resultAll = (ArrayList) calamityService
					.getAllStations(paramMap);
			return resultAll;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	// 站点详情实况查询
	@POST
	@Path("getStationDetail")
	@Produces("application/json")
	public Object getStationDetail(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String curtable = jsonObject.getString("tableName");
			String ObservTimes = jsonObject.getString("ObservTimes");
			String type = jsonObject.getString("type");
			ICalamityService calamityService = (ICalamityService) ContextLoader.getCurrentWebApplicationContext().getBean("CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("curtable", curtable);
			paramMap.put("type", type);
			paramMap.put("ObservTimes", ObservTimes);
 			ArrayList resultAll = (ArrayList) calamityService.getStationDetail(paramMap);
 			return resultAll;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	// 站点详情实况查询
	@POST
	@Path("testStation")
	@Produces("application/json")
	public Object testStation(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String curtable = jsonObject.getString("tableName");
			String ObservTimes = jsonObject.getString("ObservTimes");
			int type = jsonObject.getInt("type");
			ICalamityService calamityService = (ICalamityService) ContextLoader.getCurrentWebApplicationContext().getBean("CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("type", type);
			paramMap.put("curtable", curtable);
			paramMap.put("ObservTimes", ObservTimes);
			ArrayList resultAll = (ArrayList) calamityService.testStation(paramMap);
			return resultAll;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	// 单站详情实况查询
	@POST
	@Path("getOneStationDetail")
	@Produces("application/json")
	public Object getOneStationDetail(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String curtable = jsonObject.getString("tableName");
			String ObservTimesStart = jsonObject.getString("ObservTimesStart");
			String ObservTimesEnd = jsonObject.getString("ObservTimesEnd");
			String stationNum = jsonObject.getString("stationNum");

			Long startTime = System.currentTimeMillis();
			String sql = "select HH.StationNum,HH.WindDirect,HH.WindVelocity,HH.WindDirect10,HH.WindVelocity10,HH.Precipitation,HH.DryBulTemp,HH.RelHumidity,HH.MaxTemp,HH.MinTemp,HH.StationPress,HH.ObservTimes"
					+" from "+ curtable +" as HH where HH.ObservTimes >= "+ ObservTimesStart +" and HH.ObservTimes <= "+ObservTimesEnd+" and HH.StationNum = '"+stationNum+"' order by HH.ObservTimes asc";
			ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
			JdbcTemplate jdbcTemplate = (JdbcTemplate) applicationContext.getBean("jdbcTemplate");
			List resultList = jdbcTemplate.query(sql, new RowMapper() {
				@Override
				public Object mapRow(ResultSet rs, int index)throws SQLException {
					Map u = new HashMap();
					u.put("StationNum", rs.getString("StationNum"));
					u.put("WindDirect", rs.getDouble("WindDirect"));
					u.put("WindDirect10", rs.getDouble("WindDirect10"));
					u.put("WindVelocity10", rs.getDouble("WindVelocity10"));
					u.put("Precipitation", rs.getDouble("Precipitation"));
					u.put("DryBulTemp", rs.getDouble("DryBulTemp"));
					u.put("RelHumidity", rs.getDouble("RelHumidity"));
					u.put("MaxTemp", rs.getDouble("MaxTemp"));
					u.put("MinTemp", rs.getDouble("MinTemp"));
					u.put("StationPress", rs.getDouble("StationPress"));
					u.put("ObservTimes", rs.getString("ObservTimes"));
				    return u;
				}
			});
			Long endTime = System.currentTimeMillis();
			System.out.println(endTime-startTime);
			return resultList;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	// 根据时间段预警发布查询
	@POST
	@Path("getSignalGtDataByTimes")
	@Produces("application/json")
	public Object getSignalGtDataByTimes(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String ObservTimesStart = jsonObject.getString("startTime");
			String ObservTimesEnd = jsonObject.getString("endTime");
			ICalamityService calamityService = (ICalamityService) ContextLoader.getCurrentWebApplicationContext().getBean("CalamityService");
			HashMap paramMap = new HashMap();
			paramMap.put("ObservTimesStart", ObservTimesStart);
			paramMap.put("ObservTimesEnd", ObservTimesEnd);
			ArrayList resultAll = (ArrayList) calamityService.getSignalGtDataByTimes(paramMap);
			return resultAll;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return true;
	}

	// 站点详情历史查询
	@POST
	@Path("getStationDetailByTimes")
	@Produces("application/json")
	public Object getStationDetailByTimes(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String ObservTimesStart = jsonObject.getString("ObservTimesStart");
			String ObservTimesEnd = jsonObject.getString("ObservTimesEnd");
			String curtable = jsonObject.getString("tableName");
			String type = jsonObject.getString("type");
			
			//测试
			Long startTime = System.currentTimeMillis();
			String sql = "select HH.StationNum,HH.WindDirect,HH.WindVelocity,HH.WindDirect10,HH.WindVelocity10,HH.Precipitation,HH.DryBulTemp,HH.RelHumidity,HH.MinRelHumidity,HH.MaxWindD,HH.MaxWindV,HH.ExMaxWindD,HH.ExMaxWindV,HH.MaxTemp,HH.MinTemp,HH.StationPress,HH.MaxPSta,HH.MinPSta ,HH.ObservTimes,D.Lon,D.Lat "+
						 "from "+curtable+" AS HH left join (SELECT * from D_Station where flag in (1,2) and pid = 2 and StaID like '5%' or StaID like 'w%') as D on HH.StationNum = D.StaID where HH.ObservTimes >= '"+ObservTimesStart+"' and HH.ObservTimes <= '"+ObservTimesEnd+"' and HH.StationNum like '"+type+"'";
			 ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
			 JdbcTemplate jdbcTemplate = (JdbcTemplate) applicationContext.getBean("jdbcTemplate");
			 List resultList = jdbcTemplate.query(sql, new RowMapper() {
				@Override
				public Object mapRow(ResultSet rs, int index)throws SQLException {
					Map u = new HashMap();
					u.put("StationNum", rs.getString("StationNum"));
					u.put("WindDirect", rs.getDouble("WindDirect"));
					u.put("WindVelocity", rs.getDouble("WindVelocity"));
					u.put("WindDirect10", rs.getDouble("WindDirect10"));
					u.put("WindVelocity10", rs.getDouble("WindVelocity10"));
					u.put("Precipitation", rs.getDouble("Precipitation"));
					u.put("DryBulTemp", rs.getDouble("DryBulTemp"));
					u.put("RelHumidity", rs.getDouble("RelHumidity"));
					u.put("MinRelHumidity", rs.getDouble("MinRelHumidity"));
					u.put("MaxWindD", rs.getDouble("MaxWindD"));
					u.put("MaxWindV", rs.getDouble("MaxWindV"));
					u.put("ExMaxWindD", rs.getDouble("ExMaxWindD"));
					u.put("ExMaxWindV", rs.getDouble("ExMaxWindV"));
					u.put("MaxTemp", rs.getDouble("MaxTemp"));
					u.put("MinTemp", rs.getDouble("MinTemp"));
					u.put("StationPress", rs.getDouble("StationPress"));
					u.put("MaxPSta", rs.getDouble("MaxPSta"));
					u.put("MinPSta", rs.getDouble("MinPSta"));
					u.put("ObservTimes", rs.getString("ObservTimes"));
					u.put("Lon", rs.getString("Lon"));
					u.put("Lat", rs.getString("Lat"));
				    return u;
				}
			 });
			 Long endTime = System.currentTimeMillis();
			 System.out.println(endTime-startTime);
			 return resultList;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	// 站点详情历史查询
		@POST
		@Path("getStationDetailByStationNum")
		@Produces("application/json")
		public Object getStationDetailByStationNum(@FormParam("para") String para) {
			JSONObject jsonObject = null;
			try {
				jsonObject = new JSONObject(para);
				String ObservTimesStart = jsonObject.getString("ObservTimesStart");
				String ObservTimesEnd = jsonObject.getString("ObservTimesEnd");
				String curtable = jsonObject.getString("tableName");
				String type = jsonObject.getString("type");
				String StationNum = jsonObject.getString("StationNum");
				
				//测试
				Long startTime = System.currentTimeMillis();
				String sql = "select HH.StationNum,HH.WindDirect,HH.WindVelocity,HH.WindDirect10,HH.WindVelocity10,HH.Precipitation,HH.DryBulTemp,HH.RelHumidity,HH.MinRelHumidity,HH.MaxWindD,HH.MaxWindV,HH.ExMaxWindD,HH.ExMaxWindV,HH.MaxTemp,HH.MinTemp,HH.StationPress,HH.MaxPSta,HH.MinPSta ,HH.ObservTimes,D.Lon,D.Lat "+
							 "from "+curtable+" AS HH left join D_Station as D on HH.StationNum = D.StaID where HH.ObservTimes >= '"+ObservTimesStart+"' and HH.ObservTimes <= '"+ObservTimesEnd+"' and HH.StationNum like '"+type+"' and StationNum in ("+StationNum+")";
				 ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
				 JdbcTemplate jdbcTemplate = (JdbcTemplate) applicationContext.getBean("jdbcTemplate");
				 List resultList = jdbcTemplate.query(sql, new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int index)throws SQLException {
						Map u = new HashMap();
						u.put("StationNum", rs.getString("StationNum"));
						u.put("WindDirect", rs.getDouble("WindDirect"));
						u.put("WindVelocity", rs.getDouble("WindVelocity"));
						u.put("WindDirect10", rs.getDouble("WindDirect10"));
						u.put("WindVelocity10", rs.getDouble("WindVelocity10"));
						u.put("Precipitation", rs.getDouble("Precipitation"));
						u.put("DryBulTemp", rs.getDouble("DryBulTemp"));
						u.put("RelHumidity", rs.getDouble("RelHumidity"));
						u.put("MinRelHumidity", rs.getDouble("MinRelHumidity"));
						u.put("MaxWindD", rs.getDouble("MaxWindD"));
						u.put("MaxWindV", rs.getDouble("MaxWindV"));
						u.put("ExMaxWindD", rs.getDouble("ExMaxWindD"));
						u.put("ExMaxWindV", rs.getDouble("ExMaxWindV"));
						u.put("MaxTemp", rs.getDouble("MaxTemp"));
						u.put("MinTemp", rs.getDouble("MinTemp"));
						u.put("StationPress", rs.getDouble("StationPress"));
						u.put("MaxPSta", rs.getDouble("MaxPSta"));
						u.put("MinPSta", rs.getDouble("MinPSta"));
						u.put("ObservTimes", rs.getString("ObservTimes"));
						u.put("Lon", rs.getString("Lon"));
						u.put("Lat", rs.getString("Lat"));
					    return u;
					}
				 });
				 Long endTime = System.currentTimeMillis();
				 System.out.println(endTime-startTime);
				 return resultList;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return null;
		}
	
	// 获取自动站时段数据（访问172.23.2.99）
	@POST
	@Path("getZDZDataRange")
	@Produces("application/json")
	public Object getZDZDataRange(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String ObservTimesStart = jsonObject.getString("ObservTimesStart");
			if(ObservTimesStart.length()<14)
				ObservTimesStart+=String.format("%0"+(14-ObservTimesStart.length())+"d", 0);			
			String ObservTimesEnd = jsonObject.getString("ObservTimesEnd");
			if(ObservTimesEnd.length()<14)
				ObservTimesEnd+=String.format("%0"+(14-ObservTimesEnd.length())+"d", 0);
			String curtable = jsonObject.getString("tableName");
			String type = jsonObject.getString("type");
			
			//测试
			Long startTime = System.currentTimeMillis();
//			//全部转为数值 除以10 如果出现非数字则报错
//			String sql = "select HH.StationNum,HH.ObservTimes,D.Lon,D.Lat,HH.WindDirect,cast(HH.WindVelocity as int)/10.0 as WindVelocity,HH.WindDirect10,cast(HH.WindVelocity10 as int)/10.0 as WindVelocity10,cast(HH.Precipitation as int)/10.0 as Precipitation,cast(HH.DryBulTemp as int)/10.0 as DryBulTemp,HH.RelHumidity,HH.MinRelHumidity,HH.MaxWindD,cast(HH.MaxWindV as int)/10.0 as MaxWindV,HH.ExMaxWindD,cast(HH.ExMaxWindV as int)/10.0 as ExMaxWindV,cast(HH.MaxTemp as int)/10.0 as MaxTemp,cast(HH.MinTemp as int)/10.0 as MinTemp,cast(HH.StationPress as int)/10.0 as StationPress,cast(HH.MaxPSta as int)/10.0 as MaxPSta,cast(HH.MinPSta as int)/10.0 as MinPSta"
//				+"from tabRealTimeData as HH left join station as D on HH.StationNum = D.staid where HH.ObservTimes >= '"+ObservTimesStart+"' and HH.ObservTimes <= '"+ObservTimesEnd+"' and HH.StationNum like '"+type+"'";
//			//仅气温降水转为数值 除以10 
//			String sql = "select HH.StationNum,HH.ObservTimes,D.Lon,D.Lat,HH.WindDirect,HH.WindVelocity,HH.WindDirect10,HH.WindVelocity10,cast(HH.Precipitation as int)/10.0 as Precipitation,cast(HH.DryBulTemp as int)/10.0 as DryBulTemp,HH.RelHumidity,HH.MinRelHumidity,HH.MaxWindD,HH.MaxWindV,HH.ExMaxWindD,HH.ExMaxWindV,cast(HH.MaxTemp as int)/10.0 as MaxTemp,cast(HH.MinTemp as int)/10.0 as MinTemp,HH.StationPress,HH.MaxPSta,HH.MinPSta"
//				+"from tabRealTimeData as HH left join station as D on HH.StationNum = D.staid where HH.ObservTimes >= '"+ObservTimesStart+"' and HH.ObservTimes <= '"+ObservTimesEnd+"' and HH.StationNum like '"+type+"'";
			//保持字符类型，代码中处理
			String sql = "select HH.StationNum,HH.ObservTimes,D.Lon,D.Lat,HH.WindDirect,HH.WindVelocity,HH.WindDirect10,HH.WindVelocity10,HH.Precipitation,HH.DryBulTemp,HH.RelHumidity,HH.MinRelHumidity,HH.MaxWindD,HH.MaxWindV,HH.ExMaxWindD,HH.ExMaxWindV,HH.MaxTemp,HH.MinTemp,HH.StationPress,HH.MaxPSta,HH.MinPSta"
				+" from tabRealTimeData as HH left join station as D on HH.StationNum = D.staid where HH.ObservTimes >= '"+ObservTimesStart+"' and HH.ObservTimes <= '"+ObservTimesEnd+"' and HH.StationNum like '"+type+"'";
			
			 ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
			 JdbcTemplate jdbcTemplate = (JdbcTemplate) applicationContext.getBean("jdbcTemplate");
			 List resultList = jdbcTemplate.query(sql, new RowMapper() {
				@Override
				public Object mapRow(ResultSet rs, int index)throws SQLException {
					Map u = new HashMap();
					u.put("StationNum", rs.getString("StationNum"));
					u.put("WindDirect", rs.getString("WindDirect")==null?null:(checkNumber(rs.getString("WindDirect").trim())?Integer.valueOf(rs.getString("WindDirect").trim()):null));
					u.put("WindVelocity", rs.getString("WindVelocity")==null?null:(checkNumber(rs.getString("WindVelocity").trim())?Integer.valueOf(rs.getString("WindVelocity").trim())/10.0:null));
					u.put("WindDirect10", rs.getString("WindDirect10")==null?null:(checkNumber(rs.getString("WindDirect10").trim())?Integer.valueOf(rs.getString("WindDirect10").trim()):null));
					u.put("WindVelocity10", rs.getString("WindVelocity10")==null?null:(checkNumber(rs.getString("WindVelocity10").trim())?Integer.valueOf(rs.getString("WindVelocity10").trim())/10.0:null));
					u.put("Precipitation", rs.getString("Precipitation")==null?null:(checkNumber(rs.getString("Precipitation").trim())?Integer.valueOf(rs.getString("Precipitation").trim())/10.0:null));					
					u.put("DryBulTemp", rs.getString("DryBulTemp")==null?null:(checkNumber(rs.getString("DryBulTemp").trim())?Integer.valueOf(rs.getString("DryBulTemp").trim())/10.0:null));
					u.put("RelHumidity", rs.getString("RelHumidity")==null?null:(checkNumber(rs.getString("RelHumidity").trim())?Integer.valueOf(rs.getString("RelHumidity").trim()):null));
					u.put("MinRelHumidity", rs.getString("MinRelHumidity")==null?null:(checkNumber(rs.getString("MinRelHumidity").trim())?Integer.valueOf(rs.getString("MinRelHumidity").trim()):null));
					u.put("MaxWindD", rs.getString("MaxWindD")==null?null:(checkNumber(rs.getString("MaxWindD").trim())?Integer.valueOf(rs.getString("MaxWindD").trim()):null));
					u.put("MaxWindV", rs.getString("MaxWindV")==null?null:(checkNumber(rs.getString("MaxWindV").trim())?Integer.valueOf(rs.getString("MaxWindV").trim())/10.0:null));
					u.put("ExMaxWindD", rs.getString("ExMaxWindD")==null?null:(checkNumber(rs.getString("ExMaxWindD").trim())?Integer.valueOf(rs.getString("ExMaxWindD").trim()):null));
					u.put("ExMaxWindV", rs.getString("ExMaxWindD")==null?null:(checkNumber(rs.getString("ExMaxWindV").trim())?Integer.valueOf(rs.getString("ExMaxWindV").trim())/10.0:null));
					u.put("MaxTemp", rs.getString("MaxTemp")==null?null:(checkNumber(rs.getString("MaxTemp").trim())?Integer.valueOf(rs.getString("MaxTemp").trim())/10.0:null));
					u.put("MinTemp", rs.getString("MinTemp")==null?null:(checkNumber(rs.getString("MinTemp").trim())?Integer.valueOf(rs.getString("MinTemp").trim())/10.0:null));
					u.put("StationPress", rs.getString("StationPress")==null?null:(checkNumber(rs.getString("StationPress").trim())?Integer.valueOf(rs.getString("StationPress").trim())/10.0:null));
					u.put("MaxPSta", rs.getString("MaxPSta")==null?null:(checkNumber(rs.getString("MaxPSta").trim())?Integer.valueOf(rs.getString("MaxPSta").trim())/10.0:null));
					u.put("MinPSta", rs.getString("MaxPSta")==null?null:(checkNumber(rs.getString("MinPSta").trim())?Integer.valueOf(rs.getString("MinPSta").trim())/10.0:null));
					u.put("ObservTimes", rs.getString("ObservTimes"));
					u.put("Lon", rs.getString("Lon")==null?null:rs.getString("Lon").trim());
					u.put("Lat", rs.getString("Lat")==null?null:rs.getString("Lat").trim());
				    return u;
				}
			 });
			 Long endTime = System.currentTimeMillis();
			 System.out.println(endTime-startTime);
			 return resultList;
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}
	
	// 获取自动站数据（访问172.23.2.99）
	@POST
	@Path("getZDZData")
	@Produces("application/json")
	public Object getZDZData(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(para);
			String ObservTimes = jsonObject.getString("ObservTimes");
			if(ObservTimes.length()<14)
				ObservTimes+=String.format("%0"+(14-ObservTimes.length())+"d", 0);
			String curtable = jsonObject.getString("tableName");
			String type = jsonObject.getString("type");
			
			//测试
			Long startTime = System.currentTimeMillis();
//			//全部转为数值 除以10 如果出现非数字则报错
//			String sql = "select HH.StationNum,HH.ObservTimes,D.Lon,D.Lat,HH.WindDirect,cast(HH.WindVelocity as int)/10.0 as WindVelocity,HH.WindDirect10,cast(HH.WindVelocity10 as int)/10.0 as WindVelocity10,cast(HH.Precipitation as int)/10.0 as Precipitation,cast(HH.DryBulTemp as int)/10.0 as DryBulTemp,HH.RelHumidity,HH.MinRelHumidity,HH.MaxWindD,cast(HH.MaxWindV as int)/10.0 as MaxWindV,HH.ExMaxWindD,cast(HH.ExMaxWindV as int)/10.0 as ExMaxWindV,cast(HH.MaxTemp as int)/10.0 as MaxTemp,cast(HH.MinTemp as int)/10.0 as MinTemp,cast(HH.StationPress as int)/10.0 as StationPress,cast(HH.MaxPSta as int)/10.0 as MaxPSta,cast(HH.MinPSta as int)/10.0 as MinPSta"
//				+"from tabRealTimeData as HH left join station as D on HH.StationNum = D.staid where HH.ObservTimes >= '"+ObservTimesStart+"' and HH.ObservTimes <= '"+ObservTimesEnd+"' and HH.StationNum like '"+type+"'";
//			//仅气温降水转为数值 除以10 
//			String sql = "select HH.StationNum,HH.ObservTimes,D.Lon,D.Lat,HH.WindDirect,HH.WindVelocity,HH.WindDirect10,HH.WindVelocity10,cast(HH.Precipitation as int)/10.0 as Precipitation,cast(HH.DryBulTemp as int)/10.0 as DryBulTemp,HH.RelHumidity,HH.MinRelHumidity,HH.MaxWindD,HH.MaxWindV,HH.ExMaxWindD,HH.ExMaxWindV,cast(HH.MaxTemp as int)/10.0 as MaxTemp,cast(HH.MinTemp as int)/10.0 as MinTemp,HH.StationPress,HH.MaxPSta,HH.MinPSta"
//				+"from tabRealTimeData as HH left join station as D on HH.StationNum = D.staid where HH.ObservTimes >= '"+ObservTimesStart+"' and HH.ObservTimes <= '"+ObservTimesEnd+"' and HH.StationNum like '"+type+"'";
			//保持字符类型，代码中处理
			String sql = "select HH.StationNum,HH.ObservTimes,D.Lon,D.Lat,HH.WindDirect,HH.WindVelocity,HH.WindDirect10,HH.WindVelocity10,HH.Precipitation,HH.DryBulTemp,HH.RelHumidity,HH.MinRelHumidity,HH.MaxWindD,HH.MaxWindV,HH.ExMaxWindD,HH.ExMaxWindV,HH.MaxTemp,HH.MinTemp,HH.StationPress,HH.MaxPSta,HH.MinPSta"
				+" from tabRealTimeData as HH left join station as D on HH.StationNum = D.staid where HH.ObservTimes = '"+ObservTimes+"' and HH.StationNum like '"+type+"'";
			
			 ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
			 JdbcTemplate jdbcTemplate = (JdbcTemplate) applicationContext.getBean("jdbcTemplate");
			 List resultList = jdbcTemplate.query(sql, new RowMapper() {
				@Override
				public Object mapRow(ResultSet rs, int index)throws SQLException {
					Map u = new HashMap();
					u.put("StationNum", rs.getString("StationNum"));
					u.put("WindDirect", rs.getString("WindDirect")==null?null:(checkNumber(rs.getString("WindDirect").trim())?Integer.valueOf(rs.getString("WindDirect").trim()):null));
					u.put("WindVelocity", rs.getString("WindVelocity")==null?null:(checkNumber(rs.getString("WindVelocity").trim())?Integer.valueOf(rs.getString("WindVelocity").trim())/10.0:null));
					u.put("WindDirect10", rs.getString("WindDirect10")==null?null:(checkNumber(rs.getString("WindDirect10").trim())?Integer.valueOf(rs.getString("WindDirect10").trim()):null));
					u.put("WindVelocity10", rs.getString("WindVelocity10")==null?null:(checkNumber(rs.getString("WindVelocity10").trim())?Integer.valueOf(rs.getString("WindVelocity10").trim())/10.0:null));
					u.put("Precipitation", rs.getString("Precipitation")==null?null:(checkNumber(rs.getString("Precipitation").trim())?Integer.valueOf(rs.getString("Precipitation").trim())/10.0:null));					
					u.put("DryBulTemp", rs.getString("DryBulTemp")==null?null:(checkNumber(rs.getString("DryBulTemp").trim())?Integer.valueOf(rs.getString("DryBulTemp").trim())/10.0:null));
					u.put("RelHumidity", rs.getString("RelHumidity")==null?null:(checkNumber(rs.getString("RelHumidity").trim())?Integer.valueOf(rs.getString("RelHumidity").trim()):null));
					u.put("MinRelHumidity", rs.getString("MinRelHumidity")==null?null:(checkNumber(rs.getString("MinRelHumidity").trim())?Integer.valueOf(rs.getString("MinRelHumidity").trim()):null));
					u.put("MaxWindD", rs.getString("MaxWindD")==null?null:(checkNumber(rs.getString("MaxWindD").trim())?Integer.valueOf(rs.getString("MaxWindD").trim()):null));
					u.put("MaxWindV", rs.getString("MaxWindV")==null?null:(checkNumber(rs.getString("MaxWindV").trim())?Integer.valueOf(rs.getString("MaxWindV").trim())/10.0:null));
					u.put("ExMaxWindD", rs.getString("ExMaxWindD")==null?null:(checkNumber(rs.getString("ExMaxWindD").trim())?Integer.valueOf(rs.getString("ExMaxWindD").trim()):null));
					u.put("ExMaxWindV", rs.getString("ExMaxWindD")==null?null:(checkNumber(rs.getString("ExMaxWindV").trim())?Integer.valueOf(rs.getString("ExMaxWindV").trim())/10.0:null));
					u.put("MaxTemp", rs.getString("MaxTemp")==null?null:(checkNumber(rs.getString("MaxTemp").trim())?Integer.valueOf(rs.getString("MaxTemp").trim())/10.0:null));
					u.put("MinTemp", rs.getString("MinTemp")==null?null:(checkNumber(rs.getString("MinTemp").trim())?Integer.valueOf(rs.getString("MinTemp").trim())/10.0:null));
					u.put("StationPress", rs.getString("StationPress")==null?null:(checkNumber(rs.getString("StationPress").trim())?Integer.valueOf(rs.getString("StationPress").trim())/10.0:null));
					u.put("MaxPSta", rs.getString("MaxPSta")==null?null:(checkNumber(rs.getString("MaxPSta").trim())?Integer.valueOf(rs.getString("MaxPSta").trim())/10.0:null));
					u.put("MinPSta", rs.getString("MaxPSta")==null?null:(checkNumber(rs.getString("MinPSta").trim())?Integer.valueOf(rs.getString("MinPSta").trim())/10.0:null));
					u.put("ObservTimes", rs.getString("ObservTimes"));
					u.put("Lon", rs.getString("Lon")==null?null:rs.getString("Lon").trim());
					u.put("Lat", rs.getString("Lat")==null?null:rs.getString("Lat").trim());
				    return u;
				}
			 });
			 Long endTime = System.currentTimeMillis();
			 System.out.println(endTime-startTime);
			 return resultList;
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return null;
	}
	
	static boolean checkNumber(String value){  
        String regex = "^(-?[1-9]\\d*\\.?\\d*)|(-?0\\.\\d*[1-9])|(-?[0])|(-?[0]\\.\\d*)$";  
        return value.matches(regex);
    } 

	static private byte[] decode(String s) {
		BASE64Decoder decoder = new BASE64Decoder();
		byte[] bytes = null;
		try {
			bytes = decoder.decodeBuffer(s);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return bytes;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年6月13日
	 * @修改日期:2017年6月13日
	 * @参数:时间
	 * @返回:
	 * @说明:获取冰雹,解析半个小时内的参数
	 */
		@POST
		@Path("getBB")
		@Produces("application/json")
		public Object getBB(@FormParam("para") String para) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd HH:mm:00");
			SimpleDateFormat sdfFile = new SimpleDateFormat("yyyyMMddHHmmss");
			JSONObject jsonObject = null;
			String strDateTime =null;
			Date datetime =null;
			try {
					jsonObject = new JSONObject(para);
					strDateTime = jsonObject.getString("datetime");
					datetime = sdf.parse(strDateTime);
			} catch (Exception e) {
					System.out.println("getBB()--解析参数失败!");
					return null;
			}
			Calendar cal = Calendar.getInstance();
			cal.setTime(datetime);
			cal.add(Calendar.HOUR, -8);//国际时
			strDateTime = sdf.format(cal.getTime());
			//解析json参数
			JsonParser parse =new JsonParser();  //创建json解析器
			String userid="";
			String password="";
			String dir = "";
			String format ="";
			try {
				JsonObject json=(JsonObject) parse.parse(new FileReader(root+"/SMB.json")); //创建jsonObject对象
				JsonObject objBB = json.get("bb").getAsJsonObject();
				userid = objBB.get("userid").getAsString();
				password = objBB.get("password").getAsString();
				dir = objBB.get("dir").getAsString();
				format = objBB.get("format").getAsString();
			} catch (Exception e) {
					System.out.println("解析SMB.json出错!");
					return null;
			}
			String strYYYYMMdd = strDateTime.substring(0,8);
			format = format.replace("date", strYYYYMMdd);
			format = format.replace("/", "\\");
			File file = new File(dir);
			File[] fi = file.listFiles(new TypeFileFilter(format));
			
			//找合适的文件
			int totalFile = fi.length;
			Map<String,Integer> mapRadarMinute = new HashMap();//时间差
			Map<String,File> mapRadarFile = new HashMap();//文件
			try {
					for(int i=0;i<totalFile;i++){
							File curFile = fi[i];
							String fileName = curFile.getName();
							String[] strFileName = fileName.split("_");
							String strCurDateTime = strFileName[1].substring(0,14);
							Date curDateTime = sdfFile.parse(strCurDateTime);
							int chaMinue = (int) ((cal.getTime().getTime() - curDateTime.getTime())/(1000*60));
							if(chaMinue<30&&chaMinue>0){
									String radarName = strFileName[0];
									if(mapRadarMinute.keySet().contains(radarName)){
											int chaM = mapRadarMinute.get(radarName);//上一次相关的时间，取最小
											if(chaMinue<chaM){
													mapRadarFile.put(radarName, curFile);
											}
									}
									else{
											mapRadarMinute.put(radarName, chaMinue);
											mapRadarFile.put(radarName, curFile);
									}
							}
					}
			} catch (Exception e) {
					System.out.println(e.getMessage());
			}
			System.out.println("半个小时内有"+mapRadarFile.size()+"文件被找到");
			List<Hail> lsResult = new ArrayList();
			InputStreamReader reader=null;
			BufferedReader br = null;
			int count =0;
			try{
					for(String radarName:mapRadarFile.keySet()){
							File curFile = mapRadarFile.get(radarName);
							reader = new InputStreamReader(new FileInputStream(curFile));
							br = new BufferedReader(reader);
							String line = "";
							line = br.readLine();
							line = line.trim();
							int lineCount = Integer.parseInt(line);//行数
							count=count+lineCount;
							if(lineCount!=0){
									line = br.readLine();
									while (line != null) {
				                    		line = line.trim();
				                    		String[] strContent = line.split("\\s+");
				                    		double lat = Double.parseDouble(strContent[0]);
				                    		if(lat!=0){
				                    				double lon = Double.parseDouble(strContent[1]);
				                    				double sp = Double.parseDouble(strContent[2]);//小冰雹概率
				                    				double bp = Double.parseDouble(strContent[3]);//大冰雹概率
				                    				double level = Double.parseDouble(strContent[4]);
				                    				Hail hail = new Hail(lon,lat,sp,bp,level);
				                    				lsResult.add(hail);
				                    		}
				                    		line = br.readLine();
									}
							}
							br.close();
							reader.close();
					}
			}
			catch(Exception ex){
					System.out.println(ex.getMessage());
			}
			System.out.println("找到"+count+"冰雹数据!");
			return lsResult;
		}
}
