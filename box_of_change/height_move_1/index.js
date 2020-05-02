/*
 * @Author: Carrey Wang
 * @Date:   2019-12-28 21:12:45
 * @Last Modified by: Carrey Wang
 * @Last Modified time: 2020-05-02 21:20:46
 */

function dragControllerDiv() {
    let resize = document.getElementsByClassName('resize');
    let resize2 = document.getElementsByClassName('resize2');
    let top = document.getElementsByClassName('top');
    let bottom = document.getElementsByClassName('bottom');
    let mid = document.getElementsByClassName('mid');
    let box = document.getElementsByClassName('box');
    for (let i = 0; i < resize.length; i++) {
        resize[i].onmousedown = function (e) {
            //获取起始数据，便于计算
            let startY = e.clientY;
            let topH = top[i].offsetHeight;
            let bottomH = bottom[i].offsetHeight;
            let maxH = box[i].offsetHeight - 10 - bottomH - 150;
            document.onmousemove = function (e) {
                let endY = e.clientY;
                let moveLen = endY - startY;
                //最小高度150
                if(topH + moveLen < 150) moveLen = 150 - topH
                if(topH + moveLen > maxH) moveLen = maxH - topH

                for (let j = 0; j < top.length; j++) {
                    top[j].style.height = topH + moveLen + 'px';
                    mid[j].style.height = box[i].offsetHeight - moveLen - topH - bottomH - 10 + 'px';
                }
            }
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                resize[i].releaseCapture && resize[i].releaseCapture();
            }
            resize[i].setCapture && resize[i].setCapture();
            return false;
        }
    }
    for (let i = 0; i < resize2.length; i++) {
        resize2[i].onmousedown = function (e) {
            //获取起始数据，便于计算
            let startY = e.clientY;
            let topH = top[i].offsetHeight;
            let midH = mid[i].offsetHeight;
            let maxH = box[i].offsetHeight - 10 - topH - 150;
            document.onmousemove = function (e) {
                let endY = e.clientY;
                let moveLen = endY - startY;
                //最小高度150
                if(midH + moveLen < 150) moveLen = 150 - midH
                if(midH + moveLen > maxH) moveLen = maxH - midH

                for (let j = 0; j < top.length; j++) {
                    mid[j].style.height = midH + moveLen + 'px';
                    bottom[j].style.height = box[i].offsetHeight - moveLen - midH - topH - 10 + 'px';
                }
            }
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                resize2[i].releaseCapture && resize2[i].releaseCapture();
            }
            resize2[i].setCapture && resize2[i].setCapture();
            return false;
        }
    }
}
window.onload = function () {
    dragControllerDiv()
}