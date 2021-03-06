package com.spd.grid.ws;

import java.awt.geom.Rectangle2D;
import java.io.File;
import java.lang.reflect.Type;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import com.mg.objects.Dataset;
import com.mg.objects.DatasetRaster;
import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.mg.objects.GeoRegion;
import com.mg.objects.Geometry;
import com.mg.objects.Layer;
import com.mg.objects.Recordset;
import com.mg.objects.Scanline;
import com.mg.objects.Workspace;
import com.spd.grid.domain.Application;
import com.spd.grid.domain.FlashFloodAlertResult;
import com.spd.grid.domain.FlashFloodBaseDataParam;
import com.spd.grid.domain.GetLiveDataParam;
import com.spd.grid.domain.Img64Data;
import com.spd.grid.domain.LastFlashFloodByTypeParam;
import com.spd.grid.domain.SHOutputImgDataParam;
import com.spd.grid.domain.SHOutputImgParam;
import com.spd.grid.domain.LeadFile;
import com.spd.grid.jdbc.DataSourceSingleton;
import com.spd.grid.tool.DatasetUtil;
import com.spd.grid.tool.DateUtil;
import com.spd.grid.tool.FileHelper;
import com.spd.grid.tool.FileUtil;
import com.spd.grid.tool.ImgUtil;
import com.spd.weathermap.domain.GridData;
import com.spd.weathermap.util.CommonTool;
import com.spd.weathermap.util.LogTool;
import com.spd.weathermap.util.Toolkit;
/**     
 * @公司:	spd
 * @作者: wangkun       
 * @创建: 2017-10-18
 * @最后修改: 2017-10-18
 * @功能: 山洪预报预警
 **/
