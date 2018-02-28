/**
 * @author: wangkun
 * @date:2017-12-17
 * @description 卫星菜单
 */
function SatMenu() {
  this._init_();
}

SatMenu.prototype = {
  constructor: SatMenu,
  _init_: function () {
    this.name = "卫星菜单";
  },
  renderMenu: function () {
    let html = `
       <div id="yuntu_tab">
          <div class="satelliteDiv">
            <div class="weixing">
              <span>卫星</span>
              <div id="sat_name">
                <button id="FY2E" class="active">风云2E</button>
                <button id='Himawari-8'>葵花</button>
              </div>
              
            </div>
            <div class="tongdao">
              <span>通道</span>
              <div id="sat_channel">
                <button id='ir1'>红外</button>
                <button id='ir3'>水汽</button>
                <button id='vis'>可见光</button>
                <button id='mcs'>MCS</button>
              </div>
            </div>
            <div class="chanpin">
              <span>产品</span>
              <div id="sat_product">
                <button id="clc">CLC</button>
                <button id="tpw">TPW</button>
                <button id="pre_1" flag="001">PRE_1</button>
                <button id="pre_3" flag="003">PRE_3</button>
                <button id="pre_6" flag="006">PRE_6</button>
                <button id="pre_24" flag="024">PRE_24</button>
                <button id="uth">UTH</button>
                <button id="tbb">TBB</button>
              </div>
            </div>
          </div>
          <div class="timeChoose ">
            <div>
              <input class="timeRadio" type="radio" checked="true" name="rhjcQueryRadio">
              <label for="timeRadio ">实时</label>
              <span id="live_date"></span>
            </div>
            <div>
              <input class="hourRadio" type="radio" name="rhjcQueryRadio">
              <label for="hourRadio ">时段</label>
              <div class='option_btn'>20min</div>
              <div class='option_btn'>40min</div>
              <div class='option_btn'>3H</div>
              <div class='option_btn'>6H</div>
            </div>
            <div class="startTime">
              <span>从:</span>
              <input type="text" value="2017-12-08 10:00:00" />
            </div>
            <div class="endTime">
              <span>到:</span>
              <input type="text" value="2017-12-08 10:00:00" />
            </div>
          </div>

          <div class="query_action">
            <button class="option_btn">查询</button>
            <button class="option_btn">动画</button>
            <select class="animationSelect">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <div class="timeListDiv">
          </div>
        </div>
      `
    $("#menu_bd").html(html);
    },
    /**
     * @author:wangkun
     * @date:2017-12-17
     * @param:
     * @return:
     * @description:注册事件
     */
    initEvent:function(){
      $("#sat_name button").on("click",function(){
        var name = $(this).text();
      });
      $("#sat_channel button").on("click",function(){
        console.log("卫星通道!");
      });
      this.getSatChanel();
    },
  /**
   * @author:wangkun
   * @date:2017-12-17
   * @param:
   * @return:
   * @description:注册事件
   */
  initEvent: function () {
    var me = this;
    $("#sat_name button").on("click", function () {
      $(this).siblings().removeClass("active").end().addClass("active");
      if (!$("#sat_channel button").is(".active")) {
        $("#sat_channel button").first().addClass("active");
      }
      $("#sat_product button").removeClass("active");
      me.getSatChanel();
    });


    $("#sat_channel button").on("click", function () {
      $(this).siblings().removeClass("active").end().addClass("active");
      if (!$("#sat_name button").is(".active")) {
        $("#sat_name button").first().addClass("active");
      }
      $("#sat_product button").removeClass("active");
      me.getSatChanel();
    });


    $("#sat_product button").on("click", function () {
      $(this).siblings().removeClass("active").end().addClass("active");
      if ($("#sat_channel button").is(".active")) {
        $("#sat_channel button").removeClass("active");
      }
      me.getSatProduct();
    })
  },
  /**
   * @author:wangkun
   * @date:2017-12-17
   * @modifyDate:
   * @return:
   * @description:获取卫星通道
   */
  getSatChanel:function(){
    var me = this;
    GDYB.Page.alertInfo.show("正在查询!");
    var sat_name_id = $("#sat_name button.active")[0].id;
    var sat_channel_id = $("#sat_channel button.active")[0].id;
    if(sat_channel_id === "mcs"){
      
      return;
    }
    let curBounds = SATConfig.BOUNDS[sat_name_id+"_"+sat_channel_id];
    let strBounds = curBounds[0]+"_"+curBounds[1]+"_"+curBounds[2]+"_"+curBounds[3]
    let childURL = SATConfig.URL[sat_name_id+"_"+sat_channel_id];
    childURL = childURL.replace("bounds",strBounds);
    let fileName = SAT_CACHE_DIR+childURL;
    console.log(fileName);
    var url = gsDataService + "services/DBService/getSatteliteByTimes";
    var now = new MyDate();
    if(IsDEBUG){
      now.setFullYear(2017);
      now.setMonth(6);
      now.setDate(10);
      now.setHours(13);
      now.setMinutes(0);
    }
    else{
      let min = now.getMinutes();
      let mMin = min%10;
      min = min-mMin;
      now.setMinutes(min);
    }
    var strDate = now.format("yyyy-MM-dd hh:mm");
    console.log(strDate);
    var lonTime = now.getTime();
    var param = {
      time:lonTime,
      hourSpan:10,
      url:fileName
    };
    request("POST",url,param).then(function(data){
      if(data==undefined){
        console.log("资料为空!");
        GDYB.Page.alertInfo.hide("资料为空!");
        var lmu = new LayerManagerUtil();
        lmu.removeLayer("卫星");
        return;
      }
      var resDate = new MyDate(data);
      resDate = resDate.addHours(-8);//减8小时
      let strDate = resDate.format("yyyyMMdd_hhmm");
      let newChildUrl = childURL.replace("time",strDate);
      let newImgUrl = IMGCacheUrl+newChildUrl;
      strDate = resDate.format("yyyy年MM月dd日hh时mm分");
      $("#live_date").html(strDate);
      var bounds= new WeatherMap.Bounds(curBounds[0],curBounds[1],curBounds[2],curBounds[3]);
      me.displayData(newImgUrl,bounds);
      var titleName = $("#sat_name button.active").text()+"_"+$("#sat_channel button.active").text();
      GDYB.Title.add(titleName,strDate,true);
      GDYB.Page.alertInfo.hide("查询成功!");
    });
  },
  /**
   * @author:wangkun
   * @date:2017-12-20
   * @modifyDate:
   * @return:
   * @description:获取卫星产品
   */
  getSatProduct:function(){
    var me = this;
    GDYB.Page.alertInfo.show("正在查询!");
    var sat_name_id = $("#sat_name button.active")[0].id;
    var sat_product_id = $("#sat_product button.active")[0].id;
    let curBounds = SATConfig.BOUNDS[sat_name_id+"_"+sat_product_id];
    let strBounds = curBounds[0]+"_"+curBounds[1]+"_"+curBounds[2]+"_"+curBounds[3]
    let childURL = SATConfig.URL[sat_name_id+"_"+sat_product_id];
    childURL = childURL.replace("bounds",strBounds);
    if(sat_product_id === "pre_1"||sat_product_id === "pre_3"||sat_product_id === "pre_6"||sat_product_id === "pre_24"){
      let flag = $("#sat_product button.active").attr("flag");
      childURL = childURL.replace("resolution",flag);
    }
    let fileName = SAT_CACHE_DIR+childURL;
    console.log(fileName);
    var url = gsDataService + "services/DBService/getSatteliteByTimes";
    var now = new MyDate();
    now.addHours(8);//服务里面用的国际时,产品是BJ时,这儿要加8小时
    if(IsDEBUG){
      now.setFullYear(2017);
      now.setMonth(6);
      now.setDate(10);
      now.setHours(13);
      now.setMinutes(5);
    }
    else{
      let min = now.getMinutes();
      let mMin = min%10;
      min = min-mMin;
      now.setMinutes(min);
      if(sat_product_id === "tpw"){
        now.addMinutes(-5);
      }
    }
    var strDate = now.format("yyyy-MM-dd hh:mm");
    console.log(strDate);
    var lonTime = now.getTime();
    var param = {
      time:lonTime,
      hourSpan:10,
      url:fileName
    };
    request("POST",url,param).then(function(data){
      if(data==undefined){
        console.log("资料为空!");
        GDYB.Page.alertInfo.hide("资料为空!");
        var lmu = new LayerManagerUtil();
        lmu.removeLayer("卫星");
        return;
      }
      var resDate = new MyDate(data);
      resDate = resDate.addHours(-8);//减8小时
      let strDate = resDate.format("yyyyMMdd_hhmm");
      let newChildUrl = childURL.replace("time",strDate);
      let newImgUrl = IMGCacheUrl+newChildUrl;
      resDate = resDate.addHours(8);
      strDate = resDate.format("yyyy年MM月dd日hh时mm分");
      $("#live_date").html(strDate);
      var bounds= new WeatherMap.Bounds(curBounds[0],curBounds[1],curBounds[2],curBounds[3]);
      me.displayData(newImgUrl,bounds);
      var titleName = $("#sat_name button.active").text()+"_"+$("#sat_product button.active").text();
      GDYB.Title.add(titleName,strDate,true);
      GDYB.Page.alertInfo.hide("查询成功!");
    });
  },
  /**
   * @author:wangkun
   * @date:2017-12-17
   * @modifyDate:
   * @return:
   * @description:显示卫星数据
   */
  displayData:function(url,bounds){
    var lmu = new LayerManagerUtil();
    var layer = null;
    let layername = "卫星";
    var layer = lmu.getLayer(layername);
    if(layer == null){
      layer = lmu.addLayer(layername,"image",url,bounds);
    }
    else{
      layer.url = url;
      layer.name = layername;
      layer.extent = bounds;
      layer.maxExtent = bounds;
      layer.orgImageData = null;
      layer.memoryImg = null;
      layer.redraw();
    }
    layer.setOpacity(0.7);
  }
}
