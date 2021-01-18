/*
 * @Author: Carrey Wang
 * @Date:   2019-12-28 21:12:45
 * @Last Modified by:   Carrey Wang
 * @Last Modified time: 2019-12-30 13:26:27
 */

const baseUrl = 'http://127.0.0.1:8070/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a';
const picContainer = document.querySelector('.pic-container');
let originStartPage = -1;
let startPage = 0;
let count = 8;

//获取图片信息
function getPicData(startPage = 0, count = 4, callback) {
    fetch(`${baseUrl}&start=${startPage}&count=${count}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            callback(data.subjects);
        })
        .catch(e => {
            console.log(e.message);
        });
}

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

//创建图片的实例
function createLoadPicEle() {
    getPicData(startPage, count, function(picDataArr) {
        if (picDataArr.length > 1) {
            startPage += 1;
        }
        for (let i = 0; i < picDataArr.length; i++) {
            const imgEle = new ImgEle();
            imgEle.setProxySrc(picDataArr[i].images.large);
        }
    });
}

//滚动条在Y轴上的滚动距离
function getScrollTop() {
    let scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;　　
    if (document.body) {　　　　
        bodyScrollTop = document.body.scrollTop;　　
    }　　
    if (document.documentElement) {　　　　
        documentScrollTop = document.documentElement.scrollTop;　　
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

//文档的总高度
function getScrollHeight() {
    let scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;　　
    if (document.body) {　　　　
        bSH = document.body.scrollHeight;　　
    }　　
    if (document.documentElement) {　　　　
        dSH = document.documentElement.scrollHeight;　　
    }
    scrollHeight = (bSH - dSH > 0) ? bSH : dSH;　　
    return scrollHeight;
}

//浏览器视口的高度
function getWindowHeight() {
    let windowHeight = 0;　　
    if (document.compatMode == "CSS1Compat") {　　　　
        windowHeight = document.documentElement.clientHeight;　　
    } else {　　　　
        windowHeight = document.body.clientHeight;　　
    }　　
    return windowHeight;
}
window.onscroll = function() {
    if ((getScrollTop() + getWindowHeight() > getScrollHeight() - 10) && startPage > originStartPage) {
        originStartPage = startPage;
        createLoadPicEle();
    }
}