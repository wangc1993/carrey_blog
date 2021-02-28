(function (window) {
  const PENDING = "pending";
  const RESOLVED = "resolved";
  const REJECTED = "rejected";

  function Promise(excutor) {
    const that = this;
    that.status = PENDING;
    that.data = "";
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

  Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  };

  Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  };

  Promise.prototype.then = function (onResolved, onRejected) {
    //给回调函数以默认值，这也是实现透这传的方式
    onResolved =
      typeof onResolved === "function" ? onResolved : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    const self = this;
    //返回一个新的Promise对象
    return new Promise((resolve, reject) => {
      // 处理返回结果
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

  Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.all = function (promises) {
    const length = promises.length;
    //保存当前成功的promise个数
    let resolvedCount = 0;
    //定义一个存放结果的数组
    const arr = new Array(length);
    return new Promise((resolve, reject) => {
      //Promise.resolve包一层是为了兼容传进来的不是promise
      Promise.resolve(promises).forEach((promise, index) => {
        promise.then(
          (value) => {
            arr[index] = value;
            resolvedCount++;
            if (resolvedCount === length) {
              resolve(arr);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  };

  Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
      Promise.resolvo(promises).forEach((promise, index) => {
        promise.then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  };

  Promise.resolveDelay = function (value, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value instanceof Promise) {
          value.then(resolve, reject);
        } else {
          resolve(value);
        }
      }, time);
    });
  };

  Promise.rejectDelay = function (reason, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(reason);
      }, time);
    });
  };

  window.Promise = Promise;
})(window);
