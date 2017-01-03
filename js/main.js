$(function () {
    //副导航条效果
    $('.nav > li > a').mouseover(function () {
        $(".baidai").hide();
        $(".sub-nav").hide();
        var li = $(this).parent();
        if (li.find('ul').length > 0) {
            $(".baidai").show();
            li.find("ul").show();
        }
    });


    $(".sub-nav").hover(function () {

    }, function () {
        setTimeout(function () {
            $(".baidai").hide();
            $(".sub-nav").hide();
        }, 1000)
        return false;
    });

    //阴影信息
    $(".box-100,.box-75").hover(function () {
        var shaInfo = $(this).find('.shadow-info');
        if (shaInfo.length > 0) {
            shaInfo.show();
        }

        $(this).find('.box-info').hide();
    }, function () {
        $(this).find('.shadow-info').hide();
        $(this).find('.box-info').show();
    });

    //图片旋转
    $(".circle-img").hover(function (e) {
        var i = 1;
        var dom = $(this);
        this.setI = setInterval(function () {
            if (i >= 360) {
                i = 0;
            }
            var str = i + "deg";
            dom.css({
                "transform": "rotate(" + str + ")",
                "-ms-transform": "rotate(" + str + ")",
                "-moz-transform": "rotate(" + str + ")",
                "-webkit-transform": "rotate(" + str + ")",
                "-o-transform": "rotate(" + str + ")"
            });
            i += 10;
        }, 100);

    }, function (e) {
        clearInterval(this.setI);
        $(this).css({
            "transform": "rotate(0deg)",
            "-ms-transform": "rotate(0deg)",
            "-moz-transform": "rotate(0deg)",
            "-webkit-transform": "rotate(0deg)",
            "-o-transform": "rotate(0deg)"
        });
    });


    // tabs
    tab("tabs-1", "tabs-wrap-1", 'click');
    tab("tabs-2", "tabs-wrap-2", 'click');
    tab("tabs-3", "tabs-wrap-3", 'mouseenter');
    tab("tabs-4", "tabs-wrap-4", 'click');
    tab("tabs-5", "tabs-wrap-5", 'click');
    tab("tabs-icon", "tabs-wrap-icon", 'icon');
    $("#tabs-1").children().eq(0).trigger("click");
    $("#tabs-2").children().eq(0).trigger("click");
    $("#tabs-3").children().eq(0).trigger("mouseenter");
    $("#tabs-4").children().eq(0).trigger("click");
    $("#tabs-5").children().eq(0).trigger("click");
    $("#tabs-icon").children().eq(0).trigger("click");


    //week 切换
    var num = getNumDateByWeek();
    var weekDom = $("#week").children().eq(num - 1);
    weekDom.find(".box-sub").addClass("box-sub-active");
    weekDom.find(".box-content").addClass("box-content-active");

    //换一批
    switchContent();

    // $(".switch").trigger('click');


    //goTop
    $(".go-top").css({
        "right": (window.innerWidth - 1200) / 2 - 70 + "px"
    });
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 300) {
            $(".go-top").fadeIn();
        } else {
            $(".go-top").fadeOut();
        }
    });

    $(".go-top").click(function (e) {
        var height = $(window).scrollTop();
        var inter = setInterval(function () {
            if (height <= 0) {
                clearInterval(inter);
            } else {
                height -= 50;
                $(window).scrollTop(height);
            }
        }, 10);

    });

    //幻灯片
    new slide({
        father: ".slide",
        showArrow: true
    }).Init();
    //搜索栏
    new Search().Init();
    //延迟加载
    new lazyLoad().Init();

});
//换一批函数
function switchContent() {
    var sw = $(".switch");
    var page = 0;
    var imgArr = ['img/1.jpg','img/2.jpeg','img/3.png','img/4.jpg','img/5.jpeg','img/6.jpg','img/7.jpg','img/8.jpg','img/9.jpeg']
    sw.click(function () {
        var swContent = $($(this).data('content'));
        var url = $(this).data('url');
        var count = $(this).data('count');
        $.get("http://localhost/js/json/test.json", function (text, statu) {
            if (statu) {
                // var text = JSON.parse(text);
                var str = "";
                for (var i = 0; i < text.length && i < count; i++) {
                    str += " <div class='fl guid-w-20 guid-h-4 pd-small'>";
                    str += "   <div class='box-75'>";
                    // str += "  <img src='" + text[i].img + "' alt='" + text[i].title + "'  class='img radius-small'>";
                    str += "  <img src='" + imgArr[Math.floor(Math.random()*imgArr.length)] + "' alt='" + text[i].title + "'  class='img radius-small'>";
                    str += "   </div>";
                    str += "    <p>" + text[i].title + "</p>";
                    str += "    <p>" + text[i].title + "</p>";
                    str += "    </div>";
                }
                swContent.html(str);
            }
        })

    })


};
//延迟加载类
function lazyLoad() {
    this.dom = $(".lazy");
    this.__window = $(window);
    this.Init = function () {
        // this.__event(this)();
        this.__scroll();
    };
    this.__scroll = function () {
        this.__window.scroll(this.__event(this));
    };

    this.__event = function (that) {
        return function () {
            if (that.dom.length <= 0) {
                return;
            }
            var currHeigh = that.__window.scrollTop() + that.__window.height();
            for (var i = 0; i < that.dom.length; i++) {
                var img = $(that.dom[i]);
                var heightTop = img.offset().top;
                if (heightTop <= currHeigh) {
                    var src = img.data('src');
                    img.attr("src", src);
                    img.hide();
                    img.fadeIn(1500);
                    that.dom.splice(i, 1);
                }
            }
        }
    }
}

