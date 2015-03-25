;(function (win, wylib) {

    "use strict";

    var UA = win.navigator.userAgent;
    var DOC = win.document;
    // var IMGHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC";

    var Utils = {
            // 获取懒元素的矩阵坐标信息
            getElemRect: function (elem, param) {
                if (!elem) return;
                if (!param) {
                    param = {x:0, y:0};
                }

                var t, r, b, l;

                if (elem != win) {
                    var rect = elem.getBoundingClientRect();

                    l = rect.left;
                    t = rect.top;
                    r = rect.right;
                    b = rect.bottom;

                } else {
                    // 容器为window对象
                    l = 0;
                    t = 0;
                    // r = l + elem.offsetWidth;
                    // b = t + elem.offsetHeight;
                    if (Utils.isIE() && Utils.lteIE(8)) {
                        // 兼容IE8及以上
                        r = l + DOC.documentElement.clientWidth ;
                        b = t + DOC.documentElement.clientHeight;
                    } else {
                        r = l + elem.innerWidth;
                        b = t + elem.innerHeight;
                    }
                }

                return {
                    'left': l,
                    'top': t,
                    'right': r + param.x,
                    'bottom': b + param.y
                };
            },
            addEvent: function (obj, type, handler) {
                console.log('addEvent',handler)
                if (window.addEventListener) {
                    obj.addEventListener(type, handler, false);
                } else {
                    // obj.attachEvent('on'+type, handler);

                    // 兼容不支持addEventListener+handleEvent的IE
                    if(typeof handler == 'object' && handler.handleEvent) {
                        obj.attachEvent('on' + type, function(){
                            handler.handleEvent.call(handler);
                        });
                    } else {
                        obj.attachEvent('on' + type, handler);
                    }
                }
            },
            removeEvent: function (obj, type, handler) {
                if (window.addEventListener) {
                    obj.removeEventListener(type, handler, false);
                } else {
                    obj.detachEvent('on'+type, handler);
                }
            },

            removeClass: function (elem, cls) {
                var elemClasses = elem.className,
                    clsReg;

                if (elemClasses.indexOf(' '+ cls) >= 0) {
                    clsReg = new RegExp(' '+cls);
                } else if (elemClasses.indexOf(cls +' ') >= 0) {
                    clsReg = new RegExp(cls+' ');
                }
                
                elem.className = elemClasses.replace(clsReg, '');
            },
            
            // 是否重叠：e2 是否和 e1 的区域有重叠部分。
            // 用来判断懒元素是否在视区
            isOverlap: function (e1, e2) {
                var x = e2.right > e1.left && e2.left < e1.right,
                    y = e2.bottom > e1.top && e2.top < e1.bottom;
                return x && y;
            },
            // 提取数组的非null元素
            filter: function (arr) {
                if (Array.prototype.filter) {
                    return arr.filter(function(item){
                        return !!item;
                    });
                } else {
                    var arr2 = [];
                    for (var i = 0, len = arr.length; i < len; i++) {
                        if (arr[i]) arr2.push(arr[i]);
                    }
                    return arr2;
                }                
            },
            // 对象扩展的简易方法
            extend: function (target, source) {
                for (var key in source) {
                    target[key] = source[key];
                }
                return target;
            },
            // 字面量对象的判断
            isPlainObject: function (obj) {
                return typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
            },
            isIE: function (x) {
                var ie_reg = /Trident/;

                if (x !== undefined) {
                    // is IE x
                    var isIE = this.isIE,
                        docMode = document.documentMode;

                    return isIE && ( docMode === undefined || docMode === x );

                } else {
                    // is IE
                    return ie_reg.test( UA );
                }
            },
            lteIE: function (x) {
                var isIE = this.isIE,
                    docMode = document.documentMode;

                return isIE && ( docMode === undefined || docMode <= x );
            }
        };
        
    /*
        属性配置项说明：
        bufferHeight:   Number,     预加载视区以下 bufferHeight 内的图片（上下滑动/滚动）
        bufferWidth:    Number,     预加载视区右侧 bufferWidth 内的图片（左右滑动/滚动）
        lazyOnce:       Boolean,    元素加载成功即清除事件, 默认true
        clazz:          String,     懒元素的class
        visualWindow:   Object,     相对容器的可视区域，默认为浏览器[window对象]
        loadComplete:   Function,   图片加载完成触发的回调
        loadError:      Function,   图片加载失败触发的回调
    */

    function Lazyload(elem, options) {
        // 对入参的兼容处理
        if (arguments.length < 1) {
            elem = win;
        } else if (Utils.isPlainObject(elem)) {
            options = elem;
            elem = win;
        }

        var container = typeof elem === 'string' ? DOC.querySelector(elem) : elem;

        if (!container) return;
        this.container = container;            

        // 默认配置选项
        var settings = {
                bufferHeight: 400,
                bufferWidth: 0,
                lazyOnce: true,
                clazz: 'be-lazy',
                visualWindow: win
            };

        options = options || {};
        this.options = Utils.extend(settings, options);

        console.log('配置项', this.options);

        // 初始化运行
        this.init();
    }

    Utils.extend(Lazyload.prototype, {
        init: function () {
            // 物理像素和设备独立像素比，根据像素比来确定加载何种规格的图片
            // var devicePixelRatio = win.devicePixelRatio;

            // 绑定触发加载事件
            this.bindEvent();
            // 获取页面初始渲染完成时容器(container)内的懒元素
            // 对于滚动加载进来的新元素，可调用getLazyItems方法重新查找懒元素，再加载之。 
            this.getLazyItems();

            // 懒元素是否在视区内
            this.careItems();
        },

        handleEvent: function (e) {
            e = e || window.event;
            var type = e.type;
            if (type === 'scroll') {
                console.log('scrolling')
                this.careItems();
            }
        },

        getOption: function (key) {
            return key ? this.options[key] : null;
        },

        getLazyItems: function () {
            var container = this.container;
            container = container === win ? DOC : container;
            var items = container.querySelectorAll( '.' + this.getOption('clazz') );

            // 将NodeList转换为字面量数组
            var arr = [];
            for (var i = 0, len = items.length; i < len; i++) {
                arr.push(items[i]);
            }
            this.lazyItems = arr;

            console.log('getLazyItems',arr.length);

            // console.log('懒元素', this.lazyItems, items);
        },

        bindEvent: function () {
            Utils.addEvent(this.getOption('visualWindow'), 'scroll', this);
            //TODO: scroll 事件触发加载太频繁，移动端可以优化触发事件，利用 touchstart, touchent 事件来触发加载
        },

        destroy: function () {
            Utils.removeEvent(this.getOption('visualWindow'), 'scroll', this);
        },

        careItems: function () {
            var self = this;
            var container = this.container;
            var items = this.lazyItems;

            var param = {
                    x: this.getOption('bufferWidth'),
                    y: this.getOption('bufferHeight')
                },
                len = items.length;
            var getElemRect = Utils.getElemRect;

            console.log('懒元素', items)

            // 未加载的懒元素
            var filterItems = Utils.filter(this.lazyItems);

            if (filterItems && filterItems.length) {

                for (var i = 0; i < len; i++) {
                    // 若未加载的懒元素正处于视区
                    if (items[i]) {
                        if ( Utils.isOverlap(getElemRect(self.getOption('visualWindow'), param), getElemRect(items[i])) ) {
                            self.fetchItem(items[i], i);
                        }
                    }
                }

            } else if (self.getOption('lazyOnce')) {
                // 所有懒元素处理完成，清除触发事件
                console.log('destroy')
                self.destroy();
            }
        },

        fetchItem: function (item, i) {
            var self = this;
            var imgsrc = item.getAttribute('data-src');

            if (!imgsrc) return;
            item.src = imgsrc;

            // 绑定加载完成的事件
            if (!item.onload) {
                item.onload = function () {
                    self.removeItemAttr(item, i);
                    if (self.getOption('loadComplete')) {
                        self.getOption('loadComplete').call(item);
                    }
                };
                item.onerror = function () {
                    self.removeItemAttr(item, i);
                    if (self.getOption('loadError')) {
                        self.getOption('loadError').call(item);
                    }
                };
            }
        },
        removeItemAttr: function (item, i) {
            // 元素加载完成，移除选择符及事件
            Utils.removeClass(item, this.getOption('clazz'));
            item.onload = item.onerror = null;

            // 移除该懒元素
            this.lazyItems[i] = null;
        }
    });

    wylib.lazyload = function (elem, options) {
        return new Lazyload(elem, options);
    };

})(window, window["wylib"] || (window["wylib"] = {}));