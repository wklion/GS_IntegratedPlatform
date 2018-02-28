var host = "http://" + window.location.host;
var webRoot = "";
//var hostname = "http://" + window.location.hostname;
var HOSTNAME = "http://101.200.12.178";
//var HOSTNAME = "http://172.23.2.237";
var CTX = HOSTNAME + ":3080/" + webRoot + "/";
var flashFloodServiceUrl = HOSTNAME + ":8081/GSFlashFlood/services/";
var wmDataServiceUrl = HOSTNAME + ":8081/WMDataService/services/";
var productDic = "E:/GS/Tom_GS/webapps/products/archive/";
var liveGridPath = "E:/GS/Data/CMISS/ANALYSIS/CMPA/0P05/";
var flashFloodFtp = {
  url: "127.0.0.1",
  port: 21,
  userName: "wklion",
  password: "wklion"
};
var defaultCenter = [103, 38, 9];
var userServiceUrl = HOSTNAME + ":3080/WMUser/services/";
var gridServiceUrl = HOSTNAME + ":3080/WMGridService/services/";
var dataSericeUrl = HOSTNAME + ":8081/WMDataService/services/";
var archiveService = HOSTNAME + ":3080/SPDArchiveService/";
var gsDataService = HOSTNAME + ":3081/GSDataService/services/";
var wmDataService = HOSTNAME + ":3081/WMDataService/services/";
//var gsDataService = "http://127.0.0.1:8081/GSDataService/";
var gsGraphicService = HOSTNAME + ":8081/GSGraphicService/";
var IMGCacheUrl = HOSTNAME + ":3080/cache/";
var SAT_CACHE_DIR = "D:/apache-tomcat-gs/webapps/cache";
//var SAT_CACHE_DIR = "D:/Tomcats/apache-tomcat-7.0.69-gdyb/webapps/cache";
var RADAR_CACHE_DIR = "D:/apache-tomcat-gs/webapps/cache";
//var RADAR_CACHE_DIR = "D:/Tomcats/apache-tomcat-7.0.69-gdyb/webapps/cache";
//var SAT_CACHE_DIR = "E:/GS/Data/cache";
// 格点数据监控地址
//var GMSUrl = "http://localhost:3080/gms/service/monitor";
var GMSUrl = HOSTNAME+":8081/gms/service/monitor";
var WAPDServiceUrl = "http://localhost:3080/WAPDService/services/AlertSignalService/";
var GRIDBounds = [92,32,109,43];
var IsDEBUG = true;
var SATConfig = {
  URL:{
    "Himawari-8_ir1":"/Satellite/Himawari-8/IR1/H08_B13_R020_time.AWX_bounds.png",
    "Himawari-8_ir3":"/Satellite/Himawari-8/IR3/H08_B03_R010_time.AWX_bounds.png",
    "Himawari-8_vis":"/Satellite/Himawari-8/VIS/H08_B09_R020_time.AWX_bounds.png",
    "Himawari-8_mcs":"D:/output/jsons/MCS/Himawari-8/H08_B13_R020_time.js",
    FY2E_ir1:"/Satellite/Image/IR1/ANI_IR1_R04_time_FY2E.AWX_bounds.png",
    FY2E_ir3:"/Satellite/Image/IR3/ANI_IR3_R04_time_FY2E.AWX_bounds.png",
    FY2E_vis:"/Satellite/Image/VIS/ANI_VIS_R04_time_FY2E.AWX_bounds.png",
    FY2E_mcs:"D:/output/jsons/MCS/FY2E/ANI_IR1_R04_time_FY2E.js",
    FY2E_clc:"/Satellite/Image/CLC/CLC_MLT_OTG_time_FY2E.AWX_bounds.png",
    FY2E_tpw:"/Satellite/Image/TPW/TPW_MLT_OTG_time_FY2E.AWX_bounds.png",
    FY2E_pre_1:"/Satellite/Image/PRE/PRE_resolution_OTG_time_FY2E.AWX_bounds.png",
    FY2E_pre_3:"/Satellite/Image/PRE/PRE_resolution_OTG_time_FY2E.AWX_bounds.png",
    FY2E_pre_6:"/Satellite/Image/PRE/PRE_resolution_OTG_time_FY2E.AWX_bounds.png",
    FY2E_pre_24:"/Satellite/Image/PRE/PRE_resolution_OTG_time_FY2E.AWX_bounds.png",
    FY2E_uth:"/Satellite/Image/UTH/UTH_MLT_OTG_time_FY2E.AWX_bounds.png",
    FY2E_tbb:"/Satellite/Image/TBB/TBB_IR1_OTG_time_FY2E.AWX_bounds.png"
  },
  BOUNDS:{
    "Himawari-8_ir1":[70,10,150,60],
    "Himawari-8_ir3":[70,10,150,60],
    "Himawari-8_vis":[70,10,150,60],
    "Himawari-8_mcs":[70,10,150,60],
    FY2E_ir1:[50,-4,145,61],
    FY2E_ir3:[50,-4,145,61],
    FY2E_vis:[50,-4,145,61],
    FY2E_amv_ir1:[50,-4,145,61],
    FY2E_amv_ir3:[50,-4,145,61],
    FY2E_clc:[27,-60,147,60],
    FY2E_tpw:[27,-60,147,60],
    FY2E_pre_1:[37,0,137,50],
    FY2E_pre_3:[37,0,137,50],
    FY2E_pre_6:[37,0,137,50],
    FY2E_pre_24:[37,0,137,50],
    FY2E_uth:[27,-60,147,60],
    FY2E_tbb:[27,-60,147,60]
  }
};
var RADARConfig = {
  URL:{
    radar_mcr:"/pup/cr/Z_RADR_I_radar_time_P_DOR_CD_CR_40X40_460_NUL.bin_bounds.png",
    radar_mtop:"/pup/et/Z_RADR_I_radar_time_P_DOR_CD_ET_40X40_230_NUL.bin_bounds.png",
    radar_mvil:"/pup/vil/Z_RADR_I_radar_time_P_DOR_CD_VIL_40X40_230_NUL.bin_bounds.png",
    radar_ohp:"/pup/ohp/Z_RADR_I_radar_time_P_DOR_CD_OHP_20_230_NUL.bin_bounds.png",
    cappi:"/ncard/TDPRODUCT/CAPPI/Z_OTHE_RADAMOSAIC_time.bin_Z_OTHE_RADAMOSAIC_time_elevation_bounds.png",
    equalTempR:"/ncard/TDPRODUCT/EQUALTEMPR/Z_LCMO_EQUALTEMPR_Televation_time.bin_bounds.png",
    micaps_qpe:"/qpe/QPF.time.000_bounds.png",
    micaps_qpf:"/qpf/QPF.time.060_bounds.png",
    swan_titan:"P:/share/LOCAL/titan/Z_TITAN_time.bin.bz2",
    swan_trec:"P:/share/LOCAL/gd/cotrecwind/Z_TREC_time.bin.bz2",
    radar_gannan:"/RadarData/gannan/Z_RADR_I_Z9941_time_O_DOR_CD_CAP.bin_product_bounds.png",
    radar_guyuan:"/RadarData/guyuan/Z_RADR_I_Z9954_time_O_DOR_CC_CAP.bin_product_bounds.png",
    radar_hanzhong:"/RadarData/hanzhong/Z_RADR_I_Z9916_time_O_DOR_CB_CAP.bin_product_bounds.png",
    radar_jiayuguan:"/RadarData/jiayuguan/Z_RADR_I_Z9937_time_O_DOR_CC_CAP.bin_product_bounds.png",
    radar_lanzhou:"/RadarData/lanzhou/Z_RADR_I_Z9931_time_O_DOR_CC_CAP.bin_product_bounds.png",
    radar_tianshui:"/RadarData/tianshui/Z_RADR_I_Z9938_time_O_DOR_CD_CAP.bin_product_bounds.png",
    radar_wudu:"/RadarData/wudu/Z_RADR_I_Z9939_time_O_DOR_CC_CAP.bin_product_bounds.png",
    radar_xifeng:"/RadarData/xifeng/Z_RADR_I_Z9934_time_O_DOR_CD_CAP.bin_product_bounds.png",
    radar_xining:"/RadarData/xining/Z_RADR_I_Z9971_time_O_DOR_CD_CAP.bin_product_bounds.png",
    radar_yanan:"/RadarData/yanan/Z_RADR_I_Z9911_time_O_DOR_CB_CAP.bin_product_bounds.png",
    radar_zhangye:"/RadarData/zhangye/Z_RADR_I_Z9936_time_O_DOR_CC_CAP.bin_product_bounds.png"
  },
  BOUNDS:{
    radar_mcr:[91,32,110,43],
    radar_mtop:[91,32,110,43],
    radar_mvil:[91,32,110,43],
    radar_ohp:[91,32,110,43],
    cappi:[91,32,110,43],
    equalTempR:[91,32,110,43],
    micaps_qpe:[91,32,110,43],
    micaps_qpf:[91,32,110,43],
    radar_gannan_R:[118,27,124,32],
    radar_gannan_V:[118,27,124,32],
    radar_guyuan_R:[104,34,108,37],
    radar_guyuan_V:[102,32,109,38],
    radar_hanzhong_R:[102,29,111,37],
    radar_hanzhong_V:[102,29,111,37],
    radar_jiayuguan_R:[96,38,100,41],
    radar_jiayuguan_V:[96,38,100,41],
    radar_lanzhou_R:[102,34,106,37],
    radar_lanzhou_V:[102,34,106,37],
    radar_tianshui_R:[102,32,108,37],
    radar_tianshui_V:[102,32,108,37],
    radar_wudu_R:[99,29,110,38],
    radar_wudu_V:[102,31,108,36],
    radar_xifeng_R:[104,32,111,38],
    radar_xifeng_V:[104,32,111,38],
    radar_xining_R:[98,34,104,39],
    radar_xining_V:[98,34,104,39],
    radar_yanan_R:[104,32,114,40],
    radar_yanan_V:[104,32,114,40],
    radar_zhangye_R:[98,37,102,40],
    radar_zhangye_V:[98,37,102,40]
  }
};
var CIMISSConfig = {
  HOST:"http://10.166.89.55/cimiss-web/api?",
  USERID:"BCLZ_ZXT_zxtybs",
  PWD:"yubaoshi"
};
