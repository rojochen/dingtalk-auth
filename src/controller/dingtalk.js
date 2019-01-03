const https = require("https");
const querystring = require('querystring');
const url = require('url');
const  crypto = require('crypto');

const OAPI_HOST = 'https://oapi.dingtalk.com';
const corpId = require('../config/env').corpId;
const corpsecret = require('../config/env').corpsecret;
const env =  require('../config/env');

async function getConfig(ctx) {
    let nonceStr = 'abcdefg';
    let timeStamp = new Date().getTime();
    let signedUrl = decodeURIComponent(ctx.request.href);
    let accessTokenResponse = await invoke('/gettoken', env);
    let accessToken = accessTokenResponse['access_token'];
    let ticketResponse = await invoke('/get_jsapi_ticket', {type: 'jsapi', access_token: accessToken});
    let ticket = ticketResponse['ticket'];
    let signature = sign({
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        url: signedUrl,
        ticket: ticket
    });
    let responeBody =  {
        signature: signature,
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        corpId: corpId
    };
    ctx.body = responeBody;
}


function invoke(path, params) {
    let httpPromise = new Promise((resolve, reject)=>{
        https.get(OAPI_HOST + path + '?' + querystring.stringify(params), function(res) {
            if (res.statusCode === 200) {
                let body = '';
                res.on('data', function (data) {
                    body += data;
                }).on('end', function () {
                    var result = JSON.parse(body);
                    if (result && 0 === result.errcode) {
                        resolve(result)
                    }
                    else {
                        reject(result);
                    }
                });
            }
            else {
                reject(new Error(response));
            }
        }).on('error', function(e) {
            reject(e);
        });
    });
    return httpPromise;
}

function sign(params) {
    var origUrl = params.url;
    var origUrlObj =  url.parse(origUrl);
    delete origUrlObj['hash'];
    var newUrl = url.format(origUrlObj);
    var plain = 'jsapi_ticket=' + params.ticket +
        '&noncestr=' + params.nonceStr +
        '&timestamp=' + params.timeStamp +
        '&url=' + newUrl;

    console.log(plain);
    var sha1 = crypto.createHash('sha1');
    sha1.update(plain, 'utf8');
    var signature = sha1.digest('hex');
    console.log('signature: ' + signature);
    return signature;
}

module.exports = { getConfig };