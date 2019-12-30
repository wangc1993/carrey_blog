/*
* @Author: Carrey Wang
* @Date:   2019-12-29 13:23:12
* @Last Modified by:   Carrey Wang
* @Last Modified time: 2019-12-29 18:00:35
*/

//代理
const http = require('http');
const request = require('request');

const hostIp = '127.0.0.1';
const apiPort = 8070;
const imgPort = 8071;

//创建 API 代理服务
const apiServer = http.createServer((req, res) => {
    console.log('[apiServer]req.url='+req.url);
    const url = 'http://api.douban.com' + req.url;
    console.log('[apiServer]url='+url);
    const options = {
        url: url
    };

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            //编码类型
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            //允许跨域
            res.setHeader('Access-Control-Allow-Origin', '*');
            //返回代理内容
            res.end(body);
        }
    }

    request.get(options, callback);
});

//监听 API 端口
apiServer.listen(apiPort, hostIp, () => {
    console.log('代理接口，运行于 http://' + hostIp + ':' + apiPort + '/');
});

//创建图片代理服务
const imgServer = http.createServer((req, res) => {
    const url = 'https://pic2.zhimg.com/' +req.url.split('/img/')[1];
    console.log('[imgServer]url=' + url);
    const options = {
        url: url,
        encoding: null
    };

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            const contentType = response.headers['content-type'];
            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(body);
        }
    }

    request.get(options, callback);


});

//监听图片端口
// imgServer.listen(imgPort, hostIp, () => {
//     console.log('代理图片，运行于 http://' + hostIp + ':' + imgPort + '/')
// });