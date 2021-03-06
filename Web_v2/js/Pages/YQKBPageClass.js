function YQKBPageClass() {
    this.renderMenu = function () {
        // language=HTML
        let html = `
            <div class="yqkb">
                <div class="yqkb_option">
                    <p class="reminder">温馨提示：每次改变参数都需要点击出图按钮才能生效；图片右键可另存本机。目前不支持跨月查询</p>
                    <div class="time_option">
                        <div class="time_start">
                            <span>开始时间：</span>
                            <input type="datetime-local" id="dateStart" value="2017-06-10T23:00"/>
                        </div>
                        <div class="time_end">
                            <span>结束时间：</span>
                            <input type="datetime-local" id="dateEnd" value="2017-06-11T23:00"/>
                        </div>
                        <div class="station_option">
                            <input type="checkbox" checked id="station_1"/>
                            <label for="station_1">仅国家站</label>
                            <input type="checkbox" checked id="station_2"/>
                            <label for="station_2">填值显示</label>
                            <input type="checkbox" checked id="station_3"/>
                            <label for="station_3">去掉0值</label>
                        </div>
                    </div>

                    <div class="plot_range" id="thresholdDiv">
                        <span>出图填值范围:</span>

                        <input type="radio" name="plot_range" id="plot_rang_1"/><label for="plot_rang_1">>=<input
                        type="text"
                        placeholder="自定义"/></label>
                        <input type="radio" name="plot_range" id="plot_rang_2"/><label for="plot_rang_2">>=0.1</label>
                        <input type="radio" name="plot_range" id="plot_rang_3"/><label for="plot_rang_3">>=10</label>
                        <input type="radio" name="plot_range" id="plot_rang_4"/><label for="plot_rang_4">>=25</label>
                        <input type="radio" name="plot_range" id="plot_rang_5"/><label for="plot_rang_5">>=50</label>
                        <input type="radio" name="plot_range" id="plot_rang_6"/><label for="plot_rang_6">>=100</label>
                        <input type="radio" name="plot_range" id="plot_rang_7" checked/><label
                        for="plot_rang_7">>=250</label>
                    </div>
                    <div class="table_range" id="formThresholdDiv">
                        <span>表格显示范围:</span>

                        <input type="radio" name="table_rang" id="table_rang_1"/><label for="table_rang_1">默认</label>
                        <input type="radio" name="table_rang" id="table_rang_2"/><label for="table_rang_2">>=0</label>
                        <input type="radio" name="table_rang" id="table_rang_3"/><label for="table_rang_3">>=0.1</label>
                        <input type="radio" name="table_rang" id="table_rang_4"/><label for="table_rang_4">>=10</label>
                        <input type="radio" name="table_rang" id="table_rang_5"/><label for="table_rang_5">>=25</label>
                        <input type="radio" name="table_rang" id="table_rang_6"/><label for="table_rang_6">>=50</label>
                        <input type="radio" name="table_rang" id="table_rang_7"/><label for="table_rang_7">>=100</label>
                        <input type="radio" name="table_rang" id="table_rang_8" checked/><label
                        for="table_rang_8">>=250</label>
                    </div>
                    <div class="change_feature" id="element">
                        <button id="prec" class="active">雨量</button>
                        <button id="temp">气温</button>
                        <button id="humidity">相对湿度</button>
                        <button id="pre">气压</button>
                    </div>
                    <div class="get_result">
                        <button id="btn_run">出图</button>
                        <button id="btn_runFromTable">按表格出图</button>
                        <button>生成雨情快报</button>
                        <button id="btn_setLegend">设置图例</button>
                    </div>
                    <div id="setLegendDiv">
                        <div id="fenduan">
                            分段：
                            <select>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option selected>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </select>
                        </div>
                        <div id="colorsBar">

                        </div>
                    </div>
                </div>
                <div class="result_pic">
                    <img id="imgproduct" src="" alt=""/>
                </div>
                <div class="result_table">
                    <div class="table_header">
                        <span></span>
                        <span>区县</span>
                        <span>站点</span>
                        <span>站号</span>
                        <span>值</span>
                        <span>操作</span>
                    </div>
                    <ul class="table_con">
                        <li style="text-align: center;">数据加载中......</li>
                    </ul>
                </div>
            </div>`;
        $("#content").html(html);
        $("#imgproduct").attr("src",CTX + "imgs/output/62/output.png")
        //自定义多选框
        $("input[type=checkbox]").change(function () {
            let flag = $(this).prop("checked");
            if (flag)
                $(this).next().css("background-image", 'url(imgs/input/checkbox_1.jpg)');
            else
                $(this).next().css("background-image", 'url(imgs/input/checkbox_2.jpg)');
        })

        //切换出图的数据来源
        $("#element button").on("click", function () {
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
        });


        /**
         * @author:wangkun
         * @date:2017-11-28
         * @modifyDate:2017-11-28
         * @return:
         * @description:获取图例
         */
        function getLengend() {
            var obj = [];
            var id = $("#element button.active")[0].id;
            if (id === "prec") {
                obj.push({v: 0.1, r: 165, g: 243, b: 141});
                obj.push({v: 10.0, r: 61, g: 185, b: 63});
                obj.push({v: 25.0, r: 99, g: 184, b: 249});
                obj.push({v: 50.0, r: 0, g: 0, b: 254});
                obj.push({v: 100.0, r: 243, g: 5, b: 238});
                obj.push({v: 250.0, r: 129, g: 0, b: 64});
            }
            else if (id === "temp") {
                var index = 0;
                heatMap_TempStyles.forEach(item => {
                    index++;
                    if (index % 2 == 0) {
                        return;
                    }
                    var val = item.start;
                    if (val < -20) {
                        return;
                    }
                    if (val > 24) {
                        return;
                    }
                    var r = item.startColor.red;
                    var g = item.startColor.green;
                    var b = item.startColor.blue;
                    obj.push({v: val, r: r, g: g, b: b});
                });
            }
            else if (id === "humidity") {
                heatMap_RHStyles.forEach(item => {
                    var val = item.start;
                    var r = item.startColor.red;
                    var g = item.startColor.green;
                    var b = item.startColor.blue;
                    obj.push({v: val, r: r, g: g, b: b});
                });
            }
            else if (id === "pre") {
                heatMap_850hPaHightStyles.forEach(item => {
                    var val = item.start;
                    var r = item.startColor.red;
                    var g = item.startColor.green;
                    var b = item.startColor.blue;
                    obj.push({v: val, r: r, g: g, b: b});
                });
            }
            return obj;
        }


        /**
         * @author:wangkun
         * @date:2017-11-28
         * @modifyDate:
         * @return:
         * @description:获取表中字段名
         */
        function getTableField() {
            var id = $("#element button.active")[0].id;
            var tableField = "";
            if (id === "prec") {
                tableField = "Precipitation";
            }
            else if (id === "temp") {
                tableField = "DryBulTemp";
            }
            else if (id === "humidity") {
                tableField = "RelHumidity";
            }
            else if (id === "pre") {
                tableField = "StationPress";
            }
            return tableField;
        }


        /**
         * @author:wangkun
         * @date:2017-11-29
         * @modifyDate:
         * @return:
         * @description:获取单位
         */
        function getUnit() {
            var id = $("#element button.active")[0].id;
            var strUnit = "";
            if (id === "prec") {
                tableField = "mm";
            }
            else if (id === "temp") {
                tableField = "℃";
            }
            else if (id === "humidity") {
                tableField = "%";
            }
            else if (id === "pre") {
                tableField = "pa";
            }
            return tableField;
        }


        /*  function creatDatalistTable(data) {
              var area;
              var stationName;
              var stationNum;
              var stationData;
              var strHTML = '<div style="height: 30px;width: 98.5%">'
                  + '<table cellspacing="0" cellpadding="0">'
                  + '<thead><tr><th width="80px"></th><th width="185px">区县</th><th width="185px">站名</th><th width="185px">站号</th><th width="100px">值</th><th width="100px">操作</th></tr></thead>'
                  + '</table></div>'
                  + '<div style="overflow-y: auto;height: 770px"><table id="exeTable" cellspacing="0" cellpadding="0">'
                  + '<tbody>';
              var formThresholdNum = parseFloat($("#formThresholdDiv input:checked").val());
              var dataLength = data.length;
              if (formThresholdNum < 0) {
                  if (dataLength > 60) {
                      dataLength = 60;
                  }
                  formThresholdNum = 0;
              }
              for (var i = 0; i < dataLength; i++) {
                  area = data[i].area;
                  stationName = data[i].StationName;
                  stationNum = data[i].StationNum;
                  stationData = data[i].val;
                  if (stationData >= formThresholdNum) {
                      strHTML += '<tr>'
                          + '<td style="background-color: rgba(140,140,140,0.2);" width="80px">' + (parseInt(i) + 1).toString() + '</td>'
                          + '<td width="185px" class="stationDistrict">' + area + '</td>'
                          + '<td width="185px" class="stationName">' + stationName + '</td>'
                          + '<td width="185px" class="stationNum">' + stationNum + '</td>'
                          + '<td width="100px" class="tableData">' + stationData + '</td>'
                          + '<td width="100px" class="delStation">删除</td>'
                          + '</tr>';
                  }
              }
              strHTML += '</tbody></table></div>';
              $("#rightTable").html(strHTML).css("display", "block");

              //更改数据
              $(".rightTable table tr").find("td.tableData").click(function () {
                  var obj_text = $(this).find("input:text");
                  var stationNum = $(this).parent().find("td.stationNum").html();
                  if (!obj_text.length) {
                      elementSkip();
                      $(this).html("<input style='width: 100%;' type='text' value='" + $(this).text() + "' onblur='inputToHtml(this)'>");
                      $(this).find("input:text").select();
                  } else {
                      var v = obj_text.val();
                      $(this).html(v);
                      for (var i = 0; i < tableJsonData.length; i++) {
                          if (tableJsonData[i].StationNum == stationNum)
                              tableJsonData[i].val = v;
                      }
                      sortListByPrecipitation(tableJsonData);
                  }
              });

              function elementSkip() {
                  $(".rightTable table tr").siblings("td.tableData").each(function () {
                      var data_text = $(this).find("input:text");
                      var stationNum = $(this).parent().find("td.stationNum").html();
                      if (data_text.length) {
                          var v = data_text.val();
                          $(this).html(v);
                          for (var i = 0; i < tableJsonData.length; i++) {
                              if (tableJsonData[i].StationNum == stationNum)
                                  tableJsonData[i].val = v;
                          }
                      }
                  });
              }

              //确认删除模态窗
              $(".rightTable table tr").find("td.delStation").click(function () {
                  var stationNum = $(this).parent().find("td.stationNum").html();
                  var this_parent = $(this).parent();
                  $("#div_modal_confirm_content").html("确认删除站点【" + stationNum + "】");
                  $("#div_modal_confirm").modal();
                  $("#div_modal_confirm").find("a").unbind();
                  $("#div_modal_confirm").find("a").click(function () {
                      if (typeof(this.id) != "undefined") {
                          if (this.id == "btn_ok") {
                              this_parent.remove();//表格中移除
                              for (var i = 0; i < tableJsonData.length; i++) {
                                  if (tableJsonData[i].StationNum == stationNum)
                                      tableJsonData.splice(i, 1);//数组中移除
                              }
                          }
                      }
                  })
              });

              $(".delStation").hover(function () {
                  $(this).parent().css({"border-color": "2px solid red", "color": "red"});
              }, function () {
                  $(this).parent().css({"border-color": "1px solid #000", "color": "black"});
              });
          }*/

        //根据表格出图
        function runFromTable() {
            if (tableJsonData.length == 0) {
                alert("请先点击出图！");
                return;
            }
            var ObservTimesStart = $("#dateStart").val();
            ObservTimesStart = ObservTimesStart.replace(/-/g, "");
            ObservTimesStart = ObservTimesStart.replace(/T/g, "");
            ObservTimesStart = ObservTimesStart.substr(0, 10);
            var ObservTimesEnd = $("#dateEnd").val();
            ObservTimesEnd = ObservTimesEnd.replace(/-/g, "");
            ObservTimesEnd = ObservTimesEnd.replace(/T/g, "");
            ObservTimesEnd = ObservTimesEnd.substr(0, 10);
            if (ObservTimesStart.substr(0, 6) != ObservTimesEnd.substr(0, 6)) {
                alert("错误：起止时间不能跨月");
                return;
            }
            var stationType = $("#station_1").is(":checked") ? "5%" : "%";
            var bShowValue = $("#station_2").is(":checked");
            var bRemoveZero = $("#station_3").is(":checked");
            var threshold = $("#thresholdDiv input:checked+label").html().slice(5);//出图显示阈值
            var bVtBoundary = true;
            var bVtName = true;
            var legend = getLengend();
            var strLegend = JSON.stringify(legend);
            var strElement = $("#element button.active").html();
            var tableField = getTableField();
            var strUnit = getUnit();
            alert("正在表格数据出图，请稍后...");
            points = tableJsonData;
            var strPoints = JSON.stringify(points);
            var param = {
                ObservTimesStart: ObservTimesStart,
                ObservTimesEnd: ObservTimesEnd,
                type: stationType,
                bShowValue: bShowValue,
                bRemoveZero: bRemoveZero,
                threshold: threshold,
                legend: strLegend,
                areaCode: "62",
                bVtBoundary: bVtBoundary,
                bVtName: bVtName,
                element: strElement,
                tableField: tableField,
                unit: strUnit,
                points: points
            };
            console.log(param);
            param = JSON.stringify(param);
            $.ajax({
                type: 'post',
                url: gsGraphicService + "services/GraphicsService/outputImageByJson",
                //data: {"para": "{ObservTimesStart:'" + ObservTimesStart + "',ObservTimesEnd:'" + ObservTimesEnd + "',type:"+stationType+ ",bShowValue:"+ bShowValue + ",bRemoveZero:"+ bRemoveZero + ",threshold:"+ threshold +",points:"+ JSON.stringify(points) +",legent:"+ JSON.stringify(legent) +",areaCode:'"+ userDepartCode +"',bVtBoundary:"+ bVtBoundary +",bVtName:"+ bVtName +"}"},
                data: {"para": param},
                dataType: 'json',
                error: function (e) {
                    if (e.status == 0)
                        alert('错误：服务已关闭');
                    else
                        alert('错误：错误码为' + e.status);
                },
                success: function (b) {
                    if (!b) {
                        alert("根据表格出图失败");
                    } else {
                        var img = document.getElementById("imgproduct");
                        img.src = CTX + "imgs/output/62/output.png?rnd=" + Math.random();

                        $(".reminder").html("出图成功");

                        // alert("根据表格出图完成");
                        // creatDatalistTable(points);
                    }
                }
            });
        }


        var tableJsonData = [];
        $("#btn_run").click(function () {

            //显示表格数据
            $(".result_table").show();

            //提示信息
            $(".reminder").html("出图中,请稍后....");


            //需要传递的参数
            var ObservTimesStart = $("#dateStart").val();
            ObservTimesStart = ObservTimesStart.replace(/-/g, "");
            ObservTimesStart = ObservTimesStart.replace(/T/g, "");
            ObservTimesStart = ObservTimesStart.substr(0, 10);
            var ObservTimesEnd = $("#dateEnd").val();
            ObservTimesEnd = ObservTimesEnd.replace(/-/g, "");
            ObservTimesEnd = ObservTimesEnd.replace(/T/g, "");
            ObservTimesEnd = ObservTimesEnd.substr(0, 10);
            var tableName = "HIS_HOUR_" + ObservTimesStart.substr(0, 6);
            var stationType = $("#station_1").is(":checked") ? "5%" : "%";
            var bShowValue = $("#station_2").is(":checked");
            var bRemoveZero = $("#station_3").is(":checked");
            var threshold = $("#thresholdDiv input:checked+label").html().slice(5);//出图显示阈值
            var bVtBoundary = true;
            var bVtName = true;
            var legend = getLengend();
            var strLegend = JSON.stringify(legend);
            var strElement = $("#element button.active").html();
            var tableField = getTableField();
            var strUnit = getUnit();
            var param = {
                ObservTimesStart: ObservTimesStart,
                ObservTimesEnd: ObservTimesEnd,
                tableName: tableName,
                type: stationType,
                bShowValue: bShowValue,
                bRemoveZero: bRemoveZero,
                threshold: threshold,
                legend: strLegend,
                areaCode: "62",
                bVtBoundary: bVtBoundary,
                bVtName: bVtName,
                element: strElement,
                tableField: tableField,
                unit: strUnit
            };
            console.log(param);
            param = JSON.stringify(param);

            //发送请求
            $.ajax({
                type: 'post',
                url: gsGraphicService + "services/GraphicsService/getStationDetailByTimes",
                data: {"para": param},
                dataType: 'json',
                error: function (e) {
                    if (e.status == 0)
                        alert('错误：服务已关闭');
                    else
                        alert('错误：错误码为' + e.status);
                },
                success: function (data) {
                    console.log(data);
                    tableJsonData = data;
                    $(".reminder").html("出图成功!");

                    var img = document.getElementById("imgproduct");
                    img.src = CTX + "imgs/output/62/output.png?rnd=" + Math.random();
                    let li_html = ``;
                    $.each(data, function (index, item) {
                        li_html += `<li>
                            <span>${index}</span>
                            <span>${item.area}</span>
                            <span>${item.StationName}</span>
                            <span>${item.StationNum}</span>
                            <span>${item.val}</span>
                            <span class="remove_tData">删除</span>
                          </li>`
                    })
                    $(".table_con").html(li_html);
                    $(".remove_tData").click(function () {
                        $(this).parent().remove();
                        let idx = $(this).siblings().first().html();
                        tableJsonData.splice(idx, 1);
                    });
                }
            });
        })


        $("#btn_runFromTable").click(function () {
            //提示信息
            $(".reminder").html("出图中,请稍后....");
            runFromTable();//根据表格出图
        })

    }
}




