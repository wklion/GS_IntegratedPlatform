/**
 * Created by Dinlerkey on 2017/10/17.
 */


function QDLQXFXPageClass() {
    var t = this;
    this.myDateSelecter = null;
    this.myBarDateSelecter = null;
    this.warningDatetime = null;
    this.numbers = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147, 150, 153, 156, 159, 162, 165, 168, 171, 174, 177, 180, 183, 186, 189, 192, 195, 198, 201, 204, 207, 210, 213, 216, 219, 222, 225, 228, 231, 234, 237, 240];
    this.hourSpan = null;
    this.levelColor = ["#9BE1FF", "red", "orange", "yellow", "blue"];
    this.levelColorTxt = ["无", "红色", "橙色", "黄色", "蓝色"];
    this.levelTxt = ["无风险", "风险很高", "风险高", "风险较高", "有一定风险"];
    this.drawPolygon = null;
    this.riverLayer = null;//中小河流图层
    this.newRiverLayer = null;//中小河流图层(新)
    this.shLayer = null;//山洪沟图层
    this.disasterLayer = null;//隐患点图层
    this.allCounty = [];//所有区县
    this.mostAlarmLevel = "蓝色";
    this.riverData = null;//河流数据
    this.newRiverData = null;//河流数据(新)
    this.shgData = null;//山洪沟数据
    this.disasterPTData = null;//隐患点数据
    this.riverAlertData = null;//河流预警数据
    this.shgAlertData = null;//山洪沟预警数据
    this.disasterPTAlertData = null;//河流预警数据
    this.dMapTool = null;
    this.types = ["中小河流", "山洪沟", "地质灾害隐患点"];
    this.liveTemplate = "name过去hourspan小时雨量达到xxmm,请注意预警发布。";
    this.liveForecastTemplate = "name预计hourspan小时,雨量达到xxmm,请注意预警发布。";
    this.forecastTemplate = "name,预计未来hourspan小时将有xxmm,请注意预警发布。";
    this.myChart = null;//图表
    this.modifyIsLoad = false;//修改功能是否初始化
    this.hosProIsLoad = false;//历史过程是否初始化
    this.vueModify = null;
    this.vueHosPro = null;//历史过程
    this.renderMenu = async function () {
        //监测报警
        $("#menu_bd").html(`
            <div id="monitoringAlarmDiv">
                <div id="alarmDatetime" style="display:none;">
                <div class="title1">报警时间：</div>
                <div class="" style="padding: 5px 0 10px 10px;">
                    <div id="warningDatetime"></div>
                </div>
                </div>
                <div id="alarmStrategy">
                    <div class="title1">报警策略：</div>
                    <div class="" style="padding: 5px 0 10px 10px;">
                        <button id="strategy_live" class="active" flag="1">实况</button><button id="strategy_liveAndForecast" flag="2">实况+预报</button><button id="strategy_forecast" flag="3">预报</button>
                    </div>
                </div>
                <div id="riskType">
                    <div class="title1">风险类型：</div>
                    <div class="" style="padding: 5px 0 10px 10px;">
                        <button id="type_shanhong" class="active" flag="山洪沟">山洪</button><button id="type_dizhizaihai" class="active" flag="地质灾害隐患点">地质灾害</button><button id="type_hongshui" class="active" flag="中小河流">中小河流洪水</button>
                    </div>
                </div>
                <div id="alarmMessage">
                    <div class="title1">报警消息：</div>
                    <div style="padding: 5px 0 10px 5px;">
                        <div id="alarmMessageTable" class="alarmMessageTable">
                        </div>
                    </div>
                </div>
                <div id="monitoringAlarmBar">
                    <div style="margin-left: 10px;float: left;">面雨量</div>
                    <div style="margin-left: 10px;float: left;">日期：</div>
                    <div id="barDateSelect" style="float: left;"></div>
                    <div style="margin-left: 10px;float: left;">小时：</div>
                    <div style=";float: left;">
                        <select id="selectMakeTime" style="height: 25px;border: 1px solid #aaa;background-color: transparent;">
                            <option value="5">08</option>
                            <option value="16">20</option>
                        </select>
                    </div>
                    <div style=";float: left;margin-left: 20px;">
                        <select id="selectLiveTime" style="height: 25px;border: 1px solid #aaa;background-color: transparent;">
                            <option value="-1">-1</option>
                            <option value="-2">-2</option>
                            <option value="-3">-3</option>
                            <option value="-4">-4</option>
                            <option value="-5">-5</option>
                            <option value="-6">-6</option>
                            <option value="-7">-7</option>
                            <option value="-8">-8</option>
                            <option value="-9">-9</option>
                            <option value="-10">-10</option>
                            <option value="-11">-11</option>
                            <option value="-12">-12</option>
                            <option value="-13">-13</option>
                            <option value="-14">-14</option>
                            <option value="-15">-15</option>
                            <option value="-16">-16</option>
                            <option value="-17">-17</option>
                            <option value="-18">-18</option>
                            <option value="-19">-19</option>
                            <option value="-20">-20</option>
                            <option value="-21">-21</option>
                            <option value="-22">-22</option>
                            <option value="-23">-23</option>
                            <option value="-24">-24</option>
                        </select>
                    </div>
                    <div id="timeChooseBar" style="float: left;">
                        <ul>
                            <li flag="1">+1</li>
                            <li flag="3">+3</li>
                            <li flag="6">+6</li>
                            <li flag="12">+12</li>
                            <li flag="24">+24</li>
                            <li flag="48">+48</li>
                            <li flag="72">+72</li>
                        </ul>
                    </div>
                    <div style="clear:both;"></div>
                    <div id="monitoringAlarmTableDiv" style="display: none;">
                        <div id="displayTableDiv">x</div>
                        <div id="monitoringAlarmTable"></div>
                    </div>
                    <div id="riskInfo" class="riskInfo">
                        <div id="riskInfo_data" class="riskInfo_data">
                        </div>
                        <span class="close">&times;</span>
                    </div>
                </div>
            </div>
        `);
        //预警制作
        $("#menu_bd").append(`
            <div id="makeAlarmDiv" style="color:#eee;display:none;">
                <div id="makeAlarmForm" style="padding: 5px 0 10px 10px;">
                    <div id="alarmFormContent">
                        <div style="float: left;margin: 8px;">起报时间：</div>
                        <div id="dateSelect" style="float: left;margin: 8px 0 8px 2px""></div><div style="clear:both;"></div>
                        <div style="float: left;margin: 8px;">预报时效：</div>
                        <div style="float: left;margin: 8px 0 8px 2px">
                            <select id="forecastHourspan" style="background-color: rgba(3,66,94,0.9);height: 22px;border:1px solid rgb(49, 202, 255)">
                                <option>3小时</option><option>6小时</option><option>24小时</option>
                           </select>
                        </div>
                        <div style="float: left;margin: 8px 0 8px 20px;">期号：</div>
                        <div style="float: left;margin: 8px 0 8px 12px""><input id="alarmIssue" type="text" style="text-align: center;width: 68px;background-color: transparent;height: 22px;border:1px solid rgb(49, 202, 255)" value="45"/></div><div style="clear:both;"></div>
                        <div style="float: left;margin: 8px;">风险类型：</div>
                        <div style="float: left;margin: 8px 0 8px 2px">
                            <select id="alarmType" style="background-color: rgba(3,66,94,0.9);height: 22px;width: 210px;border:1px solid rgb(49, 202, 255)">
                                <option flag="山洪沟">山洪灾害气象风险预警</option>
                                <option flag="地质灾害隐患点">地质灾害气象风险预警</option>
                                <option flag="中小河流">中小河流灾害气象风险预警</option>
                            </select>
                        </div><div style="clear:both;"></div>
                        <div style="float: left;margin: 8px;">签发人：</div>
                        <div style="float: left;margin: 8px 0 8px 16px">
                            <select id="alarmSigner" style="background-color: rgba(3,66,94,0.9);height: 22px;border:1px solid rgb(49, 202, 255)">
                                <option>王宝鉴</option><option>刘新伟</option>
                            </select>
                        </div>
                        <div style="float: left;margin: 8px 0 10px 20px;">预报员：</div>
                        <div style="float: left;margin: 8px 0 8px 2px;">
                            <select id="alarmForecastor" style="background-color: rgba(3,66,94,0.9);height: 22px;border:1px solid rgb(49, 202, 255)">
                                <option>孔祥伟</option><option>黄武斌</option>
                            </select>
                        </div><div style="clear:both;"></div>
                    </div>
                    <div id="alarmFormButton" style="margin: 15px 0 15px;">
                        <button id="make_alarm">生成预警</button><button id="make_product">生成产品</button><button id="make_uploadProduct">上传产品</button>
                    </div>
                </div>
                <div id="dropZoneCorrection" style="padding: 5px 0 10px 10px;font-size: 14px;background-color: rgba(68,68,68,0.5);">
                    <div>落区订正</div>
                    <div style="width: 100%;margin: 0 auto;display: flex;flex-wrap: wrap;">
                        <div class="dropZoneLevel" value="1">
                            <div style="background-color:red;height:15px;width:15px;margin: 4px 10px 4px 10px;"></div><div class="levelDetail">一级：风险很高</div>
                        </div>
                        <div class="dropZoneLevel" value="2">
                            <div style="background-color:orange;height:15px;width:15px;margin: 4px 10px 4px 10px;"></div><div class="levelDetail">二级：风险高</div>
                        </div>
                        <div class="dropZoneLevel" value="3">
                            <div style="background-color:yellow;height:15px;width:15px;margin: 4px 10px 4px 10px;"></div><div class="levelDetail">三级：风险较高</div>
                        </div>
                        <div class="dropZoneLevel" value="4">
                            <div style="background-color:blue;;height:15px;width:15px;margin: 4px 10px 4px 10px;"></div><div class="levelDetail">四级：有一定风险</div>
                        </div>
                        <div class="dropZoneLevel" value="0">
                            <div style="background-color:#9BE1FF;;height:15px;width:15px;margin: 4px 10px 4px 10px;"></div><div class="levelDetail">零级：无风险</div>
                        </div>
                    </div>
                    <div id="dropZoneType" style="width: 60%;margin: 5px auto;">
                        <img style="width:14px;" src="imgs/pointer.png"/><button id="pointCorrection">站点订正</button>
                        <img style="width:14px;margin-left: 15px;" src="imgs/Circle.png"/><button id="areaEdit">落区订正</button>
                    </div>
                </div>
                <div style="padding: 5px 0 10px 10px;font-size: 14px;">
                    <div style="margin:5px 0 10px 0;">预览文本</div>
                    <textarea id="browseText" style="height:250px;width:95%;margin: 0 auto;border:1px #eee solid;padding: 5px;color:black;">
                        &nbsp;&nbsp;甘肃省气象台10月8日发布预警信息，受持续性降水影响，预计未来24小时，太原大部、吕梁大部、晋中北部、忻州中部、临汾北部等地部分区域地质灾害预警等级为2级（有高风险）；阳泉大部、清徐县、娄烦县、灵丘县、榆社县、和顺县、昔阳县、太谷县、祁县、平遥县、五台县、代县、繁峙县、静乐县、隰县、蒲县、霍州市、兴县、岚县、汾阳市等地部分区域地质灾害预警等级为3级（有较高风险）；其余地区为3级以下。请相关部门做好地质灾害防治工作。
                    </textarea>
                </div>
                <button id="img_btn">出图</button>
                <img id="productImg" src="imgs/demo02.png" style="display:none;"/>
                <div id="alarmProductListDiv">
                    <div style="margin:5px 0 10px 10px;">产品文件列表</div>
                    <div id="list_word" class="productList"><div id="list_word_begin"><img style="width:20px;margin: 0 15px 0 15px;" src="imgs/icon_word.png"/><span>甘肃省地质灾害气象风险预警第45期.docx</span></div><div id="list_word_end"></div></div>
                    <div id="list_jpg" class="productList"><div id="list_jpg_begin"><img style="width:20px;margin: 0 15px 0 15px;" src="imgs/icon_jpg.png"/><span>甘肃省地质灾害气象风险预警第45期.jpg</span></div><div id="list_jpg_end"></div></div>
                    <div id="list_txt" class="productList"><div id="list_txt_begin"><img style="width:20px;margin: 0 15px 0 15px;" src="imgs/icon_txt.png"/><span>Z_SEVP_C_BERZ_20171010083000_P...</span></div><div id="list_txt_end"></div></div>
                </div>
            </div>
        `);
        //产品查询
        $("#menu_bd").append(`
            <div id="queryAlarmDiv" style="display:none;color: #eee;height: 99%;">
                <div id="product_shanhong" class="alarmProductDiv">
                    <div class="productTitle">山洪灾害气象风险预警产品</div>
                    <div id="product_list_sh" class="productContent"><div>空</div></div>
                    <input id="current_page_sh" type="hidden" value="0"/>
                    <input id="show_per_page_sh" type="hidden" value="0"/>
                    <div style="width: 100%;overflow-x: auto;"><div id="productTurnPage_sh"></div></div>
                </div>
                <div id="product_dizhizaihai" class="alarmProductDiv">
                    <div class="productTitle">地质灾害气象风险预警产品</div>
                    <div id="product_list_dz" class="productContent"><div>空</div></div>
                    <input id="current_page_dz" type="hidden" value="0"/>
                    <input id="show_per_page_dz" type="hidden" value="0"/>
                    <div style="width: 100%;overflow-x: auto;"><div id="productTurnPage_dz"></div></div>
                </div>
                <div id="product_heliu" class="alarmProductDiv">
                    <div class="productTitle">中小河流灾害气象风险预警产品</div>
                    <div id="product_list_hl" class="productContent"><div>空</div></div>
                    <input id="current_page_hl" type="hidden" value="0"/>
                    <input id="show_per_page_hl" type="hidden" value="0"/>
                    <div style="width: 100%;overflow-x: auto;"><div id="productTurnPage_hl"></div></div>
                </div>
                <div id="queryAlarmShowDiv">
                    <div id="queryAlarm_product" style="width: 90%;height: 100%;margin: 30px auto;"></div>
                </div>
            </div>
        `);
        //底部按钮&图例
        $("#menu_bd").append(`
            <div id='bottomMenu'>
                <div class="scenicCheck">
                    <input type="checkbox" id="checkbox1" value="5" flag="中小河流"/>中小河流<label for="checkbox1"></label>
                </div>
                <div class="scenicCheck">
                    <input type="checkbox" id="checkbox2" flag="山洪沟" value="5"/>山洪沟<label for="checkbox2"></label>
                </div>
                <div class="scenicCheck">
                    <input type="checkbox" id="checkbox3" flag="地质灾害隐患点" value="5"/>地质灾害隐患点<label for="checkbox3"></label>
                </div>
                <div class="scenicCheck">
                    <input type="checkbox" id="checkbox4" value="5" flag="中小河流new"/>中小河流(新)<label for="checkbox4"></label>
                </div>
            </div>
            <div id="riskLevelLegend">
                <ul>
                    <li><div style="background-color:blue;height:15px;width:15px;margin: 2px;float: left;"></div><div style="float: left;">有一定风险</div><div style="clear: both;"></div></li>
                    <li><div style="background-color:yellow;height:15px;width:15px;margin: 2px;float: left;"></div><div style="float: left;">风险较高</div><div style="clear: both;"></div></li>
                    <li><div style="background-color:orange;height:15px;width:15px;margin: 2px;float: left;"></div><div style="float: left;">风险高</div><div style="clear: both;"></div></li>
                    <li><div style="background-color:red;height:15px;width:15px;margin: 2px;float: left;"></div><div style="float: left;">风险很高</div><div style="clear: both;"></div></li>
                </ul>
            </div>
        `);
        $("#map_div").append(`
            <div id="modify_app"></div>
        `);
        $("#map_div").append(`
            <div id="hosPro_app"></div>
        `);
        $(".menu_changeDiv").html(`
            <div name='jcbj' class='menu_change active'>监测报警</div>
            <div name='yjzz' class='menu_change' style='margin-top: 5px;'>预警制作</div>
            <div name='cpcx' class='menu_change' style='margin-top: 5px;'>产品查询</div>
            <div name='lsgc' class='menu_change style='margin-top: 5px;'>历史过程</div>
            <div name='fzxg' class='menu_change' style='margin-top: 5px;'>阀值修改</div>
        `);
        $("#map_div").append(`
            <div id="alarmProductListWindow" class="alarmProductListWindow" style="display:none;">
            <button class="close closeProductWindow">&times;</button>
            <div id="productWindowTitle" class="thisTitle">文档</div>
            <div id="productShow" class="productShow">
                <div id="productShowWord" class="productShowList" style="display:none;width: 100%;height: 98%;"></div>
                <div id="productShowJpg" class="productShowList" style="display:none;width: 100%;height: 98%;"></div>
                <div id="productShowTxt" class="productShowList" style="display:none;width: 100%;height: 98%;"></div>
            </div>
            <div id="productControl" class="productControl">
                <button id="product_downloadBtn">下载</button>
                <button id="product_uploadBtn" onclick="fileupload.click();">上传</button>
                <input type="file"  id="fileupload" style="display: none;">
            </div>
            </div>
        `);
        //制作时间
        t.myDateSelecter = new DateSelecter(1, 1);
        t.myDateSelecter.intervalMinutes = 60;
        $("#dateSelect").html(t.myDateSelecter.div);
        $("#dateSelect").find("input").css("border", "1px solid #31CAFF").css("box-shadow", "none").css("color", "#eee").css("width", "210px").css("height", "22px");
        $("#dateSelect").find(".dateBtn").remove();

        //检测时间控制条
        t.myBarDateSelecter = new DateSelecter(2, 2);
        t.myBarDateSelecter.intervalMinutes = 60;
        $("#barDateSelect").html(t.myBarDateSelecter.div);
        $("#barDateSelect").find("input").css("height", "25px").css("background-color", "transparent").css("color", "#4DB8D7").css("width", "85px");
        $("#barDateSelect").find(".dateBtn").remove();

        //改变制作时间
        this.myBarDateSelecter.input.change(function () {
            var datetime = t.myBarDateSelecter.getCurrentTimeReal();
            var makeTimeHour = $("#selectMakeTime").val();
            setForecastTime(datetime, makeTimeHour);
            t.displayRainCover();
        });
        //改变制作时次
        $("#selectMakeTime").change(function () {
            var datetime = t.myBarDateSelecter.getCurrentTimeReal();
            var makeTimeHour = $("#selectMakeTime").val();
            setForecastTime(datetime, makeTimeHour);
            t.displayRainCover();
        });

        t.hourSpan = t.numbers[0];
        GDYB.GridProductClass.currentType = "prvn";
        GDYB.GridProductClass.currentVersion = "p";

        //初始化制作时间和预报时间
        var dateNow = new Date();
        if (GDYB.GridProductClass.currentMakeTime == null) {
            dateNow.setMinutes(0);
            dateNow.setSeconds(0);
        }
        else {
            var curTimeStr = GDYB.GridProductClass.currentMakeTime;
            var year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/, "$1"));
            var month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/, "$1"));
            var day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/, "$1"));
            var hour = parseInt(curTimeStr.replace(/\d*-\d*-\d* (\d*):\d*:\d*/, "$1"));
            var minutes = 0;
            var seconds = 0;
            dateNow.setFullYear(year, month - 1, day);
            dateNow.setHours(hour, minutes, seconds, 0);
        }
        if (dateNow.getHours() > 5 && dateNow.getHours() <= 16)
            $("#selectMakeTime").val(5);
        else
            $("#selectMakeTime").val(16);
        var makeTimeHour = $("#selectMakeTime").val();
        setForecastTime(dateNow, makeTimeHour);

        //根据制作时间，设置预报时间
        function setForecastTime(datetime, makeTimeHour) {
            if (typeof (datetime) == "undefined")
                datetime = t.myBarDateSelecter.getCurrentTimeReal();
            if (typeof (makeTimeHour) == "undefined")
                makeTimeHour = $("#selectMakeTime").val();
            if (GDYB.GridProductClass.currentType == "prvn") {
                if (makeTimeHour == 5)
                    datetime.setHours(8);
                else
                    datetime.setHours(20);
            }
            else if (GDYB.GridProductClass.currentType == "cty" || GDYB.GridProductClass.currentType == "cnty") {
                if (makeTimeHour == 5 || makeTimeHour == 10)
                    datetime.setHours(8);
                else
                    datetime.setHours(20);
            }
            t.myBarDateSelecter.setCurrentTime(datetime.format("yyyy-MM-dd hh:mm:ss"));

            datetime.setHours(makeTimeHour);
            GDYB.GridProductClass.currentMakeTime = datetime.format("yyyy-MM-dd hh:mm:ss");
            GDYB.GridProductClass.currentDateTime = t.myBarDateSelecter.getCurrentTime(false);
        }

        //测试数据
        $("#alarmMessageTable").html(`
            <ul>
            </ul>
        `);
        $("#monitoringAlarmTable").html(`
            <div style="height: 100%">
                <table border="1" width="100%">
                    <tr>
                        <td width="6%" rowspan="2">区域名</td>   <td width="6%" rowspan="2">类型</td>   <td width="8%" rowspan="2">ID</td>   <td colspan="6">1级临界阀值</td>   <td colspan="6">2级临界阀值</td>   <td colspan="6">3级临界阀值</td>   <td colspan="6">4级临界阀值</td>
                    </tr>
                    <tr>
                        <td width="3%">1h</td><td width="3%">3h</td><td width="3%">6h</td><td width="3%">24h</td><td width="3%">48h</td><td width="3%">72h</td>
                        <td width="3%">1h</td><td width="3%">3h</td><td width="3%">6h</td><td width="3%">24h</td><td width="3%">48h</td><td width="3%">72h</td>
                        <td width="3%">1h</td><td width="3%">3h</td><td width="3%">6h</td><td width="3%">24h</td><td width="3%">48h</td><td width="3%">72h</td>
                        <td width="3%">1h</td><td width="3%">3h</td><td width="3%">6h</td><td width="3%">24h</td><td width="3%">48h</td><td width="3%">72h</td>
                    </tr>
                </table>
            </div>
        `);
        /*end*/

        var userName = GDYB.GridProductClass.currentUserName;
        if (userName == null) {
            alertModal("请注意，您尚未登录！");
        }
        else {
            var param = '{"userName":' + userName + '}';
            $.ajax({
                type: 'post',
                url: userServiceUrl + "services/UserService/getIssuer",
                data: { 'para': param },
                dataType: 'text',
                error: function () {
                    alertModal('获取签发人错误!');
                },
                success: function (data) {
                    if (data == "[]") {
                        alertModal("未查询到签发人");
                    }
                    else {
                        var issuers = jQuery.parseJSON(data);
                        for (var key in issuers) {
                            var issuer = issuers[key];
                            $("#selectQianFaRen").append("<div>" + issuer.name + "</div>");
                        }
                        $("#selectQianFaRen").find("div").click(function () {
                            $("#issueor").find("input").val($(this).html());
                            $("#selectQianFaRen").find("div").css("background-color", "");
                            $("#selectQianFaRen").find("div").css("color", "");
                            $(this).css("background-color", "rgb(116,173,213)").css("color", "#ffffff");
                        });
                        $("#issueor").find("input").val($("#selectQianFaRen").find("div").eq(0).html());
                        $("#selectQianFaRen").find("div").eq(0).css("background-color", "rgb(116,173,213)").css("color", "#ffffff");
                    }
                }
            });
        }

        //切换菜单
        $(".menu_changeDiv").find(".menu_change").click(function () {
            if ($(this).hasClass("active"))
                return;
            $(".menu_changeDiv").find(".active").removeClass("active");
            $(this).addClass("active");
            if(t.modifyIsLoad){
                t.vueModify.visiable = "none";
            }
            var selectName = $(this).attr("name");
            if (selectName == "jcbj") {
                $("#alarmDatetime").css("display", "none");
                $("#monitoringAlarmDiv").css("display", "block");
                $("#makeAlarmDiv").css("display", "none");
                $("#queryAlarmDiv").css("display", "none");
                t.getAlertMsg();
            }
            else if (selectName == "yjzz") {
                $("#monitoringAlarmDiv").css("display", "none");
                $("#makeAlarmDiv").css("display", "block");
                $("#queryAlarmDiv").css("display", "none");
                //t.getProductTime();
                t.getIssue();
                t.updateRiskAlertDisplay();
            }
            else if (selectName == "cpcx") {
                $("#monitoringAlarmDiv").css("display", "none");
                $("#makeAlarmDiv").css("display", "none");
                $("#queryAlarmDiv").css("display", "block");
                t.getProductList(t.addTurnPages);
            } 
            else if(selectName == "fzxg") {
                $("#displayBtn").click();
                t.initiModifyFun();
            }
            else if(selectName = "lsgc"){
                $("#alarmDatetime").css("display", "block");
                $("#monitoringAlarmDiv").css("display", "block");
                $("#makeAlarmDiv").css("display", "none");
                $("#queryAlarmDiv").css("display", "none");
                t.getAlertMsg();
            }
            if ($("#pointCorrection").hasClass("active")) {//关闭画图
                $("#pointCorrection").click();
            }
            if ($("#areaEdit").hasClass("active")) {
                $("#areaEdit").click();
            }
        });

        //预警制作按钮事件
        $("#alarmFormButton button").click(function () {
            var btnId = $(this).attr("id");
            if (btnId == "make_alarm") {
                t.inversionText();
            }
            else if (btnId == "make_product") {
                confirmModal("确认生成产品？", async function () {
                    t.makeDatagram();
                    await t.creatAlarmWord();
                });
            }
            else if (btnId == "make_uploadProduct") {
                t.uploadProduct();
            }
        });
        $("#dropZoneCorrection .dropZoneLevel").click(function () {
            //一定要选中订正
            var dzSelectSize = $("#dropZoneType button.active").length;
            if (dzSelectSize < 1) {
                return;
            }
            var dropLevel = $(this).attr("value");
            var level = parseInt(dropLevel);
            t.updateLevel(level);
        });
        // $("#dropZoneCorrection #dropZoneType").find("button").click(function(){
        //     $("#dropZoneCorrection #dropZoneType button").removeClass("active");
        //     $(this).addClass("active");
        //     var dropType = $(this).attr("id");

        //});

        //预警制作栏产品展示
        $("#alarmProductListDiv .productList").click(function () {
            $("#alarmProductListWindow").css("display", "block");
            $("#productShow .productShowList").hide();
            if ($(this).attr("id") == "list_word") {
                $("#productWindowTitle").html("文档");
                $("#productShowWord").show();
            }
            else if ($(this).attr("id") == "list_jpg") {
                $("#productWindowTitle").html("图像");
                $("#productShowJpg").show();
            }
            else if ($(this).attr("id") == "list_txt") {
                $("#productWindowTitle").html("文本");
                $("#productShowTxt").show();
            }
            else { }
        });
        $("#alarmProductListWindow .closeProductWindow").click(function () {
            $("#alarmProductListWindow").css("display", "none");
        });

        //文字横向滚动
        $("#alarmProductListDiv .productList").each(function () {
            var divId = $(this).attr("id");
            scrollSpanLeft(divId);
        });
        function scrollSpanLeft(divId) {
            var speed = 20;
            var MyMar = null;
            var scroll_begin = $("#" + divId + "_begin")[0];
            var scroll_end = $("#" + divId + "_end")[0];
            var scroll_div = $("#" + divId)[0];
            scroll_end.innerHTML = scroll_begin.innerHTML;
            function Marquee() {
                if (scroll_end.offsetWidth - scroll_div.scrollLeft <= 0)
                    scroll_div.scrollLeft -= scroll_begin.offsetWidth;
                else
                    scroll_div.scrollLeft++;
            }
            function backStart() {
                scroll_div.scrollLeft = 0;
            }
            scroll_div.onmouseover = function () {
                MyMar = setInterval(Marquee, speed);
            };
            scroll_div.onmouseout = function () {
                clearInterval(MyMar);
                backStart();
            };
        }

        //按钮事件
        $("#alarmStrategy").find("button").click(function () {
            $("#alarmStrategy").find("button").removeClass("active");
            $(this).addClass("active");
            var type = $(this).attr("id");
            t.getAlertMsg();
        });
        $("#riskType").find("button").click(function () {
            if ($(this).hasClass("active"))
                $(this).removeClass("active");
            else
                $(this).addClass("active");
            t.getAlertMsg();
        });

        //面雨量时间轴点击事件
        var isClick = false;
        $("#timeChooseBar").find("li").hover(function () {
            isClick = false;
            var tt = this;
            var f = parseInt($(tt).attr("flag"));
            $("#timeChooseBar li").each(function () {
                var f1 = parseInt($(this).attr("flag"));
                if (f > 0 && f1 > 0 && f1 <= f) {
                    $(this).css({ "background-color": "rgb(32,161,255)", "color": "#eee" });
                }
                if (f < 0 && f1 < 0 && f1 >= f) {
                    $(this).css({ "background-color": "rgb(32,161,255)", "color": "#eee" });
                }
            });
        }, function () {
            if (isClick)
                return;
            $("#timeChooseBar li").each(function () {
                $(this).css({ "background-color": "", "color": "" });
            });
        });
        $("#timeChooseBar").find("li").click(function () {
            if ($(this).hasClass("active")) {
                if (GDYB.GridProductClass.layerFillRangeColor != null) {
                    GDYB.GridProductClass.layerFillRangeColor.setDatasetGrid(null);
                }
                $(this).removeClass("active");
                return;
            }
            else {
                $(this).addClass("active");
            }
            $("#timeChooseBar li").css({ "background-color": "", "color": "" });
            isClick = true;
            var tt = this;
            var f = parseInt($(tt).attr("flag"));
            $("#timeChooseBar li").each(function () {
                var f1 = parseInt($(this).attr("flag"));
                if (f > 0 && f1 > 0 && f1 <= f) {
                    $(this).css({ "background-color": "rgb(32,161,255)", "color": "#eee" });
                }
                if (f < 0 && f1 < 0 && f1 >= f) {
                    $(this).css({ "background-color": "rgb(32,161,255)", "color": "#eee" });
                }
            });
            $("#monitoringAlarmTableDiv").css("display", "block");
            $("#riskLevelLegend").css("display", "none");
            t.displayRainCover(f);
        });
        $("#displayTableDiv").click(function () {
            $("#monitoringAlarmTableDiv").css("display", "none");
            $("#riskLevelLegend").css("display", "block");
        });
        await initRes();//先初始化资源
        event();//再初始化事件
        t.getAlertMsg();
        function event() {
            //t.getShpInfo("中小河流");
            $("#bottomMenu input").change(function (item) {
                var ischecked = $(this).prop("checked");
                var type = $(this).attr("flag");
                if (ischecked) {
                    t.displayShp(type);
                    //t.getShpInfo(type);
                }
                else {
                    var lmu = new LayerManagerUtil();
                    var layer = lmu.getLayer(type);
                    layer.removeAllFeatures();
                }
            });
            $("#areaEdit").on("click", function () {
                if ($("#pointCorrection").hasClass("active")) {
                    $("#pointCorrection").click();
                }
                if ($(this).hasClass("active")) {
                    t.drawPolygon.deactivate();
                    $(this).removeClass("active");
                    startDragMap();
                    t.unSelectObj();
                }
                else {
                    t.drawPolygon.activate();
                    $(this).addClass("active");
                    stopDragMap();
                }
            });
            //站点
            $("#pointCorrection").on("click", function () {
                if ($("#areaEdit").hasClass("active")) {
                    $("#areaEdit").click();
                }
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    startDragMap();
                }
                else {
                    $(this).addClass("active");
                    stopDragMap();
                }
            });
            $("#alarmType").change(function () {
                t.updateRiskAlertDisplay();
            });
            $("#forecastHourspan").change(function () {
                t.updateRiskAlertDisplay();
            });
            $("#dmapTools .qxfxTools").on("click", function () {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                }
                else {
                    $(this).addClass("active");
                }
            });
            //注册鼠标点击事件
            GDYB.Page.curPage.map.events.register("mouseup", GDYB.Page.curPage.map, function (event) {
                t.mouseUp(event);
            });
            $(".close").on("click", function () {
                $(this).parent().css("display", "none");
            });

            $("#img_btn").on("click",function(){
                var dic = "C:/Users/lenovo/Desktop/temp/";
                var fileName = "kg.png";
                t.outputImg(dic,fileName);
            });

            $("#product_downloadBtn").on("click",t.downloadFile);
            //$("#product_uploadBtn").on("click",t.uploadFile);

            $("#fileupload").change(function(){
                t.uploadFile();
            });

            //改变获取时间
            t.warningDatetime.input.change(function () {
                t.getAlertMsg(true);
            });

            //实况面雨量时效
            $("#selectLiveTime").change(function () {
                var liveHS = $(this).val();
                t.displayRainCover(liveHS);
            });
        }
        /**
        * @author:wangkun
        * @date:2017-10-19
        * @param:
        * @return:
        * @description:初始化资源
        */
        async function initRes() {
            t.warningDatetime = new DateSelecter(1, 1);
            t.warningDatetime.intervalMinutes = 60;
            $("#warningDatetime").html(t.warningDatetime.div);
            $("#warningDatetime").find("input").css("height", "30px").css("background-color", "transparent").css("color", "#4DB8D7").css("width", "140px");

            await t.getAllCounty();
            var lmu = new LayerManagerUtil();
            //初始化河流图层
            var riverLayer = new WeatherMap.Layer.LocalTiledCacheLayerRiver();
            riverLayer.setIsBaseLayer(false);
            GDYB.Page.curPage.map.addLayers([riverLayer]);
            //初始化基础图层
            t.disasterLayer = lmu.addLayer("地质灾害隐患点", "vector");
            t.shLayer = lmu.addLayer("山洪沟", "vector");
            t.riverLayer = lmu.addLayer("中小河流", "vector");
            t.newRiverLayer = lmu.addLayer("中小河流new", "vector");
            //画图图层
            var lmu = new LayerManagerUtil();
            var layer = lmu.addLayer("画图图层", "vector");
            layer.style = {
                fill: false,
                stroke: false
            };
            t.drawPolygon = new WeatherMap.Control.DrawFeature(layer, WeatherMap.Handler.PolygonFree);
            t.drawPolygon.events.on({ "featureadded": t.drawCompeleted });
            GDYB.Page.curPage.map.addControl(t.drawPolygon);

            //t.dMapTool = new dMapTools();
            GDYB.dMapTools.registerDrawControl(t.drawPolygon);
            //请求基础数据
            var types = ["中小河流", "山洪沟", "地质灾害隐患点","中小河流new"];
            t.riverData = await t.getShpInfo(types[0]);
            t.shgData = await t.getShpInfo(types[1]);
            t.disasterPTData = await t.getShpInfo(types[2]);
            t.newRiverData = await t.getShpInfo(types[3]);
            console.log("初始化完成!");
        }
    };
    /**
     * @author:dinlerkey
     * @date:2017-10-18
     * @param:
     * @return:
     * @description:面雨量显示
     */
    this.displayRainCover = function (hs) {
        if (typeof (hs) === "string") {
            hs = parseInt(hs);
        }
        if (hs > 1) {//预报
            t.getForcastDG(hs);
        }
        else if (hs < 0) {//实况
            t.getLiveDG(hs);
        }

    };
    /**
    * @author:wangkun
    * @date:2017-10-18
    * @param:
    * @return:
    * @description:获取预警消息
    */
    this.getAlertMsg = function () {
        var selectName = $(".menu_changeDiv").find(".active").attr("name");
        isHos = selectName==="lsgc"?true:false;
        var strDatetime = "";
        if(isHos){
            var date = t.warningDatetime.getCurrentTimeReal();
            strDatetime = date.format("yyyy-MM-dd hh:00:00");
        }
        else{
            var date = new Date();
            strDatetime = date.format("yyyy-MM-dd hh:00:00");
        }
        var strategy = $("#alarmStrategy button.active").attr("flag");
        strategy = parseInt(strategy);
        var types = [];
        var no_types = [];
        $("#riskType button").each(function () {
            var thisType = $(this).attr("flag");
            if ($(this).hasClass("active")) {
                types.push(thisType);
            }
            else {
                no_types.push(thisType);
            }
        });
        //移除未选中的
        no_types.forEach(item => {
            var lmu = new LayerManagerUtil();
            var layer = lmu.getLayer(item + "Alert");
            if (layer != null) {
                layer.removeAllFeatures();
            }
        });
        var index = 0;
        types.forEach(item => {
            var param = {
                types: item,
                strategy: strategy,
                datetime: strDatetime
            };
            param = JSON.stringify(param);
            var url = flashFloodServiceUrl + "ProductService/getLastFlashFloodByType";
            AJAX(url, param, function () {

            }, function (data) {
                if(!isHos){
                    t.setAlertData(item, data);
                }
                t.displayRiskAlert(item, data);
                index++;
                if (index == types.length) {//显示预警列表
                    t.showAlertList();
                }
            });
        });
    };
    /**
     * @author:wangkun
     * @date:2017-10-19
     * @param:
     * @return:
     * @description:获取shp文件信息
     */
    this.getShpInfo = function (type) {
        var param = {
            type: type
        };
        param = JSON.stringify(param);
        var url = flashFloodServiceUrl + "ProductService/getShpByType";
        var pro = new Promise(function (resolve, reject) {
            AJAX(url, param, function () {
                resolve("err");
            }, function (data) {
                resolve(data);
            });
        });
        return pro;
    };
    /**
     * @author:wangkun
     * @date:2017-10-19
     * @param:
     * @return:
     * @description:显示shp数据
     */
    this.displayShp = function (name) {
        var data = t.getShpDataByName(name);
        var lmu = new LayerManagerUtil();
        var layer = lmu.addLayer(name, "vector");
        layer.removeAllFeatures();
        var vectors = [];
        var labels = [];
        data.features.forEach(item => {
            var geoID = t.getValueFromFiled(item.fieldNames, item.fieldValues, "ID");
            var name = t.getValueFromFiled(item.fieldNames, item.fieldValues, "Name");
            var geo = item.geometry;
            var datatype = geo.type;
            var labelStyle = {
                fontColor:"red",
                fontSize:"1.0em"
            };
            if (datatype === "REGION") {
                var style = {
                    label:name,
                    fontColor:"purple",
                    fillColor: "#9BE1FF",
                    strokeWidth: 2,
                    fillOpacity: 0.6,
                    strokeColor: "#6868FF"
                };
                var pointArray = [];
                geo.points.forEach(itemP => {
                    var point = new WeatherMap.Geometry.Point(itemP.x, itemP.y);
                    pointArray.push(point);
                });
                var linearRings = new WeatherMap.Geometry.LinearRing(pointArray);
                var vector = new WeatherMap.Feature.Vector(linearRings, null, style);
                vector.id = geoID;
                vectors.push(vector);
            }
            else if (datatype === "POINT") {
                var style = {
                    label:name,
                    fontColor:"purple",
                    fontSize:6,
                    strokeColor: "#9BE1FF",
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    pointRadius: 3
                };
                var pt = geo.points[0];
                var geoPT = new WeatherMap.Geometry.Point(pt.x, pt.y);
                var vector = new WeatherMap.Feature.Vector(geoPT, null, style);
                vector.id = geoID;
                vectors.push(vector);
            }
        });
        layer.addFeatures(vectors);
    };
    /**
     * @author:wangkun
     * @date:2017-10-19
     * @param:
     * @return:
     * @description:显示风险区域
     */
    this.displayRiskAlert = function (name, data) {
        var lmu = new LayerManagerUtil();
        var layer = lmu.addLayer(name + "Alert", "vector");
        layer.removeAllFeatures();

        var allFeatureData = t.getShpDataByName(name);
        var vectors = [];
        allFeatureData.features.forEach(item => {
            var nameSize = item.fieldNames.length;
            var geoName = t.getValueFromFiled(item.fieldNames, item.fieldValues, "Name");
            var geoID = t.getValueFromFiled(item.fieldNames, item.fieldValues, "ID");
            var findItem = data.find(item => {
                return item.id == geoID;
            });
            if (findItem == undefined || findItem == null) {
                return;
            }
            var level = findItem.level;
            var color = t.levelColor[level];
            var hourspan = findItem.hourspan;
            var productID = findItem.productid;
            var strDateTime = findItem.datetime;
            var geo = item.geometry;
            var dataType = geo.type;
            var rain = findItem.rain;
            if (dataType === "REGION") {
                var style = {
                    fill: true,
                    fillColor: color,
                    fillOpacity: 0.8,
                    stroke: false
                };
                var pointArray = [];
                geo.points.forEach(itemP => {
                    var point = new WeatherMap.Geometry.Point(itemP.x, itemP.y);
                    pointArray.push(point);
                });
                var linearRings = new WeatherMap.Geometry.LinearRing(pointArray);
                var vector = new WeatherMap.Feature.Vector(linearRings, null, style);
                vector.level = level;
                vector.hourspan = hourspan;
                vector.geoID = geoID;
                vector.name = geoName;
                vector.rain = rain;
                vector.productid = productID;
                vector.datetime = strDateTime;
                vectors.push(vector);
            }
            else if (dataType === "POINT") {
                var style = {
                    fill: true,
                    fillColor: color,
                    stroke: false,
                    strokeColor: color,
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    pointRadius: 3
                };
                var pt = geo.points[0];
                var geoPT = new WeatherMap.Geometry.Point(pt.x, pt.y);
                var vector = new WeatherMap.Feature.Vector(geoPT, null, style);
                vector.level = level;
                vector.hourspan = hourspan;
                vector.geoID = geoID;
                vector.name = geoName;
                vector.rain = rain;
                vector.productid = productID;
                vector.datetime = strDateTime;
                vectors.push(vector);
            }
        });
        layer.addFeatures(vectors);
        //setTimeout(t.inversionText, 10);
    };
    /**
     * @author:wangkun
     * @date:2017-10-19
     * @param:
     * @return:
     * @description:绘制完成
     */
    this.drawCompeleted = function (event) {
        var modeName = $("#menu_changeDiv div.active").attr("name");
        if (modeName === "jcbj") {
            t.jkDrawed(event);
        }
        else if (modeName === "yjzz") {
            t.zzDrawed(event);
        }
        else if(modeName === "fzxg"){
            t.modifyDrawed(event);
        }
    };
    this.zzDrawed = function (event) {
        var type = $("#alarmType option:selected").attr("flag");
        var lmu = new LayerManagerUtil();
        var alertLayer = lmu.getLayer(type + "Alert");
        if (alertLayer == null) {
            console.log("预警图层为空!");
            return;
        }
        var feature = event.feature;
        var drawGeo = feature.geometry;
        var allFeature = alertLayer.features;
        var allShowData = [];
        allFeature.forEach(item => {
            var thisGeo = item.geometry;
            //1、不相交的
            var dis = thisGeo.distanceTo(drawGeo, {
                details: false,
                edge: true
            });
            if (dis != 0) {
                //2、计算中心中是否被包含
                var isContain = drawGeo.containsPoint(thisGeo.getCentroid());
                if (!isContain) {
                    item.style.stroke = false;
                    item.selected = false;
                    return;
                }
            }
            item.style.stroke = true;
            item.style.strokeColor = "green";
            item.style.strokeWidth = 4;
            item.selected = true;
        });
        alertLayer.redraw();
    }
    /**
     * @author:wangkun
     * @date:2017-11-16
     * @modifydate:2017-11-16
     * @param:
     * @return:
     * @description:修改功能绘制完成
     */
    this.modifyDrawed = function (event) {
        var type = $(".selector").find("option:selected").text();
        var lmu = new LayerManagerUtil();
        var alertLayer = lmu.getLayer(type);
        if (alertLayer == null) {
            console.log("预警图层为空!");
            return;
        }
        var feature = event.feature;
        var drawGeo = feature.geometry;
        var allFeature = alertLayer.features;
        var allShowData = [];
        var ids = [];
        allFeature.forEach(item => {
            var thisGeo = item.geometry;
            //1、不相交的
            var dis = thisGeo.distanceTo(drawGeo, {
                details: false,
                edge: true
            });
            if (dis != 0) {
                //2、计算中心中是否被包含
                var isContain = drawGeo.containsPoint(thisGeo.getCentroid());
                if (!isContain) {
                    item.style.stroke = false;
                    item.selected = false;
                    return;
                }
            }
            item.style.stroke = true;
            item.style.strokeColor = "green";
            item.style.strokeWidth = 4;
            item.selected = true;
            ids.push(item.id);
        });
        alertLayer.redraw();
        t.getDetailByIdsAndType(ids,type);
    }
    this.jkDrawed = function (event) {
        var lmu = new LayerManagerUtil();
        var allShowData = [];
        $("#bottomMenu input").each(function(){
            if(!$(this).is(':checked')){
                return;
            }
            var thisType = $(this).attr("flag");
            var shpLayer = lmu.getLayer(thisType);
            if (shpLayer == null) {
                console.log("图层为空!");
                return;
            }
            var feature = event.feature;
            var drawGeo = feature.geometry;
            var allFeature = shpLayer.features;
            allFeature.forEach(item => {
                var thisGeo = item.geometry;
                //1、不相交的
                var dis = thisGeo.distanceTo(drawGeo, {
                    details: false,
                    edge: true
                });
                if (dis != 0) {
                    //2、计算中心中是否被包含
                    var isContain = drawGeo.containsPoint(thisGeo.getCentroid());
                    if (!isContain) {
                        item.style.stroke = false;
                        item.selected = false;
                        return;
                    }
                }
                allShowData.push({
                    name: thisType,
                    data: item
                });
            });
        });
        t.updateTable(allShowData);
    }
    /**
     * @author:wangkun
     * @date:2017-10-19
     * @param:
     * @return:
     * @description:更新等级
     */
    this.updateLevel = function (level) {
        var lmu = new LayerManagerUtil();
        var type = $("#alarmType option:selected").attr("flag");
        var alertLayer = lmu.getLayer(type + "Alert");
        if (alertLayer == null) {
            console.log("预警图层为空!");
            return;
        }
        var allFeature = alertLayer.features;
        allFeature.forEach(item => {
            if (item.selected) {
                item.style.fillColor = t.levelColor[level];
                item.level = level;
            }
        });
        alertLayer.redraw();
        setTimeout(t.inversionText, 10);
    };
    /**
     * @author:dinlerkey
     * @date:2017-10-19
     * @param:word替换字段
     * @return:
     * @description:生成word
     */
    this.creatAlarmWord = async function () {
        var titleDate = t.myDateSelecter.getCurrentTime(false).replace(/-/g, "").replace(/\s/g, "").replace(/:/g, "").substr(0, 12);
        var title = $("#alarmType").val();
        var year = t.myDateSelecter.getCurrentTime(false).substr(0, 4);
        var issue = $("#alarmIssue").val();
        var fileName = t.makeProductFileName();
        var productName = title + "产品/" + title + "-第" + issue + "期/"+fileName;
        var signer = $("#alarmSigner").val();
        var maker = $("#alarmForecastor").val();
        var dateTime = t.myDateSelecter.getCurrentTime(true).replace(/\s/g, "").substr(0, 14);
        var alarmContent = title.replace("气象风险预警", "") + t.mostAlarmLevel;
        var txtContent = $("#browseText").val();
        //获取图片
        var childDic = title + "产品/" + title + "-第" + issue + "期/";
        var img = await t.outputImg(productDic+childDic,fileName+".png");
        if (img.suc == null) {
            return;
        }
        img = img.suc;
        //var imgElement = document.getElementById("productImg");
        //var data = t.getBase64Image(imgElement);
        //var img = data.replace("data:image/png;base64,", "");
        //参数
        var param = {
            templateName: "alarm.ftl",
            productName: productName + ".doc",
            title: title,
            year: year,
            issue: issue,
            signer: signer,
            maker: maker,
            dateTime: dateTime,
            alarmContent: alarmContent,
            txtContent: txtContent,
            img: img
        };
        param = JSON.stringify(param);
        var url = archiveService + "services/ArchiveService/createProduct";
        $.ajax({
            data: { "para": param },
            url: url,
            dataType: "json",
            success: function (data) {
                if (data) {
                    alertModal("生成产品成功");
                    //wordDownload();//下载到本地

                    //t.turnWordToPdf(productName + ".doc");//生成PDF并展示

                    t.freshAlarmProductList(childDic+fileName);//报警产品列表刷新
                }
                else
                    alertModal("生成产品失败");
            },
            error: function (data) {
                t.freshAlarmProductList(childDic+fileName);//报警产品列表刷新
            },
            type: "POST"
        });
    };
    //图片转码
    this.getBase64Image = function (img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);

        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
        // return dataURL.replace("data:image/png;base64,", "");
    };
    /**
     * @author:dinlerkey
     * @date:2017-10-24
     * @param:产品名称
     * @return:
     * @description:报警产品列表刷新
    */
    this.freshAlarmProductList = function (productName) {
        $("#alarmProductListDiv").css("display", "block");
        var pdfPath = host+"/products/archive/" + productName + ".pdf";
        var jpgPath = host+"/products/archive/" + productName + ".png";
        var txtPath = host+"/products/archive/" + productName + ".txt";
        //var productNames = productName.split("/");
        //var productName = productNames[1];
        var index = productName.lastIndexOf("/");
        var name = productName.substring(index+1,productName.length);
        $("#list_word span").html(name+".pdf");
        $("#list_jpg span").html(name+".png");
        $("#list_txt span").html(name+".txt");
        $("#alarmProductListWindow #productShow #productShowWord").html('<iframe src=' + pdfPath + '></iframe>');
        $("#alarmProductListWindow #productShow #productShowJpg").html(' <img src=' + jpgPath + ' />');
        $("#alarmProductListWindow #productShow #productShowTxt").html('<iframe src=' + txtPath + '></iframe>');
    };
    /**
     * @author:wangkun
     * @date:2017-10-19
     * @param:
     * @return:
     * @description:反演文字
     */
    this.inversionText = async function () {
        //获取类型
        var type = $("#alarmType option:selected").attr("flag");
        var isPT = false;
        if (type === "地质灾害隐患点") {
            isPT = true;
        }
        //预警区域
        var lmu = new LayerManagerUtil();
        var alertLayer = lmu.getLayer(type + "Alert");
        if (alertLayer == null) {
            console.log("预警图层为空!");
            return;
        }
        var allFeature = alertLayer.features;
        //排序
        allFeature.sort(compare('level'));//按等级排序
        var riskMsg = "&emsp;&emsp;";
        var result = await t.getCountyRain();
        var strCounty = "";
        if(result.suc!=null&&result.suc.length>0){
            var size = result.suc.length;
            var maxRain = result.suc[0].value;
            result.suc.forEach(item=>{
                var name = item.countyName;
                var val = item.value;
                if(val<0.1){
                    return;
                }
                strCounty+=name;
                strCounty+="、";
            });
            strCounty = strCounty.substring(0,strCounty.length-1);
            strCounty+="等地区，最大降水量达到";
            strCounty+=maxRain;
            strCounty+="mm。";
        }
        riskMsg+=strCounty;
        var maxCount = 10;
        for (var i = 1; i <= 4; i++) {
            var thisFeatures = allFeature.filter(item => {
                return item.level == i;
            });
            var levelT = t.levelTxt[i];
            var tempTxt = "";
            thisFeatures.forEach(item => {
                if (maxCount < 0) {
                    return;
                }
                var name = item.name;
                tempTxt += name;
                tempTxt += "、";
                maxCount--;
            });
            if (tempTxt.length < 1) {
                continue;
            }
            tempTxt = tempTxt.substring(0, tempTxt.length - 1);
            if (tempTxt.length > 0) {
                tempTxt += levelT;
            }
            tempTxt += ",";
            riskMsg += tempTxt;
        }
        riskMsg = riskMsg.substring(0, riskMsg.length - 1);
        riskMsg += "。";
        $("#browseText").html(riskMsg);
        console.log("反演完成!");
    };
    /**
     * @author:wangkun
     * @date:2017-10-19
     * @param:
     * @return:
     * @description:获取所有区县
     */
    this.getAllCounty = async function () {
        var url = flashFloodServiceUrl + "AdminDivisionService/getCounty";
        var pro = new Promise(function (resolve, reject) {
            AJAX(url, "", function () {
                resolve("err");
            }, function (data) {
                //转对象
                data.forEach(item => {
                    var obj = JSON.parse(item);
                    var name = obj.fieldValues[0];
                    var pointArray = [];
                    obj.geometry.points.forEach(itemP => {
                        var point = new WeatherMap.Geometry.Point(itemP.x, itemP.y);
                        pointArray.push(point);
                    });
                    var linearRings = new WeatherMap.Geometry.LinearRing(pointArray);
                    var thisRegion = new WeatherMap.Geometry.Polygon([linearRings]);
                    thisRegion.name = name;
                    t.allCounty.push(thisRegion);
                });
                resolve(data);
            });
        });
        return pro;
    };
    /**
     * @author:wangkun
     * @date:2017-10-19
     * @param:
     * @return:
     * @description:根据名称获取shp数据
     */
    this.getShpDataByName = function (name) {
        var data = {};
        if (name === "中小河流") {
            data = t.riverData;
        }
        else if (name === "山洪沟") {
            data = t.shgData;
        }
        else if (name === "地质灾害隐患点") {
            data = t.disasterPTData;
        }
        else if (name === "中小河流new") {
            data = t.newRiverData;
        }
        return data;
    };
    /**
     * @author:wangkun
     * @date:2017-10-20
     * @param:
     * @return:
     * @description:更新表格
     */
    this.updateTable = function (data) {
        $("#monitoringAlarmTableDiv").css("display", "block");
        $("#monitoringAlarmTable table tr[flag='data']").remove();//清除已有数据
        var hours = [1, 3, 6, 24,48,72];
        data.forEach(item => {
            var type = item.name;
            var thisData = item.data;
            var allFeatureData = t.getShpDataByName(type);
            var name = thisData.name;
            var geoID = thisData.id;
            var findFeature = allFeatureData.features.find(itemC => {
                var tempID = t.getValueFromFiled(itemC.fieldNames, itemC.fieldValues, "ID");
                return tempID == geoID;
            });
            var name = t.getValueFromFiled(findFeature.fieldNames, findFeature.fieldValues, "Name");
            var html = "<tr flag='data'>";

            html += "<td>";
            html += name;
            html += "</td>";//名称
            var itemType = t.getValueFromFiled(findFeature.fieldNames, findFeature.fieldValues, "Type");
            html += "<td>";
            html += itemType;
            html += "</td>";//类型
            html += "<td>";
            html += geoID;
            html += "</td>";//ID
            for (var l = 1; l <= 4; l++) {
                for (var h = 0; h < 6; h++) {
                    var txtF = "L" + l + "_H" + hours[h];
                    var val = t.getValueFromFiled(findFeature.fieldNames, findFeature.fieldValues, txtF);
                    html += "<td>";
                    html += val;
                    html += "</td>";//ID
                }
            }
            html += "</tr>";
            $("#monitoringAlarmTable table tbody").append(html);
        });
    };
    this.unSelectObj = function () {
        var type = $("#alarmType option:selected").attr("flag");
        var lmu = new LayerManagerUtil();
        var alertLayer = lmu.getLayer(type + "Alert");
        var allFeature = alertLayer.features;
        allFeature.forEach(item => {
            item.style.stroke = false;
        });
        alertLayer.redraw();
    };
    this.getForcastDG = async function (hs) {
        if (hs < 3) {
            return;
        }
        var targetDG = null;
        var max = 0
        var index = 0;
        var count = hs/3;
        var countIndex = 1;
        $("#div_progress").css("display", "block");
        $("#div_progress_title").html("正在计算，请稍等...");
        for (var i = 3; i <= hs; i += 3) {
            var dg = await t.getGrid(i);
            if (targetDG == null) {
                targetDG = dg;
            }
            else {
                var noVal = dg.noDataValue;
                var curGrid = dg.grid;
                var targetGrid = targetDG.grid;
                var size = curGrid.length;
                for (var z = 0; z < size; z++) {
                    var curVal = curGrid[z];
                    var oldVal = targetGrid[z];
                    var sum = curVal + oldVal;
                    if (sum > max) {
                        max = sum;
                        index = z;
                    }
                    if (sum > 0.1) {
                        sum = Number(sum.toFixed(1));
                    }
                    targetGrid[z] = sum;
                }
            }
            countIndex++;
            var process = 100*countIndex/count;
            $("#div_progress_title").html("已完成"+process+"%");
        }
        $("#div_progress").css("display", "none");
        if (GDYB.GridProductClass.layerFillRangeColor == null) {
            GDYB.GridProductClass.layerFillRangeColor = new WeatherMap.Layer.FillRangeColorLayer("heatMap", { "radius": 40, "featureWeight": "value", "featureRadius": "geoRadius" });
            GDYB.Page.curPage.map.addLayers([GDYB.GridProductClass.layerFillRangeColor]);
            GDYB.GridProductClass.layerFillRangeColor.isAlwaySmooth = false;
            GDYB.GridProductClass.layerFillRangeColor.isSmooth = true;
            GDYB.GridProductClass.layerFillRangeColor.items = GDYB.GridProductClass.getFillColorItems("r3");
        }
        GDYB.GridProductClass.layerFillRangeColor.setDatasetGrid(targetDG);
        GDYB.GridProductClass.layerFillRangeColor.refresh();
    };
    this.getGrid = function (hs) {
        var pro = new Promise(function (resolve, reject) {
            GDYB.GridProductClass.getGrid(resolve, "r3", "prvn", "1000", hs, GDYB.GridProductClass.currentMakeTime, "p", GDYB.GridProductClass.currentDateTime, false);
        });
        return pro;
    },
    this.updateRiskAlertDisplay = function () {
        var lmu = new LayerManagerUtil();
        //全部移除
        t.types.forEach(item => {
            var alertLayer = lmu.getLayer(item + "Alert");
            if (alertLayer == null) {
                return;
            }
            alertLayer.removeAllFeatures();
            alertLayer.redraw();
        });
        var type = $("#alarmType option:selected").attr("flag");
        var data = t.getAlertData(type);
        //获取预报时效
        var strHour = $("#forecastHourspan option:selected").text();
        strHour = strHour.replace("小时");
        var hour = parseInt(strHour);
        var alertLayer = lmu.getLayer(type + "Alert");
        if (alertLayer == null) {
            return;
        }
        //获取shp中对象
        var shpLayer = t.getShpDataByName(type);
        var shpFeatures = shpLayer.features;
        //全部显示
        var vectors = [];
        shpFeatures.forEach(item => {
            var geoName = t.getValueFromFiled(item.fieldNames, item.fieldValues, "Name");
            var geoID = t.getValueFromFiled(item.fieldNames, item.fieldValues, "ID");
            var findItem = data.find(item => {
                return item.id == geoID;
            });
            var color = "#9BE1FF";
            var level = 0;
            var hourspan = 0;
            if (findItem != undefined && findItem != null) {
                if (findItem.hourspan == hour) {
                    hourspan = findItem.hourspan;
                    level = findItem.level;
                    color = t.levelColor[level];
                }
            }
            var geo = item.geometry;
            var dataType = geo.type;
            if (dataType === "REGION") {
                var style = {
                    fill: true,
                    fillColor: color,
                    fillOpacity: 0.8,
                    stroke: false
                };
                var pointArray = [];
                geo.points.forEach(itemP => {
                    var point = new WeatherMap.Geometry.Point(itemP.x, itemP.y);
                    pointArray.push(point);
                });
                var linearRings = new WeatherMap.Geometry.LinearRing(pointArray);
                var vector = new WeatherMap.Feature.Vector(linearRings, null, style);
                vector.level = level;
                vector.hourspan = hourspan;
                vector.geoID = geoID;
                vector.name = geoName;
                vectors.push(vector);
            }
            else if (dataType === "POINT") {
                var style = {
                    fill: true,
                    fillColor: color,
                    stroke: false,
                    strokeColor: color,
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    pointRadius: 3
                };
                var pt = geo.points[0];
                var geoPT = new WeatherMap.Geometry.Point(pt.x, pt.y);
                var vector = new WeatherMap.Feature.Vector(geoPT, null, style);
                vector.level = level;
                vector.hourspan = hourspan;
                vector.geoID = geoID;
                vector.name = geoName;
                vectors.push(vector);
            }
        });
        alertLayer.addFeatures(vectors);
        alertLayer.redraw();
    }
    /**
     * @author:wangkun
     * @date:2017-10-27
     * @param:
     * @return:
     * @description:根据字段名获取值
     */
    this.getValueFromFiled = function (fieldNames, fieldValues, targetFiled) {
        var size = fieldNames.length;
        var result = "";
        for (var i = 0; i < size; i++) {
            var thisName = fieldNames[i];
            if (thisName === targetFiled) {
                result = fieldValues[i];
                break;
            }
        }
        return result;
    }
    /**
     * @author:wangkun
     * @date:2017-10-28
     * @param:
     * @return:
     * @description:出图
     */
    this.outputImg = function (dic,fileName) {
        var dateTime = t.myDateSelecter.getCurrentTimeReal();
        var strDateTime = dateTime.format("yyyy年MM月dd日hh时");
        //获取时效
        var strHS = $("#forecastHourspan option:selected").text();
        var title = $("#alarmType option:selected").text();
        var type = $("#alarmType option:selected").attr("flag");
        var lmu = new LayerManagerUtil();
        var alertLayer = lmu.getLayer(type + "Alert");
        if (alertLayer == null) {
            return;
        }
        var features = [];
        var allFeature = alertLayer.features;
        allFeature.forEach(item => {
            if (item.level < 1) {
                return;
            }
            features.push({
                id: item.geoID,
                level: item.level,
                type: type
            });
        });
        var param = {
            title: title,
            type: type,
            maketime: strDateTime,
            hourspan: strHS,
            dic:dic,
            fileName:fileName,
            lsDataParam: features
        };
        param = JSON.stringify(param);
        var url = flashFloodServiceUrl + "ProductService/shOutputImg";
        var pro = new Promise(function (resolve, reject) {
            AJAX(url, param, function (data) {
                resolve("err");
            }, function (data) {
                resolve(data);
            });
        });
        return pro;
    }
    /**
     * @author:wangkun
     * @date:2017-10-29
     * @param:
     * @return:
     * @description:获取实况场数据
     */
    this.getLiveDG = async function (hs) {
        var dgs = [];
        var dateTime = new Date();
        dateTime.addHours(-2);
        $("#div_progress").css("display", "block");
        $("#div_progress_title").html("正在下载网格数据，请稍等...");
        for (var i = hs; i < 0; i++) {
            //var dateTime = t.myBarDateSelecter.getCurrentTimeReal();
            dateTime.addHours(-1);
            var strDateTime = dateTime.format("yyyyMMddhh0000");
            var data = await t.getLiveData(strDateTime);
            if (data==undefined||data === "err") {
                continue;
            }
            var dg = convertDataGridToDatasetGrid(data, false);
            dgs.push(dg);
        }
        $("#div_progress_title").html("正在合并，请稍等...");
        //合并
        var size = dgs.length;
        var result = dgs[0];
        var noVal = result.noDataValue;
        for (var i = 1; i < size; i++) {
            var grid = dgs[i].grid;
            var count = grid.length;
            for (var c = 0; c < count; c++) {
                var oldVal = result.grid[c];
                var newVal = grid[c];
                if (newVal == noVal) {
                    continue;
                }
                if (oldVal === noVal) {
                    result.grid[c] = newVal;
                }
                else {//都不是无效值
                    var sum = oldVal + newVal;
                    if (sum){
                        sum = sum.toFixed(1);
                        sum = parseInt(sum);
                        result.grid[c] = sum;
                    } 
                }
            }
        }
        $("#div_progress").css("display", "none");
        if (GDYB.GridProductClass.layerFillRangeColor == null) {
            GDYB.GridProductClass.layerFillRangeColor = new WeatherMap.Layer.FillRangeColorLayer("heatMap", { "radius": 40, "featureWeight": "value", "featureRadius": "geoRadius" });
            GDYB.Page.curPage.map.addLayers([GDYB.GridProductClass.layerFillRangeColor]);
            GDYB.GridProductClass.layerFillRangeColor.isAlwaySmooth = false;
            GDYB.GridProductClass.layerFillRangeColor.isSmooth = true;
            GDYB.GridProductClass.layerFillRangeColor.items = GDYB.GridProductClass.getFillColorItems("r3");
        }
        GDYB.GridProductClass.layerFillRangeColor.setDatasetGrid(result);
        GDYB.GridProductClass.layerFillRangeColor.refresh();
    }
    /**
     * @author:dinlerkey
     * @date:2017-10-25
     * @param:
     * @return:
     * @description:产品查询页面更新
     */
    this.getProductList = async function (callback) {
        var url = flashFloodServiceUrl + "ProductService/getAlarmProductFilesList";
        $("#product_list_sh,#product_list_dz,#product_list_hl").html(`
                <div>文件列表载入中…</div>
            `);
        var commonPath = productDic;
        //山洪灾害气象风险预警产品
        var param1 = {
            path: commonPath + "山洪灾害气象风险预警产品"
        };
        param1 = JSON.stringify(param1);
        AJAX(url, param1, function () {
            $("#product_list_sh").html(`
                    <div>文件列表载入出错</div>
                `);
        }, function (data) {
            if (data.length == 0) {
                $("#product_list_sh").html(`
                        <div>空</div>
                    `);
            }
            else {
                var strHtml = "<ul>";
                for (var i in data) {
                    strHtml += "<li><span class='fileNameSpan' title='" + data[i].l_filename + "'>" + data[i].l_filename + "</span><span class='fileLeadTimeSpan' style='position: absolute;right: 20px;'>" + data[i].l_leadTime.split(" ")[0] + "</span></li>"
                }
                strHtml += "</ul>";
                $("#product_list_sh").html(strHtml);
                callback && callback("sh");
                $("#product_list_sh li").click(function () {
                    var productFile = $(this).find(".fileNameSpan").html();
                    var productName = $("#product_list_sh").parent().find(".productTitle").html();
                    var path = commonPath + productName + "/" + productFile;
                    $("#queryAlarmShowDiv").css("display", "block");
                    t.showAlarmProductIndiv(path, productName, productFile);
                });
                $("#queryAlarmShowDiv").click(function () {
                    $(this).css("display", "none");
                });
            }
        });

        //地质灾害气象风险预警产品
        var param2 = {
            path: commonPath + "地质灾害气象风险预警产品"
        };
        param2 = JSON.stringify(param2);
        AJAX(url, param2, function () {
            $("#product_list_dz").html(`
                    <div>文件列表载入出错</div>
                `);
        }, function (data) {
            if (data.length == 0) {
                $("#product_list_dz").html(`
                        <div>空</div>
                    `);
            }
            else {
                var strHtml = "<ul>";
                for (var i in data) {
                    strHtml += "<li><span class='fileNameSpan' title='" + data[i].l_filename + "'>" + data[i].l_filename + "</span><span class='fileLeadTimeSpan' style='position: absolute;right: 20px;'>" + data[i].l_leadTime.split(" ")[0] + "</span></li>"
                }
                strHtml += "</ul>";
                $("#product_list_dz").html(strHtml);
                callback && callback("dz");
                $("#product_list_dz li").click(function () {
                    var productFile = $(this).find(".fileNameSpan").html();
                    var productName = $("#product_list_dz").parent().find(".productTitle").html();
                    var path = commonPath + productName + "/" + productFile;
                    $("#queryAlarmShowDiv").css("display", "block");
                    t.showAlarmProductIndiv(path, productName, productFile);
                });
                $("#queryAlarmShowDiv").click(function () {
                    $(this).css("display", "none");
                });
            }
        });

        //中小河流灾害气象风险预警产品
        var param3 = {
            path: commonPath + "中小河流灾害气象风险预警产品"
        };
        param3 = JSON.stringify(param3);
        AJAX(url, param3, function () {
            $("#product_list_hl").html(`
                    <div>文件列表载入出错</div>
                `);
        }, function (data) {
            if (data.length == 0) {
                $("#product_list_hl").html(`
                        <div>空</div>
                    `);
            }
            else {
                var strHtml = "<ul>";
                for (var i in data) {
                    strHtml += "<li><span class='fileNameSpan' title='" + data[i].l_filename + "'>" + data[i].l_filename + "</span><span class='fileLeadTimeSpan' style='position: absolute;right: 20px;'>" + data[i].l_leadTime.split(" ")[0] + "</span></li>"
                }
                strHtml += "</ul>";
                $("#product_list_hl").html(strHtml);
                callback && callback("hl");
                $("#product_list_hl li").click(function () {
                    var productFile = $(this).find(".fileNameSpan").html();
                    var productName = $("#product_list_hl").parent().find(".productTitle").html();
                    var path = commonPath + productName + "/" + productFile;
                    $("#queryAlarmShowDiv").css("display", "block");
                    t.showAlarmProductIndiv(path, productName, productFile);
                });
                $("#queryAlarmShowDiv").click(function () {
                    $(this).css("display", "none");
                });
            }
        });
    };
    /**
     * @author:dinlerkey
     * @date:2017-10-25
     * @description:添加产品查询翻页功能
     */
    this.addTurnPages = function (ele) {
        var show_per_page = 6;
        var number_of_items = $("#product_list_" + ele + " ul").children().size();
        var number_of_pages = Math.ceil(number_of_items / show_per_page);

        $("#current_page_" + ele).val(0);
        $("#show_per_page_" + ele).val(show_per_page);

        var navigation_html = `<a class="previous_link_` + ele + `" href="javascript:previousPage('` + ele + `');">上一页</a>`;
        var current_link = 0;
        while (number_of_pages > current_link) {
            navigation_html += `<a class="page_link_` + ele + `" href="javascript:go_to_page(` + current_link + `,'` + ele + `')" longdesc="` + current_link + `">` + (current_link + 1) + `</a>`;
            current_link++;
        }
        navigation_html += `<a class="next_link_` + ele + `" href="javascript:nextPage('` + ele + `');">下一页</a>`;
        $("#productTurnPage_" + ele).html(navigation_html);
        $("#productTurnPage_" + ele + " .page_link_" + ele + ":first").addClass("active_page");
        $("#product_list_" + ele + " ul").children().css("display", "none");
        $("#product_list_" + ele + " ul").children().slice(0, show_per_page).css("display", "block");
    };
    /**
     * @author:dinlerkey
     * @date:2017-10-26
     * @description:查询并展示气象风险预警产品
     */
    this.showAlarmProductIndiv = function (path, productName, productFile) {
        var url = flashFloodServiceUrl + "ProductService/getAlarmProductFilesList";
        var param = {
            path: path
        };
        param = JSON.stringify(param);
        AJAX(url, param, function () {

        }, function (data) {
            var pdfName = "";
            for (var i in data) {
                if (data[i].l_filename.endsWith(".pdf")) {
                    pdfName = data[i].l_filename;
                }
            }
            if (pdfName.length == 0) {
                $("#queryAlarm_product").html(`
                        <img style="width:20px;margin: 0 15px 0 15px;" src="imgs/icon_word.png"/><span style="font-family: 楷体;">`+ productFile + `.doc</span>
                        <div style="width: 75%;height: 90%;margin: 0px auto;display: block;">文件未找到</div>
                    `);
            }
            else {
                var showPath = productName + "/" + productFile + "/";
                var pdfPath = host+"/products/archive/" + showPath + pdfName;
                $("#queryAlarm_product").html(`
                        <img style="width:20px;margin: 0 15px 0 15px;" src="imgs/icon_word.png"/><span style="font-family: 楷体;">`+ productFile + `.doc</span>
                        <iframe style="width: 75%;height: 90%;margin: 0px auto;display: block;" src="`+ pdfPath + `"></iframe>
                    `);
            }
        });
    }
    /**
     * @author:wangkun
     * @date:2017-10-30
     * @modifyDate:2017-10-30
     * @return:
     * @description:获取实况
     */
    this.getLiveData = function (strDateTime) {
        var url = flashFloodServiceUrl + "ProductService/getLiveData";
        //strDateTime = "20171025090000";
        var param = {
            path: liveGridPath,
            dateTime: strDateTime
        };
        param = JSON.stringify(param);
        var pro = new Promise(function (resolve, reject) {
            AJAX(url, param, resolve, resolve);
        });
        return pro;
    }
    /**
     * @author:wangkun
     * @date:2017-10-30
     * @modifyDate:2017-10-30
     * @return:
     * @description:显示预警列表
     */
    this.showAlertList = function () {
        var alarmStrategy = $("#alarmStrategy button.active").text();
        var hsTxt = "";
        if (alarmStrategy == "实况") {
            hsTxt = "过去";
        }
        else if (alarmStrategy == "实况+预报") {
            hsTxt = "过去和未来";
        }
        else {
            hsTxt = "未来";
        }
        var types = [];
        $("#riskType button").each(function () {
            var thisType = $(this).attr("flag");
            if ($(this).hasClass("active")) {
                types.push(thisType);
            }
        });
        var lmu = new LayerManagerUtil();
        var count = 4;
        var list = [];
        types.forEach(item => {
            if (count < 1) {
                return;
            }
            var layer = lmu.addLayer(item + "Alert", "vector");
            var features = layer.features;
            //排序
            features.sort(compare('level'));//按等级排序
            features.forEach(itemC => {
                if (count < 1) {
                    return;
                }
                var level = itemC.level;
                var name = itemC.name;
                var hourspan = itemC.hourspan;
                var datetime = itemC.datetime;
                var rain = itemC.rain;
                var colorTxt = t.levelColorTxt[level];
                var title = name + item + colorTxt + "预警";
                var content = "";
                if (alarmStrategy == "实况") {
                    content = t.liveTemplate;

                }
                else if (alarmStrategy == "实况+预报") {
                    content = t.liveForecastTemplate;
                }
                else {
                    content = t.forecastTemplate;
                }
                content = content.replace("name", name);
                content = content.replace("hourspan", hourspan);
                content = content.replace("xx", rain);

                list.push({
                    level: level,
                    title: title,
                    datetime:datetime,
                    content: content
                });
                count--;
            });
        });
        $("#alarmMessageTable ul").html();
        //重新出新列表
        var html = "";
        list.forEach(item => {
            var level = item.level;
            var title = item.title;
            var content = item.content;
            var datetime = item.datetime;
            html += "<li>";
            html += '<div class="status ' + t.levelColor[level] + '">';
            html += "</div>";
            html += '<div class="alertcontent"s>';
            html += '<p>';
            html += title;
            html += '</p>';
            html += '<p>';
            html += content;
            html += '</p>';
            html += '<p>';
            html += datetime;
            html += '</p>';
            html += "</div>";
            html += "</li>";
        });
        $("#alarmMessageTable ul").html(html);
    }
    /**
     * @author:wangkun
     * @date:2017-10-31
     * @modifyDate:2017-10-31
     * @return:
     * @description:设置预警数据
     */
    this.setAlertData = function (name, data) {
        if (name === "中小河流") {
            t.riverAlertData = data;
        }
        else if (name === "山洪沟") {
            t.shgAlertData = data;
        }
        else if (name === "地质灾害隐患点") {
            t.disasterPTAlertData = data;
        }
    }
    /**
     * @author:wangkun
     * @date:2017-10-31
     * @modifyDate:2017-10-31
     * @return:
     * @description:获取预警数据
     */
    this.getAlertData = function (name) {
        var result = null;
        if (name === "中小河流") {
            result = t.riverAlertData;
        }
        else if (name === "山洪沟") {
            result = t.shgAlertData;
        }
        else if (name === "地质灾害隐患点") {
            result = t.disasterPTAlertData;
        }
        return result;
    }
    this.mouseUp = function (event) {
        var ptMouseUp = event.xy;
        var lonlatMouseUp = GDYB.Page.curPage.map.getLonLatFromPixel(ptMouseUp);
        if ($("#pointCorrection").hasClass("active")) {
            t.pointCorrection(lonlatMouseUp);
        }
        if ($("#dmapTools .qxfxTools").hasClass("active")) {
            t.pointSelect(lonlatMouseUp);
        }
    }
    /**
     * @author:wangkun
     * @date:2017-10-31
     * @modifyDate:2017-10-31
     * @return:
     * @description:单点订正
     */
    this.pointCorrection = function (lonlatMouseUp) {
        var type = $("#alarmType option:selected").attr("flag");
        var lmu = new LayerManagerUtil();
        var alertLayer = lmu.getLayer(type + "Alert");
        if (alertLayer == null) {
            console.log("预警图层为空!");
            return;
        }
        var allFeature = alertLayer.features;
        allFeature.forEach(item => {
            item.style.stroke = false;
            item.selected = false;
        });
        if (type === "地质灾害隐患点") {
            allFeature.forEach(item => {
                var tempLon = item.geometry.x;
                var tempLat = item.geometry.y;
                var disLon = Math.abs(tempLon - lonlatMouseUp.lon);
                var disLat = Math.abs(tempLat - lonlatMouseUp.lat);

                if (disLon < 0.02 && disLat < 0.02) {
                    item.style.stroke = true;
                    item.style.strokeColor = "green";
                    item.style.strokeWidth = 4;
                    item.selected = true;
                    return;
                }
            });
        }
        else {
            var pt = new WeatherMap.Geometry.Point(lonlatMouseUp.lon, lonlatMouseUp.lat);
            allFeature.forEach(item => {
                var geo = item.geometry;
                var isContain = geo.containsPoint(pt);
                if (isContain) {
                    item.style.stroke = true;
                    item.style.strokeColor = "green";
                    item.style.strokeWidth = 4;
                    item.selected = true;
                    return;
                }
            });
        }
        alertLayer.redraw();
    }
    /**
     * @author:wangkun
     * @date:2017-10-31
     * @modifyDate:2017-10-31
     * @return:
     * @description:单点选择
     */
    this.pointSelect = function (lonlatMouseUp) {
        var lmu = new LayerManagerUtil();
        var pt = new WeatherMap.Geometry.Point(lonlatMouseUp.lon, lonlatMouseUp.lat);
        var isFind = false;
        var allShowData = [];
        //获取模块
        var moduleName = $("#menu_changeDiv div.active").attr("name");
        if(moduleName === "fzxg"){
            var type = $(".selector").find("option:selected").text();
            var shpLayer = lmu.getLayer(type);
            if (shpLayer == null) {
                console.log("图层为空!");
                return;
            }
            var allFeature = shpLayer.features;
            var ids = [];
            allFeature.forEach(item => {
                var thisGeo = item.geometry;
                var geoID = item.id;
                if (thisGeo.components == undefined) {//点对象
                    var thisLon = thisGeo.x;
                    var thisLat = thisGeo.y;
                    var disLon = Math.abs(thisLon - lonlatMouseUp.lon);
                    var disLat = Math.abs(thisLat - lonlatMouseUp.lat);
                    if (disLon < 0.01 && disLat < 0.01) {
                        allShowData.push({
                            name: type,
                            data: item
                        });
                        isFind = true;
                        ids.push(geoID);
                        return;
                    }
                }
                else {//面对象
                    var isContain = thisGeo.containsPoint(pt);
                    if (isContain) {
                        allShowData.push({
                            name: type,
                            data: item
                        });
                        isFind = true;
                        ids.push(geoID);
                        return;
                    }
                }
            });
            t.getDetailByIdsAndType(ids,type);
        }
        else{
            $("#bottomMenu input").each(function(){
                if(!$(this).is(':checked')){
                    return;
                }
                if (isFind) {
                    return;
                }
                var thisType = $(this).attr("flag");
                var alertLayer = lmu.getLayer(thisType);
                if (alertLayer == null) {
                    console.log("图层为空!");
                    return;
                }
                var allFeature = alertLayer.features;
                allFeature.forEach(item => {
                    var thisGeo = item.geometry;
                    if (thisGeo.components == undefined) {//点对象
                        var thisLon = thisGeo.x;
                        var thisLat = thisGeo.y;
                        var disLon = Math.abs(thisLon - lonlatMouseUp.lon);
                        var disLat = Math.abs(thisLat - lonlatMouseUp.lat);
                        if (disLon < 0.01 && disLat < 0.01) {
                            allShowData.push({
                                name: thisType,
                                data: item
                            });
                            isFind = true;
                            return;
                        }
                    }
                    else {//面对象
                        var isContain = thisGeo.containsPoint(pt);
                        if (isContain) {
                            allShowData.push({
                                name: thisType,
                                data: item
                            });
                            isFind = true;
                            return;
                        }
                    }
                });
            });
            if (allShowData.length > 0) {
                t.updateTable(allShowData);
                t.showRiskInfo(allShowData[0]);
            }
        }
    }
    /**
     * @author:wangkun
     * @date:2017-10-31
     * @modifyDate:2017-10-31
     * @return:
     * @description:单点选择
     */
    this.showRiskInfo = function (riskInfo) {
        $("#riskInfo").css("display", "flex");
        //初始
        if(t.myChart==null){
            t.myChart = echarts.init(document.getElementById('riskInfo_data'));
            t.myChart.setOption({
                title: {
                    text: ''
                },
                grid:{
                    left:'5%',
                    right:'5%'
                },
                tooltip: {},
                legend: {
                    data: ['1级预警','2级预警','3级预警','4级预警','雨量']
                },
                xAxis: {
                    data: []
                },
                yAxis: {
                    name:"雨量(mm)"
                },
                series: []
            });
        }
        t.myChart.showLoading();
        var xAxis = ["3小时", "6小时", "24小时"];
        var name = riskInfo.name;
        var riskData = riskInfo.data;
        var allFeatureData = t.getShpDataByName(name);
        var geoID = riskData.id;
        var findFeature = allFeatureData.features.find(itemC => {
            var tempID = t.getValueFromFiled(itemC.fieldNames, itemC.fieldValues, "ID");
            return tempID == geoID;
        });
        if(findFeature==undefined){//正常情况不会找不到
            return;
        }
        var hours = [3, 6, 24];
        var series = [];
        for (var l = 1; l <= 4; l++) {
            var temData = [];
            for (var h = 0; h < 4; h++) {
                var txtF = "L" + l + "_H" + hours[h];
                var val = t.getValueFromFiled(findFeature.fieldNames, findFeature.fieldValues, txtF);
                temData.push(val);
            }
            series.push({
                name:l+"级预警",
                type: 'bar',
                data:temData
            });
        }
        t.myChart.hideLoading();
        var option = t.myChart.getOption();
        option.xAxis[0].data = xAxis;
        option.series = series;
        t.myChart.setOption(option,true);
        //显示雨量
        var productID = riskData.productid;
        t.getRainInfo(geoID,productID);
    }
    this.getRainInfo = function(geoID,productID){
        var strategy = $("#alarmStrategy button.active").attr("flag");
        strategy = parseInt(strategy);
        var param = {
            geoID:geoID,
            productID:productID,
            strategy:strategy
        };
        param = JSON.stringify(param);
        var url = flashFloodServiceUrl + "FlashFloodService/getRainInfo";
        AJAX(url, param, function (errdata) {
            console.log(errdata);
        }, function (data) {
            if(data.suc!=null){
                var series = t.myChart.getOption().series;
                series.push({
                    name:"雨量",
                    type: 'line',
                    data:data.suc
                });
                t.myChart.setOption({
                    series:series
                });
            }
        });
    }
    this.makeProductFileName = function(){
        var fileFormat = "MSP3_GS-MO_MDRWTFLD_FLAFLOOD_L88_GS_date_00000-hs00";
        var dateTime = t.myDateSelecter.getCurrentTimeReal();
        var strDateTime = dateTime.format("yyyyMMddhh00");
        fileFormat = fileFormat.replace("date",strDateTime);
        var strHS = $("#forecastHourspan option:selected").text();
        strHS = strHS.replace("小时","");
        if(strHS.length==1){
            strHS = "00"+strHS;
        }
        else{
            strHS = "0"+strHS;
        }
        fileFormat = fileFormat.replace("hs",strHS);
        return fileFormat;
    }
    /**
     * @author:wangkun
     * @date:2017-11-1
     * @modifyDate:2017-11-1
     * @return:
     * @description:上传产品
     */
    this.uploadProduct = async function(){
        var title = $("#alarmType").val();
        var issue = $("#alarmIssue").val();
        //获取图片
        var dic = productDic;
        var childDic = title + "产品/" + title + "-第" + issue + "期/";
        dic = dic+childDic;
        var param = {
            url:flashFloodFtp.url,
            port:flashFloodFtp.port,
            userName:flashFloodFtp.userName,
            password:flashFloodFtp.password,
            dic:childDic,
            fileName:"",
            strFile:""
        };
        var lsProductName = new MyArray();
        $(".productList span").each(function(){
            var fileName = $(this).text();
            if(!lsProductName.contain(fileName)){
                lsProductName.push(fileName);
                if(fileName.endsWith(".pdf")){//增加word
                    fileName = fileName.replace(".pdf",".doc");
                    lsProductName.push(fileName);
                }
            }
        });
        for(var i=0,size=lsProductName.length;i<size;i++){
            var name = lsProductName[i];
            param.fileName = name;
            var strFile = dic+name;
            param.strFile = strFile;
            var strParam = JSON.stringify(param);
            var status = await t.uploadSigleFile(strParam);
            console.log(status);
        }
        t.updateIssue();
        alertModal("上传完成");
    }
    /**
     * @author:wangkun
     * @date:2017-11-2
     * @modifyDate:2017-11-2
     * @return:
     * @description:单个文件上传
     */
    this.uploadSigleFile = function(param){
        var url = flashFloodServiceUrl + "FTPToolService/uploadFile";
        var pro = new Promise(function(resolve,reject){
            AJAX(url, param, function(){
                resolve("err");
            }, function(data){
                resolve(data);
            });
        });
        return pro;
    }
    /**
     * @author:wangkun
     * @date:2017-11-2
     * @modifyDate:2017-11-2
     * @return:
     * @description:获取期号
     */
    this.getIssue = function(){
        var url = flashFloodServiceUrl + "FlashFloodService/getIssue";
        var param = "";
        AJAX(url, param, function(){
            console.log("err");
        }, function(data){
            if(data.suc!=null){
                $("#alarmIssue").val(data.suc);
            }
        });
    }
    /**
     * @author:wangkun
     * @date:2017-11-2
     * @modifyDate:2017-11-2
     * @return:
     * @description:更新期号
     */
    this.updateIssue = function(){
        var issue = $("#alarmIssue").val();
        issue = parseInt(issue);
        var param = {
            issue:issue
        };
        var url = flashFloodServiceUrl + "FlashFloodService/updateIssue";
        var param = JSON.stringify(param);
        AJAX(url, param, function(){
            console.log("err");
        }, function(data){
            if(data.suc!=null){
                console.log("更新期号成功!");
            }
        });
    }
    this.getCountyRain = function(){
        var strategy = $("#alarmStrategy button.active").attr("flag");
        strategy = parseInt(strategy);
        var strHour = $("#forecastHourspan option:selected").text();
        strHour = strHour.replace("小时");
        var hour = parseInt(strHour);
        var strDateTime = $("#dateSelect input").val();

        var param = {
            strategy:strategy,
            hourSpan:hour,
            datetime:strDateTime
        };
        param = JSON.stringify(param);
        var url = flashFloodServiceUrl + "FlashFloodService/getCountyRain";
        var pro = new Promise(function(resolve,reject){
            AJAX(url, param, resolve, resolve);
        });
        return pro;
    }
    /**
     * @author:wangkun
     * @date:2017-11-3
     * @modifyDate:2017-11-3
     * @return:
     * @description:获取产品时间
     */
    this.getProductTime = function(){
        var strategy = $("#alarmStrategy button.active").attr("flag");
        var date = new Date();
        var strDateTime = date.format("yyyy-MM-dd hh:mm:00");
        var param = {
            strategy:strategy,
            datetime:strDateTime
        };
        param = JSON.stringify(param);
        var url = flashFloodServiceUrl + "FlashFloodService/getProductTime";
        AJAX(url, param, function(){
            console.log("err");
        }, function(data){
            if(data.suc!=null){
                var strNewTime = data.suc.substring(0,data.suc.length-2);
                $("#dateSelect input").val(strNewTime);
            }
        });
    }
    /**
     * @author:wangkun
     * @date:2017-11-3
     * @modifyDate:2017-11-3
     * @return:
     * @description:生成报文
     */
    this.makeDatagram = function(){
        var strDateTime = $("#dateSelect input").val();
        var type = $("#alarmType option:selected").attr("flag");
        var strHour = $("#forecastHourspan option:selected").text();
        strHour = strHour.replace("小时");
        var hour = parseInt(strHour);
        var strategy = $("#alarmStrategy button.active").attr("flag");
        var fileName = t.makeProductFileName();
        fileName+=".txt";
        var lmu = new LayerManagerUtil();
        var alertLayer = lmu.getLayer(type + "Alert");
        if (alertLayer == null) {
            return;
        }
        var features = [];
        var allFeature = alertLayer.features;
        allFeature.forEach(item => {
            if (item.level < 1) {
                return;
            }
            features.push({
                geoID: item.geoID,
                level: item.level
            });
        });
        var title = $("#alarmType").val();
        var issue = $("#alarmIssue").val();
        var dic = productDic;
        var childDic = title + "产品/" + title + "-第" + issue + "期/";
        dic += childDic;
        var param = {
            datetime: strDateTime,
            type: type,
            maketime: strDateTime,
            hourspan: hour,
            strategy:strategy,
            dic:dic,
            fileName:fileName,
            lsDatagramData: features
        };
        param = JSON.stringify(param);
        var url = flashFloodServiceUrl + "FlashFloodService/makeDatagram";
        AJAX(url, param, function(){
            console.log("err");
        }, function(data){
            if(data.suc!=null){
                console.log(data.suc);
            }
        });
    },
    /**
     * @author:wangkun
     * @date:2017-11-15
     * @modifyDate:2017-11-15
     * @return:
     * @description:生成报文
     */
    this.initiModifyFun = function(){
        if(!t.modifyIsLoad){
            t.vueModify = new Vue({
                el:"#modify_app",
                template:'<div id="modify_div" class="modify_div" :style="{display:visiable}">'+
                        '<div class="modifyVal" style="display:none;"><input type="text" v-model="modifyVal"/></div>'+
                        '<div class="myrow"><span>数据源:</span><select class="selector" @change="selectChange"><option>中小河流</option><option>山洪沟</option><option>地质灾害隐患点</option></select><button class="close" @click="close">&times;</button></div>'+
                        '<div class="table_div">'+
                            '<table class="table table-bordered">'+
                                '<thead>'+
                                    '<tr class="headTr">'+
                                        '<th rowspan="2">ID</th><th rowspan="2">名称</th><th rowspan="2">类型</th><th rowspan="2">更新时间</th><th colspan="6">1级临界阀值</th><th colspan="6">2级临界阀值</th><th colspan="6">3级临界阀值</th><th colspan="6">4级临界阀值</th>'+
                                    '</tr>'+
                                    '<tr>'+
                                        '<th>1H</th><th>3H</th><th>6H</th><th>24H</th><th>48H</th><th>72H</th><th>1H</th><th>3H</th><th>6H</th><th>24H</th><th>48H</th><th>72H</th><th>1H</th><th>3H</th><th>6H</th><th>24H</th><th>48H</th><th>72H</th><th>1H</th><th>3H</th><th>6H</th><th>24H</th><th>48H</th><th>72H</th>'+
                                    '</tr>'+
                                '</thead>'+
                                '<tbody>'+
                                    '<tr v-for="item in items">'+
                                        "<td>{{ item.geoID }}</td><td>{{ item.name }}</td><td>{{ item.type }}</td><td>{{ item.updatetime }}</td>"+
                                        "<td @click='edit'>{{ item.l1_H1 }}</td><td @click='edit'>{{ item.l1_H3 }}</td><td @click='edit'>{{ item.l1_H6 }}</td><td @click='edit'>{{ item.l1_H24 }}</td><td @click='edit'>{{ item.l1_H48 }}</td><td @click='edit'>{{ item.l1_H72 }}</td>"+
                                        "<td @click='edit'>{{ item.l2_H1 }}</td><td @click='edit'>{{ item.l2_H3 }}</td><td @click='edit'>{{ item.l2_H6 }}</td><td @click='edit'>{{ item.l2_H24 }}</td><td @click='edit'>{{ item.l2_H48 }}</td><td @click='edit'>{{ item.l2_H72 }}</td>"+
                                        "<td @click='edit'>{{ item.l3_H1 }}</td><td @click='edit'>{{ item.l3_H3 }}</td><td @click='edit'>{{ item.l3_H6 }}</td><td @click='edit'>{{ item.l3_H24 }}</td><td @click='edit'>{{ item.l3_H48 }}</td><td @click='edit'>{{ item.l3_H72 }}</td>"+
                                        "<td @click='edit'>{{ item.l4_H1 }}</td><td @click='edit'>{{ item.l4_H3 }}</td><td @click='edit'>{{ item.l4_H6 }}</td><td @click='edit'>{{ item.l4_H24 }}</td><td @click='edit'>{{ item.l4_H48 }}</td><td @click='edit'>{{ item.l4_H72 }}</td>"+
                                    '</tr>'+
                                '</tbody>'+
                            '</table>'+
                        '</div>'+
                    '</div>',
                data:{
                    visiable:"block",
                    modifyVal:0,
                    hourspans:[1,3,6,24,48,72],
                    items:[]
                },
                watch:{
                    visiable:function(val){
                        if(val === "none"){
                            t.removeAllShpInfo();
                        }
                    }
                },
                methods:{
                    selectChange:function(e){
                        var type = e.target.value;
                        t.vueModify.items = [];
                        t.removeAllShpInfo();
                        t.removeAllAlertInfo();
                        t.displayShp(type);
                    },
                    close:function(){
                        this.visiable = "none";
                    },
                    edit:function(e){
                        $(".modifyVal").css("display","block");
                        var cell = $(e.toElement);
                        var ps = cell.position();
                        var cellindex = cell.parent().find("td").index(cell); //列号
                        var hsSize = this.hourspans.length;
                        var level = parseInt((cellindex-4)/hsSize)+1;
                        var hsIndex = (cellindex-4)%hsSize;
                        var cellName = "l"+level+"_H"+this.hourspans[hsIndex];
                        //var cellName = cell.parent().parent().parent().find("th:eq("+cellindex+")")[0].innerHTML;
                        console.log(cellName);
                        var originalValue = cell.html();
                        this.modifyVal = originalValue;
                        $(".modifyVal").css("left",ps.left);
                        $(".modifyVal").css("top",ps.top);
                        $(".modifyVal").css("width",cell.outerHeight());
                        $(".modifyVal").css("height",cell.outerHeight());
                        var input = $(".modifyVal input");
                        input.val(originalValue);
                        input.css({"color":"blue"});
                        input.unbind();
                        input.trigger("focus").trigger("select");
                        input.click(function(){
                            return false;
                        });
                        input.keyup(function(event){
                            var keycode = event.which;
                            if (13 == keycode) {
                                //var strVal = $(this).val();
                                //var newVal = parseFloat(strVal);
                                var newVal = t.vueModify.modifyVal;
                                t.vueModify.items.forEach(item=>{
                                    item[cellName]  = newVal;
                                });
                                t.updateThreshold(cellName,newVal);
                                $(".modifyVal").css("display","none");
                            }
                            if (27 == keycode) {
                                //cell.html(originalValue);
                            }
                            
                        });
                        input.blur(function(){
                            var newVal=input.val();
                            if(newVal==""){//如果是无效值就变成原来的值
                                //cell.html(originalValue);
                            }
                            else{
                                var newVal = t.vueModify.modifyVal;
                                t.vueModify.items.forEach(item=>{
                                    item[cellName]  = newVal;
                                });
                                t.updateThreshold(cellName,newVal);
                            }
                            $(".modifyVal").css("display","none");
                        });
                    }
                },
                beforeCreate:function(){
                    $("#modify_div").remove();
                },
                mounted:function(){
                    //displayShp
                    var type = $(".selector").find("option:selected").text();
                    t.removeAllShpInfo();
                    t.removeAllAlertInfo();
                    t.displayShp(type);
                }
            });
            t.modifyIsLoad = true;
        }
        else{
            t.vueModify.visiable = "block";
        }
    }
    this.removeAllShpInfo = function(){
        var types = ["中小河流","山洪沟","地质灾害隐患点"];
        var lmu = new LayerManagerUtil();
        types.forEach(item=>{
            var layer = lmu.getLayer(item);
            layer.removeAllFeatures();
            layer.redraw();
        });
    }
    this.removeAllAlertInfo = function(){
        var types = ["中小河流","山洪沟","地质灾害隐患点"];
        var lmu = new LayerManagerUtil();
        types.forEach(item=>{
            var layer = lmu.getLayer(item+ "Alert");
            if(layer==null){
                return;
            }
            layer.removeAllFeatures();
            layer.redraw();
        });
    }
    this.getDetailByIdsAndType = function(ids,type){
        if(ids.length<1){
            return;
        }
        var param = {
            ids:ids,
            type:type
        };
        param = JSON.stringify(param);
        var url = flashFloodServiceUrl + "FlashFloodService/getThresholdByIdsAndType";
        AJAX(url, param, function () {

        }, function (data) {
            if(data.suc==null){
                console.log(data.err);
            }
            else{
                t.vueModify.visiable = "block";
                t.vueModify.items = [];
                t.vueModify.items = data.suc;
            }
        });
    }
    /**
     * @author:wangkun
     * @date:2017-11-16
     * @modifyDate:2017-11-16
     * @return:
     * @description:更新阀值
     */
    this.updateThreshold = function(colName,val){
        var ids = [];
        t.vueModify.items.forEach(item=>{
            var geoID = item.geoID;
            ids.push(geoID);
        });
        var type = $(".selector").find("option:selected").text();
        var param = {
            type:type,
            colName:colName,
            value:val,
            ids:ids
        };
        param = JSON.stringify(param);
        var url = flashFloodServiceUrl + "FlashFloodService/updateThresholdByIdsAndCol";
        AJAX(url, param, function () {

        }, function (data) {
            t.getDetailByIdsAndType(ids,type);
        });
    }
    /**
     * @author:wangkun
     * @date:2017-11-17
     * @modifyDate:2017-11-17
     * @return:
     * @description:下载文件
     */
    this.downloadFile = function(){
        var src = "";
        var fileName = "";
        var docDis = $("#productShowWord").css("display");
        if(docDis==undefined||docDis==="block"){
            var pdfSrc = $("#productShowWord iframe").attr("src");
            var lastIndex = pdfSrc.lastIndexOf(".");
            var pre = pdfSrc.substring(0,lastIndex);
            src = pre+".doc";
            lastIndex = src.lastIndexOf("/");
            fileName = src.substring(lastIndex+1,src.length);
        }
        downloadFile(fileName,src);
    }
    /**
     * @author:wangkun
     * @date:2017-11-17
     * @modifyDate:2017-11-17
     * @return:
     * @description:上传文件
     */
    this.uploadFile = function(){
        var src = $("#productShowWord iframe").attr("src");
        var index = src.indexOf("archive")+"archive".length+1;
        var fileName = src.substring(index,src.length);
        var pdfFile = productDic+fileName;
        fileName = fileName.replace(".pdf",".doc");
        var param = {
            dic:productDic,
            fileName:fileName
        };
        param = JSON.stringify(param);
        var fd = new FormData();
        fd.append("param", param);
        fd.append("file", document.getElementById('fileupload').files[0]);
        var url = flashFloodServiceUrl + "FileService/uploadFile";
        $.ajax({
            url: url,
            type: 'POST',  
            data: fd,  
            async: false,  
            cache: false,  
            contentType: false,  
            processData: false,  
            success: function (data) {  
                if(data.suc){
                    var docFile = productDic+fileName;
                    console.log(docFile);
                    t.docConvertToPdf(docFile);
                }
            },  
            error: function (returndata) {
                console.log(returndata);
            }
        });
    }
    /**
     * @author:wangkun
     * @date:2017-11-17
     * @modifyDate:2017-11-17
     * @return:
     * @description:doc转pdf服务
     */
    this.docConvertToPdf = function(docFile){
        var param = docFile;
        var url = archiveService + "services/ArchiveService/convertToPDF";
        AJAX(url, param, function () {
            alert("上传失败!");
        }, function (data) {
            alert("上传成功!");
        });
    }
}
QDLQXFXPageClass.prototype = new PageBase();