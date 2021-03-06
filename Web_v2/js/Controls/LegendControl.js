/**
 * @author: wangkun
 * @date:2017-12-21
 * @description 图例
 */
function LegendControl() {
  this._init_();
}
LegendControl.prototype = {
  constructor: LegendControl,
  _init_: function () {
    this.name = "图例";
    $("#map_div").append(`
      <div id="legend" class="legend">
      </div>
    `);
    //this.add("雷达",heatMap_RadarStyles);
  },
  /**
   * @author:wangkun
   * @date:2017-12-21
   * @modifyDate:
   * @return:
   * @description:添加图例
   */
  add:function(name,styles){
    var size = styles.length;
    var html = "<div class='item' id=legend_"+name+">";
    html += "<div class='item_name'>"+name+"</div>";
    styles.forEach(item=>{
      html+="<div class='itemC' flag='"+item.start+"'><div class='item_color' style='background-color:rgba("+item.startColor.red+","+item.startColor.green+","+item.startColor.blue+",1"+")'></div>"
      +"<div class='itemC_name'>"+item.start+"</div></div>";
    });
    html += "</div>";
    $("#legend").append(html);
    
  },
  /**
   * @author:wangkun
   * @date:2017-12-21
   * @modifyDate:
   * @return:
   * @description:移除图例
   */
  remove:function(name){
    $("#legend_"+name).remove();
  },
  /**
   * @author:wangkun
   * @date:2017-12-21
   * @modifyDate:
   * @return:
   * @description:隐藏低于多少的图例
   */
  hideItemL:function(name,val){
    $("#legend_"+name+" .itemC").each((index,item)=>{
      var thisVal = item.attributes['flag'].value;
      if(thisVal<=val){

      }
    });
  },
  /**
   * @author:wangkun
   * @date:2017-2-4
   * @modifyDate:
   * @return:
   * @description:清除图例
   */
  clear:function(){
    $("#legend").empty();
  }
}