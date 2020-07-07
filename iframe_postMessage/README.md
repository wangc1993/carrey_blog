在产品的开发过程中会出现需要将多个公有云的工程嵌入到一个大的私有云外壳下，即通过iframe的方式嵌入。这时候传参就是首要问题，不过现在方式很多，比如：sessionStorage、localStorage等，本文要讲的是比较安全的postMessage的方式。

#### 介绍：[postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)

#### 简单整理：

1. 发送方：

``` js
otherWindow.postMessage(message, targetOrigin, [transfer])
//otherWidth: 其他窗口的一个引用。比如iframe的contentWindow属性：iframeEle.contentWindow;执行window.open返回的窗口对象;或者是命名过或数值索引的window.frames: window.frames[XX]。
//message: 发送的数据，自动被结构化克隆算法序列化。
//targetOrigin：通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。
//transfer: 是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。
```

2. 接收方：

``` js
//接收方通过addEventListener注册message事件，receiveMessage是一个function，接收参数MessageEvent
window.addEventListener(
    'message',
    receiveMessage,
    false
)
//其中MessageEvent为：
{
    bubbles: false
    cancelBubble: false
    cancelable: false
    composed: false
    currentTarget: Window {
        postMessage: ƒ,
        blur: ƒ,
        focus: ƒ,
        close: ƒ,
        parent: Window,
        …
    }
    data: {
        message: "我是father",
        userName: "father"
    }
    defaultPrevented: false
    eventPhase: 0
    isTrusted: true
    lastEventId: ""
    origin: "null"
    path: [Window]
    ports: []
    returnValue: true
    source: Window {
        window: Window,
        self: Window,
        location: Location,
        closed: false,
        frames: Window,
        …
    }
    srcElement: Window {
        postMessage: ƒ,
        blur: ƒ,
        focus: ƒ,
        close: ƒ,
        parent: Window,
        …
    }
    target: Window {
        postMessage: ƒ,
        blur: ƒ,
        focus: ƒ,
        close: ƒ,
        parent: Window,
        …
    }
    timeStamp: 15.320000005885959
    type: "message"
    userActivation: null
    __proto__: MessageEvent
}
```
