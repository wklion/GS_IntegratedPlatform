/**
 * @author: wangkun
 * @date:2017-10-18
 * @description 图层管理
 */
function LayerManagerUtil() {
    this._init_();
}
LayerManagerUtil.prototype = {
    constructor: LayerManagerUtil,
    _init_: function () {
        this.name = "图层管理";
    },
    /**
     * @author:wangkun
     * @date:2017-10-18
     * @return:
     * @description:添加图层
     */
    addLayer: function (layername, layertype) {
        var layers = GDYB.Page.curPage.map.getLayersByName(layername);
        var layer = null;
        if (layers.length > 0) {
            layer = layers[0];
        }
        else{
            if (layertype === "vector") {
                layer = new WeatherMap.Layer.Vector(layername, { renderers: ["Canvas2"] });
            }
            GDYB.Page.curPage.map.addLayer(layer);
        }
        return layer;
    },
    getLayer:function(layername){
        var layers = GDYB.Page.curPage.map.getLayersByName(layername);
        if (layers.length > 0) {
            return layers[0];
        }
        else{
            return null;
        }
    },
    /**
     * @author:wangkun
     * @date:2017-10-18
     * @return:
     * @description:移除图层
     */
    removeLayer:function(layername){
        var layers = GDYB.Page.curPage.map.getLayersByName(layername)
        if(layers.length>0){
            GDYB.Page.curPage.map.removeLayer(layers[0]);
        }
    }
}