function YBZZPageClass() {
  this._init_();
}

YBZZPageClass.prototype = {
  _init_: function () {
    this.name = "预报制作";
    //天气综述DOM结构
    this.weartherSummarizeHtml = `
      <div class="zongshu">
        <div id="main_left">
          <div class="today_work">
            <p>今天工作</p>
            <div id="today_work_list">
              <ul>
  
                <li>
                  <p class="work_title">广播预报(05时05分)</p>
                  <span class="work_time"><i class="iconfont icon-shijian"></i>制作时间:06:30</span>
                  <span class="work_person"><i class="iconfont icon-renyuan"></i>制作人:彭某某</span>
                  <span class="isComplete"><i class="iconfont icon-wancheng"></i>已完成</span>
                </li>
  
                <li>
                  <p class="work_title">广播预报(05时05分)</p>
                  <span class="work_time"><i class="iconfont icon-shijian"></i>制作时间:06:30</span>
                  <span class="work_person"><i class="iconfont icon-renyuan"></i>制作人:彭某某</span>
                </li>
  
                <li>
                  <p class="work_title">广播预报(05时05分)</p>
                  <span class="work_time"><i class="iconfont icon-shijian"></i>制作时间:06:30</span>
                  <span class="work_person"><i class="iconfont icon-renyuan"></i>制作人:彭某某</span>
                  <span class="isComplete"><i class="iconfont icon-wancheng"></i>已完成</span>
                </li>
  
                <li>
                  <p class="work_title">广播预报(05时05分)</p>
                  <span class="work_time"><i class="iconfont icon-shijian"></i>制作时间:06:30</span>
                  <span class="work_person"><i class="iconfont icon-renyuan"></i>制作人:彭某某</span>
                </li>
  
                <li>
                  <p class="work_title">广播预报(05时05分)</p>
                  <span class="work_time"><i class="iconfont icon-shijian"></i>制作时间:06:30</span>
                  <span class="work_person"><i class="iconfont icon-renyuan"></i>制作人:彭某某</span>
                  <span class="isComplete"><i class="iconfont icon-wancheng"></i>已完成</span>
                </li>
  
              </ul>
            </div>
  
          </div>
          <div class="history_msg">
            <dl>
              <dt>历史预报</dt>
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
              <dd>
                <span>每日天气综述2017/12/19 下午9:50:13</span>
                <a href="#">导入</a>
              </dd>
  
            </dl>
  
          </div>
        </div>
        <div id="main_middle">
          <div class="summarize_content">
            <div class="sumarize_header">
              <p>每日天气综述</p>
              <p><span id="nowTime">here is time</span> 预报员:某某某</p>
            </div>
            <div class="summarize_body">
              <div class="weather_review">
                <h5>一、近期天气回顾</h5>
                <p contenteditable="true">昨天北中部多云间晴天，南部多云转阴天，部分地区有小雪。</p>
              </div>
              <div class="weather_trend">
                <h5>二、近期天气趋势</h5>
                <p contenteditable="true">今天  低层渐转高压环流后部偏南气流，全省多云转阴，内陆各城市有阵雨，局部逐渐有中雨</p>
                <p contenteditable="true">7日 低层渐转高压环流后部偏南气流，全省多云转阴，内西部地区东部地区靠山地区陆各城市有阵雨，局部有中雨</p>
                <p contenteditable="true">8日 低层渐转高压环流后部偏南气流，全省多云转阴，内陆各城市有阵雨，局部逐渐有中雨</p>
                <p contenteditable="true">9日 低层渐转高压环流后部偏南气流，全省多云转阴，内陆明天下午夜里各城市有阵雨，局部有中雨</p>
              </div>
              <div class="weather_vista">
                <h5>三、未来天气展望</h5>
                <p contenteditable="true">10日 全省多云，南部部分地区有轻雾。</p>
                <p contenteditable="true">11日 全省多云，中南部部分地区有轻雾或雾，局部地区有大雾</p>
                <p contenteditable="true">12-13日 全省多云转晴天，有4-5级、短时6级西北风。</p>
                <p contenteditable="true">14-15日 全省晴天间多云。</p>
              </div>
              <div class="weather_keyPoint">
                <h5>四、关注重点</h5>
                <p contenteditable="true">10日 南部的雨雪天气对春运的不利影响。</p>
              
              </div>
              <div class="summarize_sign">
                <h5 class="summarize_sign_name">兰州气象台</h5>
                <p class="summarize_sign_time" contenteditable="true">2017-10-10 08时</p>
              </div>
            </div>
  
          </div>
          <div class="submit_exportDoc">
            <button class="submit">提交</button>
            <button class="exportDoc">生成word文档</button>
          </div>
        </div>
        <dl id="main_right">
          <dt>预报用语库</dt>
          <dd id="wordsList">
            <dl class="changyongyu">
              <dt>— — 常用语 — —</dt>
              <dd>
                <button>~</button>
              </dd>
  
              <dd>
                <button>%</button>
              </dd>
  
              <dd>
                <button>-</button>
              </dd>
  
              <dd>
                <button>，</button>
              </dd>
  
              <dd>
                <button>。</button>
              </dd>
  
              <dd>
                <button>、</button>
              </dd>
  
              <dd>
                <button>：</button>
              </dd>
  
              <dd>
                <button>；</button>
              </dd>
  
              <dd>
                <button>“</button>
              </dd>
  
              <dd>
                <button>”</button>
              </dd>
  
              <dd>
                <button>有</button>
              </dd>
  
              <dd>
                <button>有时有</button>
              </dd>
  
              <dd>
                <button>或</button>
              </dd>
  
              <dd>
                <button>转</button>
              </dd>
  
              <dd>
                <button>起</button>
              </dd>
  
              <dd>
                <button>的</button>
              </dd>
  
              <dd>
                <button>和</button>
              </dd>
  
              <dd>
                <button>并</button>
              </dd>
  
              <dd>
                <button>逐渐</button>
              </dd>
  
              <dd>
                <button>继续</button>
              </dd>
  
              <dd>
                <button>增强</button>
              </dd>
  
              <dd>
                <button>到</button>
              </dd>
  
            </dl>
            <dl class="tianqi">
              <dt>— — 天气 — —</dt>
              <dd>
                <button>晴</button>
              </dd>
  
              <dd>
                <button>晴转多云</button>
              </dd>
  
              <dd>
                <button>晴到少云</button>
              </dd>
  
              <dd>
                <button>少云</button>
              </dd>
  
              <dd>
                <button>少云到多云</button>
              </dd>
  
              <dd>
                <button>多云到阴</button>
              </dd>
  
              <dd>
                <button>多云转阴</button>
              </dd>
  
              <dd>
                <button>阴</button>
              </dd>
  
              <dd>
                <button>阴到多云</button>
              </dd>
  
              <dd>
                <button>阴转多云</button>
              </dd>
  
            </dl>
            <dl class="wu">
              <dt>— — 雾 — —</dt>
              <dd>
                <button>夜晨有雾</button>
              </dd>
  
              <dd>
                <button>轻雾</button>
              </dd>
  
              <dd>
                <button>雾</button>
              </dd>
  
              <dd>
                <button>浓雾</button>
              </dd>
  
            </dl>
            <dl class="fangwei">
              <dt>— — 方位 — —</dt>
              <dd>
                <button>前后</button>
              </dd>
  
              <dd>
                <button>左右</button>
              </dd>
  
              <dd>
                <button>市区</button>
              </dd>
            </dl>
            <dl class="shanqu">
              <dt>— — 山区 — —</dt>
              <dd>
                <button>局部山区</button>
              </dd>
  
              <dd>
                <button>靠山地区</button>
              </dd>
  
              <dd>
                <button>北部地区</button>
              </dd>
  
              <dd>
                <button>东部地区</button>
              </dd>
  
              <dd>
                <button>南部地区</button>
              </dd>
  
              <dd>
                <button>西部地区</button>
              </dd>
  
              <dd>
                <button>部分地区</button>
              </dd>
  
            </dl>
            <dl class="shiduan">
              <dt>— — 时段 — —</dt>
              <dd>
                <button>午后</button>
              </dd>
  
              <dd>
                <button>明天</button>
              </dd>
  
              <dd>
                <button>上午</button>
              </dd>
  
              <dd>
                <button>中午</button>
              </dd>
  
              <dd>
                <button>下午</button>
              </dd>
  
              <dd>
                <button>傍晚</button>
              </dd>
  
              <dd>
                <button>夜里</button>
              </dd>
  
              <dd>
                <button>上半夜</button>
              </dd>
  
              <dd>
                <button>下半夜</button>
              </dd>
  
              <dd>
                <button>半夜后</button>
              </dd>
  
              <dd>
                <button>明晨</button>
              </dd>
  
              <dd>
                <button>夜晨</button>
              </dd>
  
              <dd>
                <button>短暂</button>
              </dd>
  
            </dl>
            <dl class="yu">
              <dt>— — 雨 — —</dt>
              <dd>
                <button>阵雨</button>
              </dd>
  
              <dd>
                <button>雷阵雨</button>
              </dd>
  
              <dd>
                <button>或</button>
              </dd>
  
              <dd>
                <button>下雨</button>
              </dd>
  
              <dd>
                <button>小阵雨</button>
              </dd>
  
              <dd>
                <button>小到中雨</button>
              </dd>
  
              <dd>
                <button>小到中阵雨</button>
              </dd>
  
              <dd>
                <button>中雨</button>
              </dd>
  
              <dd>
                <button>中阵雨</button>
              </dd>
  
              <dd>
                <button>中到大阵雨</button>
              </dd>
  
              <dd>
                <button>大雨</button>
              </dd>
  
              <dd>
                <button>大到暴雨</button>
              </dd>
  
              <dd>
                <button>暴雨</button>
              </dd>
  
              <dd>
                <button>暴雨到大暴雨</button>
              </dd>
  
              <dd>
                <button>大暴雨到特到暴雨</button>
              </dd>
  
              <dd>
                <button>特大暴雨</button>
              </dd>
  
            </dl>
          </dd>
  
        </dl>
      </div>`;

    //污染质量DOM结构
    this.polluteForecastHtml = `
      <div class="wuran">
        <textarea>污染质量预报污染质量预报污染质量预报污染质量预报污染质量预报</textarea>
        <div class="picForecast">
         <img src="" alt="">
        </div>
      </div>`;
    //专题预报DOM结构
    this.projectForecastHtml = `<div class="zhuanti">
        <textarea>专题预报专题预报专题预报专题预报专题预报专题预报</textarea>
        <div class="picForecast">
         <img src="" alt="">
        </div>
      </div>`;
    //会商支撑
    this.consultationHtml = `<div class="huishang">
        <textarea>会商支撑会商支撑会商支撑会商支撑会商支撑</textarea>
        <div class="picForecast">
         <img src="" alt="">
        </div>
      </div>`;
  },
  renderMenu() {
    let html = `<div class="ybzzpage">
    <div class="ybzz_left" id="ybzz_left">
     
    </div>
    <div class="ybzz_right" >
      <div class="ybzz_type" id="ybzz_type">
        <button class="active">产品制作</button>
        <button>预报竞赛</button>
      </div>
      <div class="ybzz_type_con ybzz_product" id="ybzz_product">
        <button class="active">天气综述</button>
        <button>污染质量预报</button>
        <button>专题预报</button>
        <button>会商支撑</button>
      </div>
      <div class="ybzz_type_con ybzz_competition" id="ybzz_competition">
       <button>城镇预报</button>
       <button>灾害落区</button>
      </div>
    </div>
  </div>`;
    $("#content").append(html);
    $("#ybzz_left").html(this.weartherSummarizeHtml);
    this.summarizeEdit();
  },
  initEvent() {

      $("#nowTime").html((new MyDate()).format("yyyy年MM月dd日"));
    let _this = this;
    //ybzz_type 点击预报类型
    $("#ybzz_type>button").on("click", function () {
      $(this).siblings().removeClass("active").end().addClass("active");
      let index = $(this).index();
      $(".ybzz_type_con").hide().eq(index).show();

      //左边部分内容
      if (index == 0) {
        $("#ybzz_left").show()
      }
      else if (index == 1) {
        $("#ybzz_left").hide();
      }
    });


    //ybzz_product 选择产品制作
    $("#ybzz_product button").on("click", function () {
      $(this).siblings().removeClass("active").end().addClass("active");
      let index = $(this).index();
      console.log(index);

      if (index == 0) {
        $("#ybzz_left").html(_this.weartherSummarizeHtml);
        _this.summarizeEdit();
        console.log(this.weartherSummarizeHtml)
      }
      else if (index == 1) {
        $("#ybzz_left").html(_this.polluteForecastHtml);
      }
      else if (index == 2) {
        $("#ybzz_left").html(_this.projectForecastHtml);
      }
      else if (index == 3) {
        $("#ybzz_left").html(_this.consultationHtml);
      }
    });
  },
  //天气综述中的插值,需要在添加DOM结构后后调用
  summarizeEdit() {
    $(".summarize_body p").each(function () {
      $(this).attr("contenteditable", true);
    });
    let inputP;
    $(".summarize_body p").click(function (e) {
      inputP = this;

    });
    $("#wordsList button").click(function () {
      let addTxt = $(this).text();
      pasteHtmlAtCaret(inputP, addTxt);
    })

    function pasteHtmlAtCaret(el, html) {
      el.focus();
      var sel, range;
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();

          // Range.createContextualFragment() would be useful here but is
          // only relatively recently standardized and is not supported in
          // some browsers (IE9, for one)
          var el = document.createElement("div");
          el.innerHTML = html;
          var frag = document.createDocumentFragment(),
            node, lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);

          // Preserve the selection
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
      }
    }

  }
}
