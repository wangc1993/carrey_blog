在web开发中，常常有动态增加页面图片的需求。不过，当图片还没加载完成时，会有一段时间空白，用户体验极差，这时候需要一个占位图告诉用户正在加载，尽量不要白屏。下面提供的办法就是一个虚拟代理实现的图片懒加载。

主要实现代码：
```js
//创建一个图片的构造函数
function ImgEle() {
    const initImg = this.init(picContainer);
    this.setProxySrc = this.proxy(initImg);
}

ImgEle.prototype = {
    //创建本体对象，生成img标签，对外提供setSrc接口
    init: function(parentNode) {
        const picWrapperDiv = document.createElement('div');
        picWrapperDiv.className = 'pic-wrapper';
        const imgEle = document.createElement('img');
        imgEle.src = './loading.gif';
        imgEle.alt = 'nodata';
        picWrapperDiv.appendChild(imgEle);
        parentNode.appendChild(picWrapperDiv);
        //重新赋值loading图片的src
        return {
            setSrc: function(src) {
                imgEle.src = src;
            }
        }
    },

    //代理（虚拟）图片加载
    proxy: function(initImg) {
        const imgEle = document.createElement('img');
        imgEle.onload = function() {
            //this指imgEle
            initImg.setSrc(this.src);
        }

        //设置代理图片的src
        return function(src) {
            imgEle.src = src;
        }
    }
}

//实例创建
const imgEle = new ImgEle();
imgEle.setProxySrc(src);
```
案例运行实例：

步骤一：网上找了一个豆瓣的api（[http://127.0.0.1:8070/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a](https://note.youdao.com/)）从中提取图片地址。

步骤二：解决接口跨域问题（node代理）。不用担心在已经帮你配好了，直接运行即可：
```
//加载依赖包
npm install
//运行node
node proxy.js
```
步骤三：直接浏览器打开index.html文件即可。