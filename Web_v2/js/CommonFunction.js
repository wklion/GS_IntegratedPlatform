/**
 * Created by zouwei on 2016/3/7.
 */
function alertFuc(content) {
    $("#map_alert_div").html(content);

    if ($("#map_alert_div").css("display") == "none") {
        $("#map_alert_div").css("display", "block");
        var tickcount = 0;
        var int = self.setInterval(function () {
            tickcount++;
            var left = 45 + tickcount;
            $("#map_alert_div").css("left", left + "%");
            if (left >= 55) {
                clearInterval(int);
                $("#map_alert_div").css("display", "none");
            }
        }, 100);
    }
}
/**
 * @author:wangkun
 * @date:2017-06-21
 * @return:
 * @description:画进度
 */
function drawProcess(width) {
    $('canvas.process').each(function () {
        var text = $(this).text();
        var process = text.substring(0, text.length - 1);
        var canvas = this;
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, width, width);

        context.beginPath();
        context.moveTo(width / 2, width / 2);
        context.arc(width / 2, width / 2, width / 2, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStyle = '#ddd';
        context.fill();

        context.beginPath();
        context.moveTo(width / 2, width / 2);
        context.arc(width / 2, width / 2, width / 2, 0, Math.PI * 2 * process / width, false);
        context.closePath();
        if (process < 60) {
            context.fillStyle = 'red';
        }
        else if (process < 80) {
            context.fillStyle = 'yellow';
        }
        else {
            context.fillStyle = '#2a2';
        }
        context.fill();

        context.beginPath();
        context.moveTo(width / 2, width / 2);
        context.arc(width / 2, width / 2, width / 2 - 10, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = 'rgba(255,255,255,1)';
        context.fill();

        context.beginPath();
        context.arc(width / 2, width / 2, width / 2 - 20, 0, Math.PI * 2, true);
        context.closePath();
        context.strokeStyle = '#ddd';
        context.stroke();
        context.font = "bold 9pt Arial";
        context.fillStyle = '#2a2';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.moveTo(width / 2, width / 2);
        context.fillText(text, width / 2, width / 2);
    });
}
function AJAX(url, paramdata, errorCallback, successCallback) {
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        data: {
            'para': paramdata
        },
        dataType: 'json',
        error: function (data) {
            $.isFunction(errorCallback) && errorCallback.call(data);
        },
        success: function (data) {
            $.isFunction(successCallback) && successCallback.call(null, data);
        }
    });
}
function stopDragMap() {
    var map = GDYB.Page.curPage.map;
    for (var i = 0; i < map.events.listeners.mousemove.length; i++) {
        var handler = map.events.listeners.mousemove[i];
        if (handler.obj.CLASS_NAME == "WeatherMap.Handler.Drag") {
            handler.obj.active = false;
        }
    }
}
function startDragMap() {
    var map = GDYB.Page.curPage.map;
    for (var i = 0; i < map.events.listeners.mousemove.length; i++) {
        var handler = map.events.listeners.mousemove[i];
        if (handler.obj.CLASS_NAME == "WeatherMap.Handler.Drag") {
            handler.obj.active = true;
        }
    }
}
/**
 * @author:wangkun
 * @date:2017-06-21
 * @modifyDate:2017-06-21
 * @return:
 * @description:DataGrid转DatasetGrid
 */
function convertDataGridToDatasetGrid(data,bWind){
    var dvalues = data.dvalues;
    var rows = data.rows;
    var cols = data.cols;
    var hasTag = (!bWind)&&(dvalues.length==rows*cols*2);
    var dimensions = (bWind||hasTag) ? 2 : 1; //维度，风场有两维；带有Tag属性也是两维
    var datasetGrid = new WeatherMap.DatasetGrid(data.left, data.top, data.right, data.bottom, rows, cols, bWind?2:1); //只有风是两要素
    datasetGrid.noDataValue = data.noDataValue;
    var grid = [];
    var tag = [];
    var dMin = 9999;
    var dMax = -9999;
    for(var i=0;i<rows;i++){
        var tagLine = [];
        var nIndexLine = cols * i * dimensions;
        for(var j=0;j<cols;j++){
            var nIndex = nIndexLine + j * dimensions;
            var z;
            if (bWind) {
                z = dvalues[nIndex + 1];
                grid.push(Math.round(dvalues[nIndex+1])); //风速在前
                grid.push(Math.round(dvalues[nIndex]));   //风向在后
            }
            else {
                z = dvalues[nIndex];
                grid.push(Math.round(dvalues[nIndex] * 10) / 10);
                if(hasTag)
                    tagLine.push(dvalues[nIndex+1]);
            }
            if (z != 9999 && z != -9999) {
                if (z < dMin)
                    dMin = z;
                if (z > dMax)
                    dMax = z;
            }
        }
        if(hasTag)
            tag.push(tagLine);
    }
    datasetGrid.grid = grid;
    datasetGrid.dMin = dMin;
    datasetGrid.dMax = dMax;
    if(hasTag){
        datasetGrid.tag = tag;
        datasetGrid.defaultTag = 0;
    }
    return datasetGrid;
}
/**
 * @author:wangkun
 * @date:2017-11-02
 * @param:
 * @return:
 * @description:排序
 */
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}
/**
 * @author:wangkun
 * @date:2017-11-17
 * @modifyDate:2017-11-17
 * @return:
 * @description:下载文件
 */
function downloadFile(fileName,url){
    var aLink = document.createElement('a');
    var evt = document.createEvent("HTMLEvents");
    //evt.initEvent("click", false, false);
    aLink.download = fileName;
    aLink.href = url;
    aLink.click();
}