//搜索栏类
function Search() {
    this.button = $('.search button');
    this.searchContentObj = $('.search-content');
    this.searchPrompt = $('.search-prompt');
    this.search = $('.search');
    this.searchHistory = this.search.find('.search-history');
    this.clearHistory = this.search.find('.clear-history');
    this.history = [];
    this.Init = function () {
        if (!window.localStorage) {
            return;
        }
        this.storage = window.localStorage;
        this.__drawDom();
        this.__submitClick();
        this.__clearClick();
        this.__fouce();
        this.__labelClick();

    };

    //fouce事件
    this.__fouce = function () {
        var that = this;
        this.searchContentObj.focus(function () {
            that.searchPrompt.fadeIn(100);
        }).blur(function () {
            that.searchPrompt.fadeOut(100);
        });
    };

    //labelClick事件
    this.__labelClick = function () {
        $('.label').on('click', function () {
            var content = $(this).text();
            console.log(content);
            //TODO
        })
    };

    //渲染弹出框
    this.__drawDom = function () {
        this.__getHistory();
        var len = this.history.length;
        if (len == 0) {
            this.searchHistory.parents('div').eq(0).hide();
            return;
        }
        this.searchHistory.parents('div').eq(0).show();
        var str = "";
        for (var i = len - 1; i >= 0; i--) {
            str += "<span class='label'>" + this.history[i] + "</span>";
        }
        this.searchHistory.html(str);
    };

    //清除历史点击事件
    this.__clearClick = function () {
        var that = this;
        this.clearHistory.click(function () {
            that.storage.clear();
            that.__drawDom();
        })
    };


    //提交事件
    this.__submitClick = function () {
        var that = this;
        this.button.click(function () {
            var content = that.searchContentObj.val();
            //TODO 内容验证
            that.__addHistory(content);
            that.__addStorage();
            that.__drawDom();  //重绘
        })
    };

    //添加进数组
    this.__addHistory = function (content) {
        var i = this.history.indexOf(content);
        if (i > -1) {
            this.history.splice(i, 1);
        }
        if (this.history.length >= 8) {
            this.history.shift();
        }
        this.history.push(content);
    };

    //添加进stroage
    this.__addStorage = function () {
        this.storage.setItem("searchHistory", JSON.stringify(this.history));
    };

    //取出stroage内数组
    this.__getHistory = function () {
        var str = this.storage.getItem("searchHistory");
        if (str == "" || str == null) {
            this.history = [];
        } else {
            this.history = JSON.parse(str);
        }
    }


}

// 获取一周第几天
function getNumDateByWeek() {
    var date = new Date();
    return date.getDay();
}

//tab 切换函数
function tab(fatherTabs, fatherTabsWrap, mode) {
    mode = mode || "click";
    function sw(e) {
        $(this).parent().find(className).removeClass(activeName);
        $(this).addClass(activeName);
        var nav = $(this).data('nav');

        var wrap = $("#" + fatherTabsWrap);
        wrap.children().hide();
        wrap.find("." + nav).fadeIn(500);
    }

    if (mode == 'click') {
        var className = ".tabs-a";
        var activeName = "tabs-a-active";
        $("#" + fatherTabs).children().click(sw);
    } else if (mode == "mouseenter") {
        var className = ".hover-tab";
        var activeName = "hover-tab-active";
        $("#" + fatherTabs).children().mouseenter(sw);
    } else if (mode == "icon") {
        var className = ".fa";
        var activeName = "active";
        $("#" + fatherTabs).children().click(sw);
    }

}


