#lazyload

页面元素懒加载组件。

支持指定容器内懒加载，不依赖Zepto等第三方js库。同时兼容PC和移动端，对于IE只支持IE8及以上。

* 版本：1.0.0
* 教程：
* DEMO：

TODO：移动端触发加载事件待优化。

###快速使用

    // 初始化组件实例并运行
    // 选择符必选，属性配置可选
    var lazyload = wylib.lazyload('#container', {
            bufferHeight:   Number,     预加载视区以下`bufferHeight`内的图片（上下滑动/滚动）
            bufferWidth:    Number,     预加载视区右侧`bufferWidth`内的图片（左右滑动/滚动）
            lazyOnce:       Boolean,    所有懒元素加载完成后清除触发事件，默认true。
                                        如果应用于无尽列表，则该选项应该设置为false，这样对新插入的懒元素，滚动屏幕仍可触发懒加载。
            clazz:          String,     懒元素的class
            visualWindow:   Object,     相对容器的可视区域，默认为浏览器[window对象]
            loadComplete:   Function,   图片加载完成触发的回调
            loadError:      Function,   图片加载失败触发的回调
        });

    // 对于指定容器内的滚动懒加载，与上基本相同，只是配置下`visualWindow`为容器的DOM对象即可
    var lazyload2 = wylib.lazyload('#container-2', {
            visualWindow: document.getElementById('container-2')
        });


### 参数配置
* `bufferHeight`:   Number,     预加载视区以下`bufferHeight`内的图片（上下滑动/滚动）
* `bufferWidth`:    Number,     预加载视区右侧`bufferWidth`内的图片（左右滑动/滚动）
* `lazyOnce`:       Boolean,    所有懒元素加载完成后清除触发事件，默认true。
                                如果应用于无尽列表，则该选项应该设置为false，这样对新插入的懒元素，滚动屏幕仍可触发懒加载。
* `clazz`:          String,     懒元素的class，默认`be-lazy`
* `visualWindow`:   Object,     相对容器的可视区域，默认为浏览器（window对象）
* `loadComplete`:   Function,   图片加载完成触发的回调
* `loadError`:      Function,   图片加载失败触发的回调

### 方法
* `getLazyItems()`: 获取容器内懒元素
* `destroy()`:      销毁懒加载事件