@Stateless
@Path("ProductService")
public class ProductService {
	private  Logger log = LogTool.getLogger(this.getClass());
	private String classPath = Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	@POST
	@Path("getLastFlashFloodByType")
	@Produces("application/json")
	public Object getLastFlashFloodByType(@FormParam("para") String para ){
		List<FlashFloodAlertResult> lsFlashFloodAlertResult = new ArrayList();
		//1、参数
		Gson gson = new Gson();
		LastFlashFloodByTypeParam lastFlashFloodByTypeParam = gson.fromJson(para, LastFlashFloodByTypeParam.class);
		String strDateTime = "";
		if(lastFlashFloodByTypeParam.getDatetime().equals("")){
			Calendar cal = Calendar.getInstance();
			strDateTime = DateUtil.format("yyyy-MM-dd HH:00:00", cal);
		}
		else{
			strDateTime = lastFlashFloodByTypeParam.getDatetime();
		}
		Calendar calQuery = DateUtil.parse("yyyy-MM-dd HH:00:00", strDateTime);//查询时间
		//2、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//String fSql = "select * from t_flashflood_alert where type='%s' and datetime<='%s' and strategy=%d";
		String fSql = "select * from t_flashflood_alert where type='%s' and datetime<='%s' and strategy=%d and productID=(select max(productID) from t_flashflood_alert where type='%s' and datetime<='%s' and strategy=%d)";
		String[] types = lastFlashFloodByTypeParam.getTypes().split(",");
		FileUtil fileUtil = new FileUtil();
		DatasetUtil dsUtil = new DatasetUtil();
		try{
			for(String type:types){
				//打开shp文件
				String fileName = "";
				String dataType = "";
				if(type.equals("中小河流")){
					fileName = "riverRegion.shp";
					dataType = "Region";
				}
				else if(type.equals("山洪沟")){
					fileName = "SHGRegion.shp";
					dataType = "Region";
				}
				else if(type.equals("地质灾害隐患点")){
					fileName = "disasterPoint.shp";
					dataType = "Point";
				}
				if(fileName.equals("")){
					log.error("传入的类型不能识别,请传入(中小河流、山洪沟、地质灾害隐患点)");
					continue;
				}
				DatasetVector dvShp = fileUtil.openShp(fileName);
				if(dvShp==null){
					System.out.println(fileName+"--失量数据打开失败!");
					continue;
				}
				String sql = String.format(fSql, type,strDateTime,lastFlashFloodByTypeParam.getStrategy(),type,strDateTime,lastFlashFloodByTypeParam.getStrategy());
				PreparedStatement ps = dpConn.prepareStatement(sql);
				ResultSet rsDB = ps.executeQuery();
				FlashFloodAlertResult flashFloodAlertResult = null;
				while(rsDB.next()){
					String geoID = rsDB.getString("geoID");
					int level = rsDB.getInt("level");
					int hourspan = rsDB.getInt("hourspan");
					double rain = rsDB.getDouble("rain");
					int productID = rsDB.getInt("productID");
					String strResDateTime = rsDB.getString("datetime");
					Calendar calData = DateUtil.parse("yyyy-MM-dd HH:00:00", strResDateTime);//资料时间
					calData.add(Calendar.HOUR, hourspan);
					if(calData.compareTo(calQuery)<0){
						continue;
					}
					flashFloodAlertResult = new FlashFloodAlertResult();
					flashFloodAlertResult.setId(geoID);
					flashFloodAlertResult.setProductid(productID);
					flashFloodAlertResult.setLevel(level);
					flashFloodAlertResult.setHourspan(hourspan);
					flashFloodAlertResult.setDatetime(strResDateTime);
					flashFloodAlertResult.setRain(rain);
					lsFlashFloodAlertResult.add(flashFloodAlertResult);
				}
				rsDB.close();
			}
			dpConn.close();
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
		return lsFlashFloodAlertResult;
	}
	@POST
	@Path("getShpByType")
	@Produces("application/json")
	public Object getShpByType(@FormParam("para") String para ){
		//1、参数
		Gson gson = new Gson();
		FlashFloodBaseDataParam flashFloodBaseDataParam = gson.fromJson(para, FlashFloodBaseDataParam.class);
		String fileName = "";
		String dataType = "";
		String type = flashFloodBaseDataParam.getType();
		if(type.equals("中小河流")){
			fileName = "riverRegion.shp";
			dataType = "Region";
		}
		else if(type.equals("山洪沟")){
			fileName = "SHGRegion.shp";
			dataType = "Region";
		}
		else if(type.equals("地质灾害隐患点")){
			fileName = "disasterPoint.shp";
			dataType = "Point";
		}
		else if(type.equals("中小河流new")){
			fileName = "newRiverRegion.shp";
			dataType = "Region";
		}
		if(fileName.equals("")){
			log.error("传入的类型不能识别,请传入(中小河流、山洪沟、地质灾害隐患点)");
			return null;
		}
		FileUtil fileUtil = new FileUtil();
		DatasetVector dvShp = fileUtil.openShp(fileName);
		if(dvShp==null){
			System.out.println(fileName+"--失量数据打开失败!");
			return null;
		}
		String result = "";
		if(dataType.toLowerCase().equals("region")){
			result = Toolkit.convertDatasetVectorToJson(dvShp,"REGION");
		}
		else{
			result = Toolkit.convertDatasetVectorToJson(dvShp,"POINT");
		}
		return result;
	}
	@POST
	@Path("shOutputImg")
	@Produces("application/json")
	public Object shOutputImg(@FormParam("para") String para ) throws Exception{
		Gson gson = new Gson();
		SHOutputImgParam sHOutputImgParam = gson.fromJson(para, SHOutputImgParam.class);
		String type  = sHOutputImgParam.getType();
		String strShpFileName = "";
		if(type.equals("中小河流")){
			strShpFileName = "riverRegion.shp";
		}
		else if(type.equals("山洪沟")){
			strShpFileName = "SHGRegion.shp";
		}
		else if(type.equals("地质灾害隐患点")){
			strShpFileName = "disasterPoint.shp";
		}
		else{
			return null;
		}
		String strShpFile = classPath+"../data/"+strShpFileName;
		Workspace ws = Application.m_workspace;
		String strJson = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\""+strShpFileName+"\",\"Server\":\"" + strShpFile + "\"}";
		Datasource dsBase = ws.OpenDatasource(strJson);
		DatasetVector dvShp = (DatasetVector) dsBase.GetDataset(0);
		
		//创建临时
		Calendar cal = Calendar.getInstance();
		String strTime = DateUtil.format("hhmmss", cal);
		String alias = strShpFileName+strTime;
		strJson = "{\"Type\":\"Memory\",\"Alias\":\""+alias+"\",\"Server\":\"\"}";
		Datasource dsTemp = ws.CreateDatasource(strJson);
		if(type.equals("中小河流")||type.equals("山洪沟")){
			strJson = "{\"Name\":\"region\",\"Type\":\"Region\"}";
		}
		else{
			strJson = "{\"Name\":\"region\",\"Type\":\"Region\"}";
		}
		DatasetVector dv = dsTemp.CreateDatasetVector(strJson);
		dv.SetBounds(dvShp.GetBounds());
		dv.SetProjection(dvShp.GetProjection().GetParams());
		//添加字段
		strJson = "{\"Name\":\"level\",\"Type\":\"Int32\"}";
		dv.AddField(strJson);
		dv.Open();
		Recordset rsResult = dv.Query("", null);
		String queryFormat = "{\"Where\":\"[ID]='%s'\"}";
		List<SHOutputImgDataParam> lsSHOutputImgDataParam = sHOutputImgParam.getLsDataParam();
		int size = lsSHOutputImgDataParam.size();
		if(size<1){
			return null;
		}
		for(int i=0;i<size;i++){
			SHOutputImgDataParam item = lsSHOutputImgDataParam.get(i);
			String geoID = item.getId();
			int level = item.getLevel();
			strJson = String.format(queryFormat, geoID);
			Recordset rsTemp = dvShp.Query(strJson, null);
			rsTemp.MoveFirst();
			Geometry geo = null;
			if(type.equals("中小河流")||type.equals("山洪沟")){
				geo = (GeoRegion) rsTemp.GetGeometry().Clone();
			}
			else{
				geo = rsTemp.GetGeometry().Clone();
			}
			rsResult.AddNew(geo);
			rsResult.SetFieldValue("level", level);
			rsResult.Update();
			geo.Destroy();
		}
		
		rsResult.Destroy();
		ImgUtil imgUtil = new ImgUtil();
		//imgUtil.outputImg("测试",dv);
		Layer pLayer = Layer.CreateInstance("VectorUnique", ws);
		pLayer.SetDataset(dv);
		pLayer.SetPropertyValue("UniqueExpression", "level");
		String str = String.format("{\"Value\":%d,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",1, 255,0,0);
		pLayer.AddPropertyValue("VectorUniqueItem", str);
		str = String.format("{\"Value\":%d,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",2, 255,127,39);
		pLayer.AddPropertyValue("VectorUniqueItem", str);
		str = String.format("{\"Value\":%d,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",3, 255,255,0);
		pLayer.AddPropertyValue("VectorUniqueItem", str);
		str = String.format("{\"Value\":%d,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",4, 0,0,255);
		pLayer.AddPropertyValue("VectorUniqueItem", str);
		String title = sHOutputImgParam.getTitle();
		String strMakeTime = sHOutputImgParam.getMaketime();
		String strHourspan = sHOutputImgParam.getHourspan();
		String dic = sHOutputImgParam.getDic();
		File fileDic = new File(dic);
		if(!fileDic.exists()){//创建目录
			fileDic.mkdirs();
		}
		String name = sHOutputImgParam.getFileName();
		String strImgFile = dic+name;
		imgUtil.outputImg(strImgFile,title,strMakeTime,strHourspan,pLayer);
		//转成base64
		String strImgData  = imgUtil.convertImgToBase64(strImgFile);
		ws.CloseDatasource(alias);
		ws.CloseDatasource(strShpFileName);
		Img64Data imgData = new Img64Data();
		imgData.setSuc(strImgData);
		return imgData;
	}
	@POST
	@Path("getLiveData")
	@Produces("application/json")
	public Object getLiveData(@FormParam("para") String para) {
		//1、解析参数
		Gson gson = new Gson();
		GetLiveDataParam getLiveDataParam = gson.fromJson(para, GetLiveDataParam.class);
		String path = getLiveDataParam.getPath();
		String strDateTime = getLiveDataParam.getDateTime();
		Calendar cal = DateUtil.parse("yyyyMMddHHmmss", strDateTime);
		int year = cal.get(Calendar.YEAR);
		String subDir = DateUtil.format("yyyyMMdd", cal);
		String dic = path+year+"/"+subDir;
		String strYYYYMMddHH = DateUtil.format("yyyyMMddHH", cal);
		String strFormater = strYYYYMMddHH+".GRB2";
		FileHelper fileHelper = new FileHelper();
		File findFile = fileHelper.findGrid2(dic, strFormater);
		
		if(findFile==null){
			return null;
		}
		String strFile = findFile.getAbsolutePath();
		strFile = strFile.replace("\\", "/");
		
		
		String strJson = "{\"Type\":\"grib_api\",\"Alias\":\"TestGRIB\",\"Server\":\"%s\"}";
		strJson = String.format(strJson, strFile);
		
		Workspace ws = Application.m_workspace;
		Datasource ds = ws.OpenDatasource(strJson);
		Dataset dt = ds.GetDataset(0);
		DatasetRaster dg = ((DatasetRaster)dt);
		dg.Open();  //一定要调用Open
		dg.CalcExtreme();
		GridData gridData = new GridData();
		double[] bounds = {91.975,31.975,109.025,43.025};
		int rows = 221;
		int cols = 341;
		//计算偏移量
		Rectangle2D r2d = dg.GetBounds();
		int offX = (int) ((bounds[0]-r2d.getX())/0.05);
		int offY = (int) ((bounds[1]-r2d.getY())/0.05);
		int totalWidth = dg.GetWidth();
		Scanline sl = new Scanline(dg.GetValueType(), totalWidth);
		ArrayList<Double> dValues = new ArrayList<Double>();
		double noVal = dg.GetNoDataValue();
		double max = 0;
		for(int r = rows-1;r>=0;r--){
			dg.GetScanline(0, r+offY, sl);
			for(int c=0;c<cols;c++){
				double val = sl.GetValue(c+offX);
				val = val<0?noVal:val;
				val = val>=noVal?noVal:val;
				dValues.add(val);
				if(val!=noVal)
					max = val>max?val:max;
			}
		}
		System.out.println(max);
		sl.Destroy();
		gridData.setLeft(bounds[0]);
		gridData.setBottom(bounds[1]);
		gridData.setRight(bounds[2]);
		gridData.setTop(bounds[3]);
		gridData.setRows(rows);
		gridData.setCols(cols);
		gridData.setDValues(dValues);
		gridData.setNoDataValue(dg.GetNoDataValue());
		ws.CloseDatasource("TestGRIB");
		return gridData;
	}
	/*
	 * 获取气象风险产品文件目录列表
	 * 参数：查询目录
	 * 返回：目录下文件列表
	 * */
	@POST
	@Path("getAlarmProductFilesList")
	@Produces("application/json")
	public Object getAlarmProductFilesList(@FormParam("para") String para) {
		ArrayList<LeadFile> leadFiles = new ArrayList<LeadFile>();
		try {
			JSONObject jsonObject = new JSONObject(para);
			String path = CommonTool.getJSONStr(jsonObject, "path");
			
			File[] files = null;
			File folder = new File(path);
			if(folder.exists()){
				files = folder.listFiles();
			}
			else {
				//continue;
			}
			
			if(files == null || files.length == 0){
				
			}
			else {
				for(File file : files){
					String filename = file.getName();
			        Long time = file.lastModified();
			        Calendar cd = Calendar.getInstance();
			        cd.setTimeInMillis(time);
			        String leadTime = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(cd.getTime());
					leadFiles.add(new LeadFile(filename,leadTime));
				}
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return leadFiles;
	}
}
