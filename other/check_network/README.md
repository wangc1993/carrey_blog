背景：当我们浏览网站的时候，特别是视频网站的时候，当我们选择视频分辨率为自动的时候，网站会根据我们网络的状态进行分辨率的切换，当我们断网的时候，会给个友好提示，这是怎么做到了呢？之前一直疑惑，不过并没有深究，直到看到一篇[文章](https://juejin.cn/post/6844904109846298637)后，决定动手探个究竟。

#### 一、检测浏览器是否连网

navigator.onLine

1. true online
2. false offline

控制台直接打印 navigator.onLine 即可验证，此外，浏览器也有相应的事件供我们监听（online 和 offline）。不过通过这个属性只能监听网络是断开还是连接，要想更细致地了解网络状态还得另寻他路。

#### 二、检测网络状况

navigator.connection 目前还处于[草案](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation)阶段，并不是所有浏览器都支持，不过这并不是重点。

online 状态下控制台打印 console.log(navigator.connection)：

```js
{
    onchange: null,
    effectiveType: "4g",//网络类型
    rtt: 50,
    downlink: 2,//带宽
    saveData: false
}
```

具体每个字段的意义不多做解释，草案里都有；

#### 三、结合一和二，简单实现一个实时监听网络情况的[案例](https://github.com/wangc1993/carrey_blog/blob/master/other/check_network/index.html)

主要代码：

```js
//增加断网/联网的事件监听
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
//每5秒获取一次网络信息
let timer = setInterval(() => {
  updateOnlineStatus();
}, 3000);

//更新逻辑
let log = document.getElementById("log");
let connectionInfo =
  navigator.connection || navigator.mozConnection || navigator.webkitConnection;
log.insertAdjacentHTML(
  "beforeend",
  `<div>${i}、当前网络状态：${connectionInfo.effectiveType}，当前带宽：${connectionInfo.downlink};<div>`
);
```
