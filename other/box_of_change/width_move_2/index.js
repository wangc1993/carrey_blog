/*
 * @Author: Carrey Wang
 * @Date:   2019-12-28 21:12:45
 * @Last Modified by: Carrey Wang
 * @Last Modified time: 2020-05-02 21:36:14
 */

function dragControllerDiv() {
    let resize = document.getElementsByClassName('resize');
    let resize2 = document.getElementsByClassName('resize2');
    let left = document.getElementsByClassName('left');
    let right = document.getElementsByClassName('right');
    let mid = document.getElementsByClassName('mid');
    let box = document.getElementsByClassName('box');
    let fix = document.getElementsByClassName('fix')[0];
    for (let i = 0; i < resize.length; i++) {
        resize[i].onmousedown = function (e) {
            //获取起始数据，便于计算
            let startX = e.clientX;
            let leftW = left[i].offsetWidth;
            let rightW = right[i].offsetWidth;
            let maxT = box[i].clientWidth - 10 - rightW - 150;
            document.onmousemove = function (e) {
                fix.style.left = e.clientX + 'px'
            }
            document.onmouseup = function (e) {
                fix.style.left = '-10px';

                let endX = e.clientX;
                let moveLen = endX - startX;
                //最小宽度150
                if(leftW + moveLen < 150) moveLen = 150 - leftW
                if(leftW + moveLen > maxT) moveLen = maxT - leftW

                for (let j = 0; j < left.length; j++) {
                    left[j].style.width = leftW + moveLen + 'px';
                    mid[j].style.width = box[i].clientWidth - moveLen - leftW - rightW - 10 + 'px';
                }
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
            let startX = e.clientX;
            let leftW = left[i].offsetWidth;
            let midW = mid[i].offsetWidth;
            let maxT = box[i].clientWidth - 10 - leftW - 150;
            document.onmousemove = function (e) {
                fix.style.left = e.clientX + 'px'
            }
            document.onmouseup = function (e) {
                fix.style.left = '-10px';

                let endX = e.clientX;
                let moveLen = endX - startX;
                //最小宽度150
                if(midW + moveLen < 150) moveLen = 150 - midW
                if(midW + moveLen > maxT) moveLen = maxT - midW

                for (let j = 0; j < left.length; j++) {
                    mid[j].style.width = midW + moveLen + 'px';
                    right[j].style.width = box[i].clientWidth - moveLen - midW - leftW - 10 + 'px';
                }
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