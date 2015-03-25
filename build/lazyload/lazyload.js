!function(t,e){"use strict";function n(e,n){arguments.length<1?e=t:r.isPlainObject(e)&&(n=e,e=t);var o="string"==typeof e?i.querySelector(e):e;if(o){this.container=o;var l={bufferHeight:400,bufferWidth:0,lazyOnce:!0,clazz:"be-lazy",visualWindow:t};n=n||{},this.options=r.extend(l,n),console.log("配置项",this.options),this.init()}}var o=t.navigator.userAgent,i=t.document,r={getElemRect:function(e,n){if(e){n||(n={x:0,y:0});var o,l,s,a;if(e!=t){var c=e.getBoundingClientRect();a=c.left,o=c.top,l=c.right,s=c.bottom}else a=0,o=0,r.isIE()&&r.lteIE(8)?(l=a+i.documentElement.clientWidth,s=o+i.documentElement.clientHeight):(l=a+e.innerWidth,s=o+e.innerHeight);return{left:a,top:o,right:l+n.x,bottom:s+n.y}}},addEvent:function(t,e,n){console.log("addEvent",n),window.addEventListener?t.addEventListener(e,n,!1):"object"==typeof n&&n.handleEvent?t.attachEvent("on"+e,function(){n.handleEvent.call(n)}):t.attachEvent("on"+e,n)},removeEvent:function(t,e,n){window.addEventListener?t.removeEventListener(e,n,!1):t.detachEvent("on"+e,n)},removeClass:function(t,e){var n,o=t.className;o.indexOf(" "+e)>=0?n=new RegExp(" "+e):o.indexOf(e+" ")>=0&&(n=new RegExp(e+" ")),t.className=o.replace(n,"")},isOverlap:function(t,e){var n=e.right>t.left&&e.left<t.right,o=e.bottom>t.top&&e.top<t.bottom;return n&&o},filter:function(t){if(Array.prototype.filter)return t.filter(function(t){return!!t});for(var e=[],n=0,o=t.length;o>n;n++)t[n]&&e.push(t[n]);return e},extend:function(t,e){for(var n in e)t[n]=e[n];return t},isPlainObject:function(t){return"object"==typeof t&&Object.getPrototypeOf(t)===Object.prototype},isIE:function(t){var e=/Trident/;if(void 0!==t){var n=this.isIE,i=document.documentMode;return n&&(void 0===i||i===t)}return e.test(o)},lteIE:function(t){var e=this.isIE,n=document.documentMode;return e&&(void 0===n||t>=n)}};r.extend(n.prototype,{init:function(){this.bindEvent(),this.getLazyItems(),this.careItems()},handleEvent:function(t){t=t||window.event;var e=t.type;"scroll"===e&&(console.log("scrolling"),this.careItems())},getOption:function(t){return t?this.options[t]:null},getLazyItems:function(){var e=this.container;e=e===t?i:e;for(var n=e.querySelectorAll("."+this.getOption("clazz")),o=[],r=0,l=n.length;l>r;r++)o.push(n[r]);this.lazyItems=o,console.log("getLazyItems",o.length)},bindEvent:function(){r.addEvent(this.getOption("visualWindow"),"scroll",this)},destroy:function(){r.removeEvent(this.getOption("visualWindow"),"scroll",this)},careItems:function(){var t=this,e=(this.container,this.lazyItems),n={x:this.getOption("bufferWidth"),y:this.getOption("bufferHeight")},o=e.length,i=r.getElemRect;console.log("懒元素",e);var l=r.filter(this.lazyItems);if(l&&l.length)for(var s=0;o>s;s++)e[s]&&r.isOverlap(i(t.getOption("visualWindow"),n),i(e[s]))&&t.fetchItem(e[s],s);else t.getOption("lazyOnce")&&(console.log("destroy"),t.destroy())},fetchItem:function(t,e){var n=this,o=t.getAttribute("data-src");o&&(t.src=o,t.onload||(t.onload=function(){n.removeItemAttr(t,e),n.getOption("loadComplete")&&n.getOption("loadComplete").call(t)},t.onerror=function(){n.removeItemAttr(t,e),n.getOption("loadError")&&n.getOption("loadError").call(t)}))},removeItemAttr:function(t,e){r.removeClass(t,this.getOption("clazz")),t.onload=t.onerror=null,this.lazyItems[e]=null}}),e.lazyload=function(t,e){return new n(t,e)}}(window,window.wylib||(window.wylib={}));