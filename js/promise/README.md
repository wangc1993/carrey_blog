#### 让我们一步步来探索 primise 的奥秘

#### 一、promise 是什么？

[Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 promise，以便在未来某个时候把值交给使用者。

一个 Promise 必然处于以下几种状态之一：

1. 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
2. 已兑现（fulfilled/resolved）: 意味着操作成功完成。
3. 已拒绝（rejected）: 意味着操作失败。

#### 二、如何构造一个符合[promise/A+规范](https://www.ituring.com.cn/article/66566)的promise呢？

1. promise 是一个构造函数，那我们就从构造函数开始

```js
function Promise(excutor) {}
```

2. 接着，我们看看 promise 我们是怎么使用的

```js
const p = new Pronise((resolve, reject) => {}).then(
  (value) => {},
  (reason) => {}
);
```

3. resolve 和 reject 是啥？他们就是一个改变构造函数状态的静态方法，能够确保 promise 只有一种状态变化的关键

```js
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function Promise(excutor) {
  const that = this;
  //promise的状态
  that.status = PENDING;
  //当前返回值
  that.data = "";
  //还未执行的回调函数（对应then）
  that.callbacks = [];

  function resolve(value) {
    //判断状态
    if (that.status !== PENDING) {
      return;
    }
    that.status = RESOLVED;
    that.data = value;
    if (that.callbacks.length > 0) {
      //异步放入队列中执行
      setTimeout(() => {
        that.callbacks.forEach((callbackObj) => {
          callbackObj.onResolved(value);
        });
      });
    }
  }

  function reject(reason) {
    //判断状态
    if (that.status !== PENDING) {
      return;
    }
    that.status = REJECTED;
    that.data = reason;
    if (that.callbacks.length > 0) {
      //异步放入队列中执行
      setTimeout(() => {
        that.callbacks.forEach((callbackObj) => {
          callbackObj.onRejected(reason);
        });
      });
    }
  }

  //执行器:立即同步执行
  try {
    excutor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
```

4. 接下来就是重点了，then 是如何是实现的。then 会返回一个新的 promise，返回的 promise 状态又如何决定

```js
Promise.prototype.then = function (onResolved, onRejected) {
  //给回调函数以默认值，这也是实现透这传的方式
  onResolved = typeof onResolved === "function" ? onResolved : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
        };
  const self = this;
  //返回一个新的Promise对象
  return new Promise((resolve, reject) => {
    // 处理返回结果（提取出来的公共方法）
    function handle(callback) {
      /*
       *1、当回调函数执行异常，返回的promise为失败
       *2、当回调函数不为promise时，返回的promise为成功
       *1、当回调函数为promise时，返回的promise的状态由回调函数的返回状态决定
       */
      try {
        const result = callback(self.data);
        if (result instanceof Promise) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    }
    //根据当前promise的状态进行接下来的操作
    if (self.status === PENDING) {
      self.callbacks.push({
        onResolved() {
          handle(onResolved);
        },
        onRejected() {
          handle(onRejected);
        },
      });
    } else if (self.status === RESOLVED) {
      setTimeout(() => {
        handle(onResolved);
      });
    } else {
      setTimeout(() => {
        handle(onRejected);
      });
    }
  });
};
```

5. 当我们用 promise，往往最后会用 catch 去捕获错误，这又是如何实现的呢，其实很简单

```js
Promise.prototype.catch = function (onRejected) {
  //利用then方法直接将失败的方法传递即可
  return this.then(null, onRejected);
};
```
6. 拓展：还有promise.all、promise.race等常用方法，具体可见[案例](https://github.com/wangc1993/carrey_blog/tree/master/js/promise/promise.js)