//幻灯片类
function slide(param) {
    this.slide = $(param.father);
    this.autoTime = param.autoTime ? param.pick : 3000;
    this.anmiteTime = param.animateTime ? param.animateTime : 500;
    this.mode = param.mode ? param.mode : 'scroll';
    this.len = this.slide.children().length;
    this.pl = parseInt(this.slide.find('li').css('paddingLeft'));
    this.pr = parseInt(this.slide.find('li').css('paddingRight'));
    this.width = parseInt(this.slide.find('img').width());
    this.moveWidth = this.pl + this.pr + this.width;


    this.Init = function () {
        // console.log(this);
        this.drawPick();
        this.pickClick(this);
        this.arrowClick(this);
        this.pick.children().eq(0).trigger('click');//模拟点击
        this.interval = setInterval(this._interFun(this), this.autoTime);
    };

    this._interFun = function (obj) {
        return function () {
            obj.pick.children().eq(obj._reckIndex('left')).trigger("click");
        }
    };

    this._getIndex = function () {
        var leftLength = parseInt(this.slide.css('left'));
        var index = leftLength / this.moveWidth;
        if (Math.floor(index) === index) {
            index = index == 0 ? 0 : index * -1;
            return index;
        }
    };

    this._reckIndex = function (arr) {
        var index = this._getIndex();
        if (arr == 'left') {
            if (index >= this.len - 1) {
                return 0;
            }
            return ++index;
        } else if (arr == 'right') {
            if (index <= 0) {
                return this.len - 1
            }
            return --index;
        }
    };

    this.drawPick = function () {
        this.slide.after("<p class='slide-title'></p><ul class='slide-pick'></ul><div class='slide-arrow slide-arrow-left'><i class='fa fa-chevron-left toLeft'></i></div><div class='slide-arrow slide-arrow-right '><i class='fa fa-chevron-right '></i></div>");
        this.title = $(".slide-title");
        this.pick = $(".slide-pick");
        this.arrow = $('.slide-arrow');

        var str = "";
        for (var i = 0; i < this.len; i++) {
            str += "<li></li>";
        }
        this.pick.html(str);

        if (param.showTitle === false) {
            this.title.hide();
        }

        if (param.showPick === false) {
            this.pick.hide();
        }
        if (param.showArrow === false) {
            this.arrow.hide();
            return;
        }

        //设置箭头行高及显示
        var that = this;
        this.arrow.css({
            "lineHeight": parseInt(this.arrow.parent().width() / 2) + "px"
        }).hover(function () {
            that.arrow.children().show();
        }, function () {
            that.arrow.children().hide();
        })

    };

    //
    this.pickClick = function (_obj) {
        this.pick.children().on('click', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            var _index = $(this).index();
            switch (_obj.mode) {
                case 'scroll':
                    _obj.__scroll(_index, _obj);
                    break;
                case 'fade':
                    _obj.__fade(_index, _obj);
                    break;
                default:
                    _obj.__scroll(_index, _obj);
            }

        });
    };

    //左右方向控制
    this.arrowClick = function (_obj) {
        this.arrow.children().click(function () {
            var direction = $(this).hasClass('toLeft') ? 'left' : 'right';
            var _index = _obj._reckIndex(direction);
            _obj.pick.children().eq(_index).trigger("click");
        });

    };

    //滚动
    this.__scroll = function (_index, _obj) {
        var toLeft = _index * _obj.moveWidth * -1;
        var title = _obj.slide.find('img').eq(_index).attr('alt');
        _obj.slide.animate({
            "left": toLeft + "px"
        }, _obj.anmiteTime, function () {
            _obj.title.text(title);
            window.clearInterval(_obj.interval);
            _obj.interval = setInterval(_obj._interFun(_obj), _obj.autoTime);
        });
    };

    //渐隐
    this.__fade = function (_index, _obj) {
        var toLeft = _index * _obj.moveWidth * -1;
        var title = _obj.slide.find('img').eq(_index).attr('alt');
        _obj.slide.children().eq(_index).hide();
        _obj.slide.css({
            "left": toLeft + "px"
        });
        _obj.slide.children().eq(_index).fadeIn(_obj.anmiteTime, function () {
            _obj.title.text(title);
            window.clearInterval(_obj.interval);
            _obj.interval = setInterval(_obj._interFun(_obj), _obj.autoTime);
        });
    }

};