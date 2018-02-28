/*eslint no-unused-vars:off*/
/*eslint no-undef:off*/
var YJXHPageClass = PageBase.prototype.extend({
  className: 'YJXHPage111',
  Grid: null, //表格插件实例
  drawStyle: { //绘制相关图层样式
    strokeColor: '#00e09e',
    fillColor: '#3de1ad',
    fillOpacity: 0.4
  },
  myDateSelecter1: null,
  myDateSelecter2: null,
  timeRangeMin: null,
  timeRangeMax: null,
  queryResult: null,
  oldQueryResult: null,
  optFilter: null,
  filterCount: null,
  departCode: null, //用户区域范围控制
  departRangeArr: null, //用户区域范围控制

  ZH_CATE: [
    { label: '强对流', val: '11B31', for: 'cate_opt_qiangduiliu' },
    { label: '大风', val: '11B06', for: 'cate_opt_dafeng' },
    { label: '暴雨', val: '11B03', for: 'cate_opt_baoyu' },
    { label: '冰雹', val: '11B15', for: 'cate_opt_bingbao' },
    { label: '暴雪', val: '11B04', for: 'cate_opt_baoxue' },
    { label: '道路结冰', val: '11B21', for: 'cate_opt_jiebing' },
    { label: '大雾', val: '11B17', for: 'cate_opt_dawu' },
    { label: '干旱', val: '11B22', for: 'cate_opt_ganhan' },
    { label: '高温', val: '11B09', for: 'cate_opt_gaowen' },
    { label: '寒潮', val: '11B05', for: 'cate_opt_hanchao' },
    { label: '雷电', val: '11B14', for: 'cate_opt_leidian' },
    { label: '霾', val: '11B99', for: 'cate_opt_wumai' },
    { label: '沙尘', val: '11B07', for: 'cate_opt_shachen' },
    { label: '霜冻', val: '11B16', for: 'cate_opt_shuangdong' }
  ],

  ZH_LEVEL: [
    { label: '蓝色', val: 'Blue', for: 'lv_opt_blue' },
    { label: '黄色', val: 'Yellow', for: 'lv_opt_yellow' },
    { label: '橙色', val: 'Orange', for: 'lv_opt_orange' },
    { label: '红色', val: 'Red', for: 'lv_opt_red' }
  ],

  ZH_STATUS: [
    { label: '发布', val: 'Alert', for: 'status_opt_issue' },
    { label: '解除', val: 'Cancel', for: 'status_opt_remove' },
  ],

  ZH_CITY: [
    { label: '中心台', val: '6200', for: 'city_opt_center' },
    { label: '兰州', val: '6201', for: 'city_opt_lanzhou' },
    { label: '嘉峪关', val: '6202', for: 'city_opt_jiayuguan' },
    { label: '金昌', val: '6203', for: 'city_opt_jinchang' },
    { label: '白银', val: '6204', for: 'city_opt_baiyin' },
    { label: '天水', val: '6205', for: 'city_opt_tianshui' },
    { label: '武威', val: '6206', for: 'city_opt_wuwei' },
    { label: '张掖', val: '6207', for: 'city_opt_zhangye' },
    { label: '平凉', val: '6208', for: 'city_opt_pingliang' },
    { label: '酒泉', val: '6209', for: 'city_opt_jiuquan' },
    { label: '庆阳', val: '6210', for: 'city_opt_qingyang' },
    { label: '定西', val: '6211', for: 'city_opt_dingxi' },
    { label: '陇南', val: '6212', for: 'city_opt_longnan' },
    { label: '临夏', val: '6229', for: 'city_opt_linxia' },
    { label: '甘南', val: '6230', for: 'city_opt_gannan' }
  ],


  renderMenu: function() {
    var me = this;
    this._Areas_ = [];
    /**
     * 预警制作实例
     * @type {AlertSignalProduce}
     */
    if (!GDYB.User) {
      alertModal("未登录");
      throw Error("未登录");
    }

     //加载登录用户区域范围
    this.departCode = GDYB.User.getDepart();

    this.Produce = new AlertSignalProduce({
      user: {
        userName: '测试用户',
        areaCode: Number(this.departCode)
      }
    });

    this.loadAreaRangeData();

    // 获取县级区域信息
    this.areaFeatures = [];

    $.when(this.downAreas('62', 'cty'), this.downAreas('62', 'cnty'))
      .done(function(data1, data2) {
        var areas = data1.concat(data2);
        this._Areas_ = areas; // 缓存原始数据
        console.time('dealAreas');
        var cityIndexMap = {}; //市级索引Map
        var lasts = []; //县级剩余
        for (var i = areas.length; i--;) {
          var area = areas[i],
            attr = area.attributes;
          switch (Number(attr.LEVEL)) {
            case 1: //市级
              area.children = [];
              this.areaFeatures.push(area);
              cityIndexMap[attr.CODE] = this.areaFeatures.length - 1;
              break;
            case 2: //县级
              var cityIndex = cityIndexMap[attr.PARENT];
              if (cityIndex === undefined) lasts.push(area);
              else this.areaFeatures[cityIndex].children.push(area);
              break;
          }
        }
        // 添加剩下县级区域
        for (var j = 0, len = lasts.length; j < len; j++) {
          var area = lasts[j];
          var cityIndex = cityIndexMap[area.attributes.PARENT];
          if (typeof cityIndex === 'number')
            this.areaFeatures[cityIndex].children.push(area);
        }
        console.timeEnd('dealAreas');
        cityIndexMap = null;
        lasts = null;
        i = null;
        j = null;

        // Debug 输出市 县 代码
        console.log(`共计: ${areas.length}`);
        console.log((this.areaFeatures.map(item => {
          var attr = item.attributes,
            children = item.children;
          return `${attr.NAME} ${attr.CODE} ${children.length}: ${
                        children.map(item => {
                            return item.attributes.CODE;
                        }).join('\t')}`;
        })).join('\n'));

      }.bind(this))
      .done(function() {
        this.loadData()
      }.bind(this))
      .fail(function(err) {
        console.log(err);
        layer.msg(`基础数据准备失败，请重试：${err.message}`);
      });

    var signal_dict = this.Produce.CONST.signal_dict,
      firstSignalType = T.firstKey(signal_dict),
      firstSignalLevel = T.firstVal(signal_dict)[0];

    /**
     * 初始化页面
     */
    var htmlstr_yjxh = `
    <div class='opt-panel-container opt-panel-yjxh' name='yjxh'>
      <section style="margin-bottom: 10px;">
        <div class="radio btn_line3 menuDiv_bottom1">
          <div style="margin: 5px 0px 0px 0px;">
            <button value="ljyb_sk" class="active" style="width:112px;">强天气实况</button>
            <button value="radar_mcr" style="width:112px;">35dbz回波</button>
            <button value="radar_mvil" style="width:112px;">液态含水量</button>
          </div>
        <div style="margin: 5px 0px 0px 0px;">
            <button value="grapes_3km_cr" style="width:112px;">1H反射率预报</button>
            <button value="ljyb_dq" style="width:112px;">短强预报</button>
            <button value="ljyb_qs" style="width:112px;">临近预报</button>
        </div>
        </div>
      </section>
      <section style="margin-bottom: 10px;">
        <img id="signal-icon" src=${this.Produce.getAlertIcon(firstSignalType + firstSignalLevel)} style="position: absolute; width: 55px; right: 0; margin: 5px 32px 0;">
        <div class="title1">预警信号制作：</div>
        <div class="title2">信号类型</div>
        <div id="signal-type" class="btn_line3 radio" style="margin:0; padding-bottom:0;">
          ${function (dict) {
            var btns = '';
            for (var type in dict) {
                btns += `<button value="${type}">${type}</button>`;
            }
            return btns;
        }(signal_dict)}
        </div>
        <div class="title2">信号级别</div>
        <div id="signal-level" class="btn_line3 radio" style="margin:0;">
          ${function (levels) {
            var btns = '';
            for (var i = 0; i < levels.length; i++) {
                var level = levels[i];
                btns += `<button value="${level}" style="width: 70px;">${level}</button>`;
            }
            return btns;
        }(T.firstVal(signal_dict))}
        </div>
        <div class="btn_line" style="text-align:center;">
          <a class="draw start popup-btn primary" style="width: 100px;">绘制落区</a>
          <a class="produce popup-btn primary" style="width: 100px;">开始制作</a>
        </div>
      </section>
      <section style="margin-bottom: 10px;">
        <div class="title1" style="display:inline-flex;">预警信号列表：<div id="alert-grid-title" style="padding-left:20px;"></div></div>
        <div id="grid-wrapper" style="display:block; width:100%; height:360px; padding:0; margin:2px 0; border: 1px solid #02425e;">
          <div style="width: 100%;height: 100%;text-align: center;padding: 47%;">暂无数据</div>
        </div>
      </section>
      <!--
      <section>
        <div class="title1">预警信号动画：</div>
        <div class="btn_line3 animator-ctrl">
          <button value="start">播放</button>
          <button value="stop">停止</button>
          <button value="pause">隐藏</button>
        </div>
      </section>
      -->
    </div>`;

    var htmlstr_yjcx = `
      <div class='opt-panel-container opt-panel-yjcx' name='yjcx' style='display: none;'>
        <div class='opt-panel'>
          <div class='opt-panel-label'>
            <i class='fa fa-clock-o'></i> 时间
          </div>
          <div class='opt-panel-content'>
            <div class='btn_line3' style='width: 100%; height: 34px;'>
              <span style='float: left; margin: 0 4px 0 0;'>从：</span>
              <div id='dateSelect1' class='dateSelect' style='float: left; height: 26px;'></div>
            </div>
            <div class='btn_line3' style='width: 100%; height: 34px; padding: 0 10px 0 10px;'>
              <span style='float: left; margin: 0 4px 0 0;'>到：</span>
              <div id='dateSelect2' class='dateSelect' style='float: left; height: 26px;'></div>
            </div>
          </div>
        </div>
        <div class='opt-panel'>
          <div class='opt-panel-label'>
            <i class='fa fa-list-ul'></i> 灾害种类
          </div>
          <div class='opt-panel-content'>${this.formatOpt(this.ZH_CATE)}</div>
        </div>
        <div class='opt-panel'>
          <div class='opt-panel-label'>
            <i class='fa fa-list-ul'></i> 灾害级别
          </div>
          <div class='opt-panel-content'>${this.formatOpt(this.ZH_LEVEL)}</div>
        </div>
        <div class='opt-panel'>
          <div class='opt-panel-label'>
            <i class='fa fa-list-ul'></i> 灾害状态
          </div>
          <div class='opt-panel-content'>${this.formatOpt(this.ZH_STATUS)}</div>
        </div>
        <div class='opt-panel'>
          <div class='opt-panel-label'>
            <i class='fa fa-list-ul'></i> 灾害市州
          </div>
          <div class='opt-panel-content'>${this.formatOpt(this.ZH_CITY)}</div>
        </div>
        <div class='opt-panel opt-panel-content-info'>
          <div id='alarm-info-item' class='alarm-info-item'>
            <!--<h5><img src="http://127.0.0.1:8080/gs/imgs/WarningIcon/暴雨蓝色.jpg">兰州中心气象台发布强对流蓝色预警[IV级/一般]<strong>2017-06-08</strong></h5>-->
          </div>
        </div>
      </div>
    `;

    var htmlstr_optCard = `
      <button class='menu_change active' name='yjxh'>预警信号</button>
      <button class='menu_change' name='yjcx'>预警查询</button>
    `;

    $('.content').append('<div class="yjxh-container"><div id="menu_changeDiv" class="menu_changeDiv"></div><div id="menu_bd"></div></div>')

    // 菜单栏
    $('#menu_bd').empty()
      .append(htmlstr_yjxh)
      .append(htmlstr_yjcx);
    // 选项卡
    $(".menu_changeDiv").html(htmlstr_optCard);
    // 选项卡点击事件
    $('.menu_change').click((e) => {
      let tar = $(e.target).attr('name');
      $('.menu_change').removeClass('active');
      $(e.target).addClass('active');
      $('.opt-panel-container').hide();
      $('#menu_bd .opt-panel-' + tar).show();
    });

    // 监听复选框的状态改变
    let $selOpt = $('input[id*="_opt_"]');
    $selOpt.change((e) => {
      this.optionFilters($selOpt);
    });

    this.myDateSelecter1 = new DateSelecter(1, 1); //最小视图为天
    this.myDateSelecter1.changeHours(-24 * 60);
    this.myDateSelecter1.intervalMinutes = 60 * 24; //12小时
    this.myDateSelecter2 = new DateSelecter(1, 1); //最小视图为天
    this.myDateSelecter2.intervalMinutes = 60 * 24; //12小时
    this.timeRangeMin = this.myDateSelecter1.getCurrentTime(false);
    this.timeRangeMax = this.myDateSelecter2.getCurrentTime(false);
    $("#dateSelect1").append(this.myDateSelecter1.div);
    $("#dateSelect2").append(this.myDateSelecter2.div);
    $("#dateSelect1, #dateSelect2").find("input").css("width", "191px");
    $("#dateSelect1, #dateSelect2").find("img").css("display", "none");
    $("#dateSelect1, #dateSelect2").find("input").css({
      'border': '1px solid #31caff',
      'box-shadow': 'none',
      'color': '#31caff'
    });

    // 时间下限改变时重新读取数据
    this.myDateSelecter1.input.change((e) => {
      me.timeRangeMin = me.myDateSelecter1.getCurrentTime(false);
      me.getAlarmInfo(me.timeRangeMin, me.timeRangeMax);
    });

    // 时间上限改变时重新读取数据
    this.myDateSelecter2.input.change((e) => {
      me.timeRangeMax = me.myDateSelecter2.getCurrentTime(false);
      me.getAlarmInfo(me.timeRangeMin, me.timeRangeMax);
    });

    // 进入后先加载一次数据
    me.getAlarmInfo(me.timeRangeMin, me.timeRangeMax);

    // 单选按钮组
    $('.radio').on('click', 'button', function(event) {
      event.preventDefault();
      if ($(this).hasClass('active')) {
        event.stopImmediatePropagation();
      } else {
        $(this).addClass('active').siblings('.active').removeClass('active');
      }
    });


    // 预警类型级别切换控制
    $('#signal-type').on('click', 'button', function() {
      var btns = '',
        levels = signal_dict[this.value];
      for (var i = 0; i < levels.length; i++) {
        var level = levels[i];
        btns += `<button ${i === 0 ? 'class="active"' : ''} value="${level}" style="width: 70px;">${level}</button>`;
      }
      $('#signal-level').html(btns);
    }).find('button:first-child').addClass('active');
    $('#signal-level').find('button:first-child').addClass('active');
    $('#signal-type,#signal-level').on('click', 'button', function() {
      var signalType = $('#signal-type').find('.active').val(),
        signalLevel = $('#signal-level').find('.active').val(),
        signalIcon = me.Produce.getAlertIcon(signalType + signalLevel);
      $('#signal-icon').attr('src', signalIcon);
      me.Produce.updateSetting({
        signalType: signalType,
        signalLevel: signalLevel
      });
      // 更新样式
      me.dxVectorLayer.style = me.getDrawStyle();
      if (me.dxVectorLayer.getVisibility())
        me.dxVectorLayer.redraw();
    });

    // 选项卡点击事件

    // 动画控制
    $('.animator-ctrl').on('click', 'button', function(event) {
      event.preventDefault();
      var ctrl = this.value;
      var animatorLayer = me.animatorLayer;
      if (!animatorLayer) return;
      var animator = animatorLayer.animator;
      if (!animator) return;

      switch (ctrl) {
        case 'start':
          me.toggleMarkerLayer(true);
          if (!animatorLayer.features.length) {
            animatorLayer.addFeatures(animatorLayer._FEATURES_);
          }
          animator.start();
          break;
        case 'pause':
          animator.pause();
          me.toggleMarkerLayer(false);
          break;
        case 'stop':
          animator.stop();
          animatorLayer.removeAllFeatures();
          break;
      }
    });

    /**
     * 产品制作入口
     */
    $('.content').on('click', '.produce', function(event) {
      event.preventDefault();
      // 打开制作面板
      me.Produce.open();
    });

    /**
     * 绘图入口
     */
    $('.content').on('click', '.draw', function(event) {
      event.preventDefault();
      var $this = $(this);
      var beginning = $this.hasClass('start');
      // 切换状态
      $this.toggleClass('start btn-success primary')
        .text(beginning ? '完成绘制' : '绘制落区');

      // 开始绘制
      if (beginning) {
        me.clearDraw(); //重置绘图区
        me.draw();
        return;
      }

      // 完成绘制 -> 出图
      me.stopDraw();
      var features = me.dxVectorLayer.features;
      if (!T.isPretty(features)) return;
      var layerIndex = layer.load(0);
      // 获取选择区域 & 更新
      var polygon = features[0].geometry;
      me.getIntersects(polygon)
        .done(function(allowedFeatures, allowedAttrs) {
          // 更新地图
          me.draw2Luoqu(allowedFeatures);
          // 更新配置
          me.Produce.updateSetting({
            areas: allowedAttrs
          });
        })
        .always(function() {
          layer.close(layerIndex);
        });
    });

    // 复制常量属性
    this.CONST = this.Produce.CONST;

    /**
     * 事件注册
     */
    // 数据加载完成
    this.Produce.on('ready', this.init.bind(this));
    // 添加预警完成
    this.Produce.on('added', function(attr) {
      var me = this,
        instance = this.Grid;
      this.queryAlertSignalGeo({ alertId: attr.alertId })
        .done(function(data) {
          if (!T.isPretty(data)) return;
          data = data[0];
          var index = instance.countRows();
          var rowIndex = 0;
          // 更新地图
          me.addMarker(data, index);
          me.addAnimator(data, index);
          //更新表格
          var uData = [data].concat(instance.getSourceData());
          instance.updateSettings({ data: uData });
          instance.selectCell(0, 0);
        });
    }.bind(this));
  },

  /**
   * 格式化选项
   *
   * @param {any} d
   * @returns
   */
  formatOpt(d) {
    let optStr = '';
    for (let i in d) {
      optStr += `<label for="${d[i].for}"><input id="${d[i].for}" type="checkbox" value="${d[i].val}"> ${d[i].label}</label>`;
    }
    return optStr;
  },

  /**
   * 获取灾害信息
   *
   * @param {string} startTime 查询的开始时间
   * @param {string} endTime 查询的结束时间
   */
  getAlarmInfo(startTime, endTime) {
    let m = this;
    let par = { para: JSON.stringify({ startTime: startTime, endTime: endTime }) };
    $.ajax({
      url: gsDataService + 'services/DBService/getSignalGtDataByTimes',
      type: 'POST',
      data: par,
      success: (res) => {
        m.setQueryResult(res)
      },
      error: (e) => {
        console.log(e)
      }
    });
  },

  /**
   * 设置原始结果
   * @param {*} res
   */
  setQueryResult(res) {
    this.queryResult = res;
    this.oldQueryResult = res;
    // console.log(this.queryResult);
    this.optionFilters(res);
  },

  /**
   * 渲染报警信息列表
   * @param {any} res
   */
  renderAlarmList(res) {
    let [sel, tmpStr] = [$('#alarm-info-item'), ''];
    for (let i in res) {
      let imgUrl = this.getAlarmImg(res[i].eventType, res[i].severity);
      tmpStr += `<h5><img src="http://172.23.2.237:8080/gdyb/imgs/WarningIcon/${imgUrl}.jpg">${res[i].headline}<strong>${new Date(res[i].sendTime).toLocaleDateString()}</strong></h5>`
    }
    sel.empty().html(tmpStr);
  },

  /**
   * Filter
   * @author Sean
   * @param {any} sel selector
   */
  optionFilters(sel) {
    let [tmpAny, newResAny, oldResAny] = [
      [],
      [], this.oldQueryResult
    ]; // 参与过滤
    let [countRes, notes] = [
      [], {}
    ]; // 用于统计灾害类型出现的次数

    // 参与过滤的条件
    for (let i = 0; i < sel.length; i++) {
      if (sel[i].checked) {
        let tmpObj = { type: sel[i].id.split('_opt_')[0], val: sel[i].value, name: sel[i].id.split('_opt_')[1] };
        tmpAny.push(tmpObj);
      }
    }

    // 初始化统计对象
    for (let i in this.ZH_CATE) {
      notes[this.ZH_CATE[i].val] = 0;
    }

    // 开始过滤
    for (let i = 0; i < tmpAny.length; i++) {
      let ftAny = [];
      for (let j = 0; j < oldResAny.length; j++) {
        if (tmpAny[i].type == 'cate' && oldResAny[j].eventType == tmpAny[i].val) {
          ftAny.push(oldResAny[j]);
        } else if (tmpAny[i].type == 'lv' && oldResAny[j].severity == tmpAny[i].val) {
          ftAny.push(oldResAny[j]);
        } else if (tmpAny[i].type == 'status' && oldResAny[j].msgType == tmpAny[i].val) {
          ftAny.push(oldResAny[j]);
        } else if (tmpAny[i].type == 'city' && oldResAny[j].senderCode.indexOf(tmpAny[i].val) == 0) {
          ftAny.push(oldResAny[j]);
        }
        /* else { console.error('没有找到匹配的条件'); }*/
      }
      oldResAny = ftAny;
    }

    // 开始统计
    for (let i = 0; i < oldResAny.length; i++) {
      notes[oldResAny[i].eventType]++;
    }

    newResAny = oldResAny;
    // this.filterCount = notes;

    // 空量输出
    if (tmpAny.length > 0) {
      this.queryResult = newResAny;
    } else {
      this.queryResult = this.oldQueryResult;
    }

    this.renderAlarmList(this.queryResult); // 执行列表DOM渲染
    this.renderAlarmCountPanel(notes); // 统计结果面板渲染
  },

  /**
   * 获取图片名称
   * @param {*} eventType
   * @param {*} color
   */
  getAlarmImg(eventType, color) {
    let str = '';
    for (let i in this.ZH_CATE) {
      if (eventType == this.ZH_CATE[i].val) {
        str += this.ZH_CATE[i].label;
        for (let j in this.ZH_LEVEL) {
          if (color == this.ZH_LEVEL[j].val) {
            str += this.ZH_LEVEL[j].label;
          }
        }
      }
    }
    // encodeURIComponent
    return str;
  },

  /**
   * 数组去重
   * @param {*} any
   */
  anyUnquire(any) {
    let [result, notes] = [
      [], {}
    ];
    for (let i = 0; i < any.length; i++) {
      if (!notes[any[i]]) {
        result.push(any[i]);
        notes[any[i]] = 1;
      }
    }
    return result;
  },

  /**
   * 渲染统计结果面板
   * @param rs
   */
  renderAlarmCountPanel(rs) {
    let [htmlTabHead, htmlConTd] = [``, ``];
    let htmlContainer = ``;
    let sum = 0;

    for (let i in this.ZH_CATE) {
      htmlTabHead += `<td>${this.ZH_CATE[i].label}</td>`;
      for (let j in rs) {
        if (this.ZH_CATE[i].val == j) {
          sum += rs[j];
          htmlConTd += `<td>${rs[j]}</td>`;
        }
      }
    }

    htmlTabHead += `<td>共计</td>`;
    htmlConTd += `<td>${sum}</td>`;
    htmlContainer = `<div id="alarmCountTable" class="delete"><table><thead><tr>${htmlTabHead}</tr></thead><tbody><tr>${htmlConTd}</tr></tbody></table></div>`;

    let selector = document.getElementById('alarmCountTable');

    if (selector == null) {
      $('body').append(htmlContainer);
    } else {
      $('#alarmCountTable').remove();
      $('body').append(htmlContainer);
    }
  },


  // 初始化
  init: function() {
    this.forecastMarkersLayer = null; //地图标注层
    this.animatorLayer = null; //地图动画层
    this.popupFrame = null; //地图弹出层

    this.init4Map();
    //this.loadData();
  },
  init4Map: function() {
    var me = this;
    var style = { //绘制相关图层样式
      strokeColor: '#00e09e',
      fillColor: '#3de1ad',
      fillOpacity: 0.4
    };
    // Marker图层
    if (!this.forecastMarkersLayer) {
      this.forecastMarkersLayer = new WeatherMap.Layer.Markers('forecastMarkersLayer');
      this.map.addLayer(this.forecastMarkersLayer);
    }
    this.forecastMarkersLayer.clearMarkers();
    // 动画图层
    if (!this.animatorLayer) {
      this.animatorLayer = new WeatherMap.Layer.AnimatorVector('animatorLayer', {
        rendererType: 'GlintAnimator'
      }, {
        repeat: true,
        speed: 1,
        startTime: 1,
        endTime: 1,
        frameRate: 20
      });
      this.animatorLayer.renderer.pointStyle = {
        pointRadius: 15,
        fillOpacity: 0.3
      };
      this.map.addLayer(this.animatorLayer);
    }
    this.animatorLayer.removeAllFeatures();

    //绘制图层
    if (!this.drawPolygon) {
      // 保存绘制结果图层
      this.dxVectorLayer = new WeatherMap.Layer.Vector('dxVectorLayer');
      // 绘制图层
      this.dxdrawLayer = new WeatherMap.Layer.Vector('dxdrawLayer');

      this.dxVectorLayer.style = this.drawStyle;
      this.dxdrawLayer.style = this.drawStyle;

      // 绘制控件
      this.drawPolygon = new WeatherMap.Control.DrawFeature(this.dxdrawLayer, WeatherMap.Handler.PolygonFree);
      this.drawPolygon.events.on({
        featureadded: function(eventArgs) {
          me.drawCompleted(eventArgs);
        }
      });
      this.map.addControl(this.drawPolygon);
      this.map.addLayer(this.dxVectorLayer);
    }

    // 标注图层
    if (!this.dxLabelLayer) {
      var strategy = new WeatherMap.Strategy.GeoText();
      strategy.style = {
        fontColor: '#000',
        fontWeight: 'normal',
        fontSize: '14px',
        fontSize: '14px',
        fill: true,
        fillColor: '#ffffff',
        fillOpacity: .8,
        stroke: true,
        strokeColor: '#c8c8c8'
      };
      this.dxLabelLayer = new WeatherMap.Layer.Vector("Label", { strategies: [strategy] });
      this.map.addLayer(this.dxLabelLayer);
    }

    // 清空弹出层
    this.map.removeAllPopup();
  },
  initGrid: function(data) {
    var me = this;
    var $container = $('#grid-wrapper').empty();
    var gridElement = $('<div class="alert-grid"></div>').appendTo($container)[0];

    function renderColor(instance, td, row, col) {
      var args = [].slice.call(arguments);
      var rowData = instance.getSourceDataAtRow(row);
      var level = rowData.signalLevel;
      var gbColor = me.getAlertColor(level);
      var color = level === '黄色' ? '#000' : '#fff';
      Handsontable.renderers.TextRenderer.apply(this, args);
      td.style.backgroundColor = gbColor;
      td.style.color = color;
    }

    var cols = [{
        title: '预警',
        data: 'type',
        readOnly: true,
        renderer: function(instance, td, row, col) {
          var args = [].slice.call(arguments);
          var rowData = instance.getSourceDataAtRow(row);
          args[5] = rowData.signalType + rowData.signalLevel;
          renderColor.apply(this, args);
        }
      },
      {
        title: '时间',
        data: 'issueTime',
        readOnly: true,
        type: 'date',
        dateFormat: 'YYYY-MM-DD HH:mm',
        renderer: function() {
          var args = [].slice.call(arguments);
          args[5] = moment(args[5]).format('YYYY-MM-DD HH:mm');
          renderColor.apply(this, args);
        }
      },
      { title: '发布', data: 'city', readOnly: true, renderer: renderColor }, {
        title: '状态',
        data: 'changes',
        type: 'numeric',
        readOnly: true,
        renderer: function() {
          var args = [].slice.call(arguments);
          args[5] = me.Produce.getAlertChange(args[5]);
          renderColor.apply(this, args);
        }
      }
    ];
    var instance = new Handsontable(gridElement, Handsontable.addon.paramize(cols, data, {
      height: 400,
      colWidths: [64, 120, 64, 50],
      contextMenu: false,
      dropdownMenu: ['filter_by_condition', 'filter_action_bar', '---------', 'filter_by_value'],
      rowHeaders: false,
      multiSelect: false,
      currentRowClassName: 'highlightRow',
      currentColClassName: '',
      outsideClickDeselects: false //保持选中
    }));

    var currentRow = null;
    instance.addHook('afterSelectionEnd', function(row) {
      var currentData = this.getSourceDataAtRow(row);
      me.popup4Map(currentData, 'grid');
    });
    // 排序后默认选中第一行
    instance.addHook('afterColumnSort', function() {
      this.selectCell(0, 0);
    });

    // 表格信息
    $('#alert-grid-title').html(data.length > 0 ? `最新${data.length}预警` : '暂无数据');

    return this.Grid = instance;
  },
  /**
   * 添加动画至地图
   * @param  {Object}   attr  预警信号
   * @param  {Number}   index 索引
   */
  addAnimator: function(attr, index) {
    var style = { //点样式
      stroke: false,
      pointRadius: 2,
      outterRadius: 15
    };
    if (Number(attr.stationId) === 14) {
      style.outterRadius = 20;
    }
    var point = new WeatherMap.Geometry.Point(attr.longitude, attr.latitude);
    var pointStyle = Object.assign({}, style, { //样式
      fillColor: this.Produce.getAlertColor(attr.signalLevel)
    });
    var pointFeature = new WeatherMap.Feature.Vector(point, {
      TIME: 1,
      FEATUREID: index
    }, pointStyle);

    this.animatorLayer.addFeatures([pointFeature]);
    // 更新Features缓存
    this.animatorLayer._FEATURES_ = this.animatorLayer.features;
  },
  /**
   * 添加标注至地图
   * @param  {Object}   attr  预警信号
   * @param  {Number}   index 索引
   */
  addMarker: function(attr, index) {
    var me = this;
    var lonlat = new WeatherMap.LonLat(attr.longitude, attr.latitude);
    var size = new WeatherMap.Size(30, 25);
    if (Number(attr.stationId) === 14) {
      size = new WeatherMap.Size(60, 50)
    }
    var offset = new WeatherMap.Pixel(-size.w / 2, -size.h / 2);
    var alertName = attr.signalType + attr.signalLevel;
    var icon = this.Produce.getAlertIcon(alertName);

    var marker = new WeatherMap.Marker(
      new WeatherMap.LonLat(attr.longitude, attr.latitude),
      new WeatherMap.Icon(icon, size, offset)
    );
    marker.attributes = attr;
    marker.events.on({
      click: function() {
        me.popup4Map(this.attributes, 'click');
      },
      touchend: function() {
        me.popup4Map(this.attributes, 'touchend');
      },
      scope: marker
    });
    this.forecastMarkersLayer.addMarker(marker);
  },
  /**
   * 弹出地图弹出层
   */
  popup4Map: function(attr) {
    var stationId = attr.stationId,
      alertId = attr.alertId,
      markers = this.forecastMarkersLayer.markers,
      len = markers.length,
      results = [],
      i;
    for (i = 0; i < len; i++) {
      var attrI = markers[i].attributes;
      if (stationId === attrI.stationId && alertId != attrI.alertId) {
        results.push(attrI);
      }
    }

    // 按时间排序desc
    len = results.length;
    var exchange, tmp, j;
    for (i = 0; i < len; i++) {
      exchange = 0;
      for (j = len - 1; j > i; j--) {
        if (results[j].tnumber > results[j - 1].tnumber) {
          tmp = results[j - 1];
          results[j - 1] = results[j];
          results[j] = tmp;
          exchange = 1;
        }
      }
      if (!exchange) break;
    }

    this.addPopup([attr].concat(results));
  },
  /**
   * 添加地图弹出层
   * @param  {Object|Array:Object}   attr 预警信息
   */
  addPopup: function(attrs) {
    if (!T.isPretty(attrs)) return;
    var lonlat = new WeatherMap.LonLat(attrs[0].longitude, attrs[0].latitude);
    var cards = attrs.map(attr => {
      return this.addCard4Popup(attr);
    });
    var html = `<div class="produce-mappopup">${cards.join('')}</div>`;
    var popup = new WeatherMap.Popup.FramedCloud(
      'marker_popup',
      lonlat,
      null,
      html,
      null,
      true
    );
    popup.setOpacity(0.0);
    this.map.removeAllPopup();
    this.map.addPopup(popup);
  },
  /**
   * 添加预警信息卡片
   */
  addCard4Popup: function(attr) {
    var alertName = attr.signalType + attr.signalLevel,
      alertChange = this.Produce.getAlertChange(attr.changes),
      alertIcon = this.Produce.getAlertIcon(alertName),
      // alertColor = this.getAlertColor(attr.signalLevel),
      // fColor = attr.signalLevel === '黄色' ? '#000' : '#fff',
      dateStr = moment(attr.issueTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm'),
      alertContext = attr.issueContent.replace(/<br>/g, '</p><p>').replace(/\n/g, '</p><p>');
    return `
<div class="alertsignal">
  <div class="thumbnail"><img src="${alertIcon}"></div>
  <section id=${attr.alertId}>
    <header>${alertName} <datetime style="font-family: Arial;font-size: 12px;font-weight: 400;">${dateStr}</datetime></header>
    <article><p>${alertContext}</p></article>
    <footer><button class="popup-btn-alter popup-btn" >更改</button></footer>
  </section>
</div>`;
  },
  /**
   * 切换标注图层显隐
   * @param  {Boolean}   visible [description]
   */
  toggleMarkerLayer: function(visible) {
    visible = !!visible;
    this.forecastMarkersLayer.setVisibility(visible);
    this.animatorLayer.setVisibility(visible);
    if (!visible) {
      this.map.removeAllPopup();
    }
  },
  /**
   * 清除绘制图层
   * @return {[type]}   [description]
   */
  clearDraw: function() {
    this.dxdrawLayer.removeAllFeatures();
    this.dxVectorLayer.removeAllFeatures();
    this.dxLabelLayer.removeAllFeatures();
  },
  /**
   * 停止绘制
   */
  stopDraw: function() {
    this.drawPolygon.activate();
    this.startDragMap();
  },
  /**
   * 开始绘制
   */
  draw: function() {
    var me = this;
    this.toggleMarkerLayer(false);
    this.stopDragMap();
    //激活控件
    this.drawPolygon.activate();
  },
  /**
   * 完成绘制
   * @param  {Object}   eventArgs  Event
   */
  drawCompleted: function(eventArgs) {
    // 绘制geometry
    var geometry = eventArgs.feature.geometry.components;
    // 合并当前geometry
    if (this.dxVectorLayer.features.length === 1) {
      var geometryOld = this.dxVectorLayer.features[0].geometry;
      geometry = geometry.concat(geometryOld.components);
    }
    // 构建面
    var polygon = new WeatherMap.Geometry.Polygon(geometry);
    var geoVector = new WeatherMap.Feature.Vector(polygon);
    // 更新图层
    this.dxdrawLayer.removeAllFeatures();
    this.dxVectorLayer.removeAllFeatures();
    this.dxVectorLayer.style = this.getDrawStyle();
    this.dxVectorLayer.addFeatures([geoVector]);
    this.dxVectorLayer.redraw();
    // this.toggleMarkerLayer(true);
  },
  /**
   * 绘制落区图
   * @param  {Array:Feature}  features 选中区域
   */
  draw2Luoqu: function(features) {
    var textFeatures = [];
    // 计算中心点添加标注
    for (var i = features.length; i--;) {
      var geometry = features[i].geometry;
      var areaName = features[i].attributes.NAME;
      var point = geometry.getCentroid();
      var geoText = new WeatherMap.Geometry.GeoText(point.x, point.y, areaName);
      textFeatures.push(new WeatherMap.Feature.Vector(geoText));
    }
    this.dxLabelLayer.removeAllFeatures();
    this.dxVectorLayer.removeAllFeatures();
    this.dxLabelLayer.addFeatures(textFeatures);
    this.dxVectorLayer.addFeatures(features);
    this.dxVectorLayer.redraw();
  },
  /**
   * 获取相交区划区域
   * 全市相交添加市级区域，部分相交添加对应县级区域
   * @param  {Polygon}   polygon 多边形
   * @return {Promise}
   */
  getIntersects: function(polygon) {
    console.time('intersects'); // Debug

    var defer = new $.Deferred();

    // 整理属性
    function getAttr(feature) {
      var attr = feature.attributes;
      return {
        name: attr.NAME,
        code: attr.CODE,
        pId: attr.PARENT
      };
    }

    var areaFeatures = this.areaFeatures;
    var allowedFeatures = [];
    var allowedAttrs = [];

    // 遍历市级
    for (var i = areaFeatures.length; i--;) {
      var cityFeature = areaFeatures[i],
        cityPolygon = cityFeature.geometry;
      // 市级相交
      if (polygon.intersects(cityPolygon)) {
        var countryFeatures = cityFeature.children;
        var flag = true; //是否为全市
        var allowedFeatures2 = [];
        var allowedAttrs2 = [];
        // 遍历县级
        for (var j = countryFeatures.length; j--;) {
          var countryFeature = countryFeatures[j],
            countryPolygon = countryFeature.geometry;
          // 县级相交
          if (polygon.intersects(countryPolygon)) {
            allowedFeatures2.push(countryFeature);
            allowedAttrs2.push(getAttr(countryFeature));
          } else {
            flag = false;
          }
        }
        if (flag) { //添加市级
          allowedFeatures.push(cityFeature);
          allowedAttrs.push(getAttr(cityFeature));
          continue;
        }
        // 添加县级
        allowedFeatures = allowedFeatures.concat(allowedFeatures2);
        allowedAttrs = allowedAttrs.concat(allowedAttrs2);
      }
    }

    defer.resolve(allowedFeatures, allowedAttrs);

    console.timeEnd('intersects'); // Debug

    return defer.promise();
  },
  /**
   * 获取绘制层样式
   * @return {Object}   样式
   */
  getDrawStyle: function() {
    var signalLevel = $('#signal-level').find('.active').val(),
      fillColor = this.getAlertColor(signalLevel),
      strokeColor = this.Produce.getAlertColor(signalLevel);
    return $.extend({}, this.drawStyle, {
      strokeColor: strokeColor,
      fillColor: fillColor
    });
  },
  /**
   * 激活Pan
   */
  startDragMap: function() {
    var map = GDYB.mapUtil.map;
    for (var i = 0; i < map.events.listeners.mousemove.length; i++) {
      var handler = map.events.listeners.mousemove[i];
      if (handler.obj.CLASS_NAME == 'WeatherMap.Handler.Drag') {
        handler.obj.active = true;
      }
    }
    for (var i = 0; i < map.controls.length; i++) {
      if (map.controls[i].displayClass == 'smControlDrawFeature') {
        map.controls[i].deactivate();
      }
    }
  },
  /**
   * 注销Pan
   */
  stopDragMap: function() {
    var map = GDYB.mapUtil.map;
    for (var i = 0; i < map.events.listeners.mousemove.length; i++) {
      var handler = map.events.listeners.mousemove[i];
      if (handler.obj.CLASS_NAME == 'WeatherMap.Handler.Drag') {
        handler.obj.active = false;
      }
    }
  },
  /**
   * 获取预警颜色（有偏移）
   * @param  {String}   level  信号级别
   * @return {String}          HEX
   */
  getAlertColor: function(level) {
    switch (level) {
      case '蓝色':
        return '#1565C0';
      case '黄色':
        return '#FFEB3B';
      case '橙色':
        return '#ff9f07';
      case '红色':
        return '#E91E63';
    }
  },

  /**
   * 加载预警信号数据
   * 显示到地图和表格
   */
  loadData: function() {
    var me = this;
    // 查询最近预警 20条
    var startTime = moment().subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss');
    var endTime = moment().format('YYYY-MM-DD HH:mm:ss');
    this.queryAlertSignalFrom3Part(startTime, endTime).done(function(data1) {
      var d = me.dealData4Demo(data1);
      //过滤用户区域范围数据信息
      var data = [];
      if (me.departCode.length == 2) {
        data = d;
      } else if (me.departCode.length == 4) {
        for (var index in me.departRangeArr) {
          var areaCode = me.departRangeArr[index].code.toString();
          for (var i in d) {
            var areaCodeEle = d[i].areaCode != null ? d[i].areaCode.substr(0, 4) : d[i].alertId.substr(0, 4);
            if (areaCodeEle == areaCode) {
              data.push(d[i]);
            }
          }
        }
      } else {
        for (var index in me.departRangeArr) {
          var areaCode = me.departRangeArr[index].code.toString();
          for (var i in d) {
            var areaCodeEle = d[i].areaCode != null ? d[i].areaCode.substr(0, 4) : d[i].alertId.substr(0, 4);
            if (areaCodeEle == areaCode) {
              data.push(d[i]);
            }
          }
        }
      }
      if (!T.isPretty(data)) {
        me.initGrid([]);
      } else {
        // 按时间倒序
        data = data.sort((a, b) => {
          return moment(b.issueTime) - moment(a.issueTime);
        });

        me.initGrid(data);
        var size = data.length;
        // 时间正序添加
        for (var i = data.length; i--;) {
          me.addMarker(data[i], size - i - 1);
        }

        // 动画添加至最新预警
        me.addAnimator(data[0], 0);
        setTimeout(function() {
          me.animatorLayer.animator.start();
        }, 1000);
      }
    });
  },
  getGeoByAreaCode: function(areaCode) {
    if (areaCode == '62') areaCode = '6201'; // 省局从兰州
    var areas = this._Areas_;
    for (var i = 0, l = areas.length; i < l; i++) {
      var area = areas[i],
        {
          NAME,
          CODE
        } = area.attributes,
        {
          x,
          y
        } = area.geometry.getCentroid();

      if (new RegExp(areaCode).test(CODE)) {
        return {
          latitude: y,
          longitude: x,
          areaName: NAME,
          areaCode: CODE,
          stationId: CODE
        }
      }
    }
    return {}
  },
  dealData4Demo: function(data) {
    var me = this;
    var results = [];
    data.forEach(item => {
      var stat = item['stat']; // 测试状态
      if (/test/i.test(stat)) return;

      var title = item['headline'];
      var org = item['sender'];
      var city = org.replace(/气象台|中心|气象局/, '');
      var areaName = city.replace(/省|市|县/, '');

      var issueTime = moment(new Date(item['sendTime'])).format('YYYY-MM-DD HH:mm:ss');
      var issueContent = item['descript'];

      var signalLevel = title.split('预警')[0].slice(-2);
      var signalType = title.substring(title.indexOf(org) + org.length + 2, title.indexOf(signalLevel));
      // 获取地理信息
      var senderCode = item['senderCode'];
      var areaCode = senderCode.slice(0, 6);
      if (areaCode.endsWith('0000')) areaCode = areaCode.slice(0, 2);
      else if (areaCode.endsWith('00')) areaCode = areaCode.slice(0, 4);

      results.push(Object.assign({
        alertId: senderCode,
        alertPID: senderCode,
        changes: 0,
        province: '甘肃',
        city,
        underWriter: item['senderName'],
        issueTime,
        issueContent,
        signalLevel,
        signalType
      }, me.getGeoByAreaCode(areaCode), {
        stationName: areaName
      }))
    });

    return results
  },
  // 查询预警信号
  queryAlertSignalGeo: function(para) {
    return $.post(this.CONST.service + 'queryAlertSignalGeo', T.paramize(para));
  },
  /**
   * 获取第三方预警信号
   * @param para
   */
  queryAlertSignalFrom3Part: function(startTime, endTime) {
    return $.post(gsDataService + 'services/DBService/getSignalGtDataByTimes', T.paramize({
      startTime,
      endTime
    }))
  },
  /**
   * 加载区划信息
   * @author rexer
   * @date   2017-04-20
   * @param  {String}   areaCode 区域代码
   * @param  {String}   level    行政级别(省,市,县): `prvn`,`cty`,`cnty`
   * @return {Promise}
   */
  downAreas: function(areaCode, level) {
    var defer = $.Deferred();
    var url = gridServiceUrl + 'services/AdminDivisionService/getDivisionInfos';
    $.post(url, T.paramize({ areaCode: areaCode, level: level })).done(function(data) {
      if (!T.isPretty(data)) {
        defer.reject(new Error('行政区划数据有误'));
      }
      var areas = [];
      data.forEach(function(item) {
        var obj = JSON.parse(item);
        var feature = GDYB.FeatureUtilityClass.getFeatureFromJson(obj);
        feature.geometry.calculateBounds();
        areas.push(feature);
      });
      defer.resolve(areas);
    }).fail(function(a, b, c) {
      defer.reject(new Error(`获取行政区划边界失败 ${c}`));
    });

    return defer.promise();
  },

  //加载登录用户区域范围
  loadAreaRangeData: function() {
    var self = this;
    self.departRangeArr = [];
    // FIXME #界面改版,临时修改
    // var url = dsHost+":8080/gdyb/data/areaRange.json";
    var url = 'data/areaRange.json';
    $.post(url, null, 'getJSON').done(function(datas) {
      if (!datas) {
        defer.reject(new Error('用户区域范围数据有误'));
        return;
      }
      if (self.departCode.length == 2)
        return;
      var departCodeSub = self.departCode.length == 4 ? self.departCode : self.departCodes.substr(0, 4);
      if (datas != null) {
        for (var i in datas) {
          if (datas[i].code == departCodeSub) {
            var areas = datas[i].area;
            for (var a in areas) {
              self.departRangeArr.push(areas[a]);
            }
            break;
          }
        }
      }
    }).fail(function(a, b, c) {
      defer.reject(new Error(`获取用户区域范围失败 ${c}`));
    });
  }
});
