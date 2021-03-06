package com.spd.grid.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;



public interface IForecastfineService {

	public List<Map> getUserStation(HashMap paraMap);
	public List<Map> getUserStationNew(HashMap paraMap);
	public List<Map> getZDYBPublishTime(HashMap paraMap);
	public List<Map> getZDYBType(HashMap paraMap);
	public List<Map> getZDYBSet(HashMap paraMap);
	public List<Map> updateZDYBSet(HashMap paraMap);
	public List<Map> insertZDYBSet(HashMap paraMap);
	public List<Map> getZDYBElement(HashMap paraMap);
	public List<Map> getZDYBOutType(HashMap paraMap);
	public List<Map> getZDYBStationType(HashMap paraMap);
	public List<Map> getGDYBPublishTime(HashMap paraMap);
	public List<Map> deleteProductTime(HashMap paraMap);
	public List<Map> addProductType(HashMap paraMap);
	public List<Map> addStationType(HashMap paraMap);
	public List<Map> deleteProductType(HashMap paraMap);
	public List<Map> updateForecastMessage(HashMap paraMap);
	public List<Map> getForecastMessage(HashMap paraMap);
	public List<Map> insertArchiveProduct(HashMap paraMap);
	public List<Map> getArchiveProduct(HashMap paraMap);
	public List<Map> getWaringByADCode(HashMap paramMap);
	public void WarningDeal(HashMap paramMap);
	public List<Map> getWHByArea(HashMap paramMap);
	public List<Map> getWRBytimeRange(HashMap paramMap);
	public List<Map> getWarningHistory(HashMap paramMap);
	public List<Map> getWarningDailyStatis();
	public List<Map> getWarningHolds(HashMap paramMap);
	public void updateHolds(HashMap paramMap);
	public void createYjzd(HashMap paramMap);
	public List<Map> getGridCheck(HashMap paraMap);
	public List<Map> getGridCheckSta(HashMap paraMap);
	public List<Map> getStation(HashMap paraMap);
	public List<Map> getArea(HashMap paraMap);
	public List<Map> getGridCheckStaAll(HashMap paraMap);
	public List<Map> getStationNew(HashMap paraMap);
	public List<Map> getNewestDataTime();
	public List<Map> getWarningNewest1H(HashMap paraMap);
}
