var DING_TALK_ERROR_STATUS = Object.freeze({
  CONFIG: 700,
  AUTH_LOGIN: 701,
  USER_INFO: 703,
  SINGLE_CHAT: 704,
});

var status = 200;
function DingClient() {}
DingClient.prototype.getUrlParameter = function(sParam) {
  let sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};
DingClient.prototype.getRegDingTalkData = function(
  agentId,
  corpId,
  timeStamp,
  nonceStr,
  signature,
) {
  return {
    agentId: Number(agentId),
    corpId: corpId,
    timeStamp: timeStamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: [
      'biz.util.openLink',
      'device.launcher.launchApp',
      'device.notification.confirm',
      'device.notification.alert',
      'device.notification.prompt',
      'biz.chat.chooseConversation',
      'biz.ding.post',
      'biz.user.get',
      'biz.chat.openSingleChat',
    ],
  };
};
DingClient.prototype.regDingTalk = function(param) {
  return new Promise((resolve, reject) => {
    dd.config(param);
    dd.ready(function() {
      resolve({
        status: status,
        data: {
          message: 'DingTalk jsApi concents  ok ',
          param,
          success: true,
          code: 200,
        },
      });
    });
    dd.error(function(err) {
      reject({
        status: status,
        data: {
          message: 'DingTalk jsApi concents : ' + JSON.stringify(err),
          success: false,
          code: DING_TALK_ERROR_STATUS.CONFIG,
        },
      });
    });
  });
};
DingClient.prototype.authLogin = function(corpId) {
  return new Promise(function(resolve, reject) {
    dd.runtime.permission.requestAuthCode({
      corpId: corpId,
      onSuccess: function(result) {
        resolve({
          status: status,
          data: {
            message: 'DingTalk requestAuthCode concents  ok: ',
            result,
            success: true,
            code: 200,
          },
        });
      },
      onFail: function(err) {
        reject({
          status: status,
          data: {
            code: DING_TALK_ERROR_STATUS.AUTH_LOGIN,
            message:
              'DingTalk requestAuthCode concents : ' + JSON.stringify(err),
            success: false,
          },
        });
      },
    });
  });
};
DingClient.prototype.getUserInfo = function(corpId) {
  return new Promise(function(resolve, reject) {
    dd.biz.user.get({
      corpId: corpId,
      onSuccess: info => {
        resolve({
          status: status,
          data: {
            message: 'userGet success',
            info,
            success: true,
            code: 200,
          },
        });
      },
      onFail: function(err) {
        reject({
          status: status,
          data: {
            message: 'userGet fail' + JSON.stringify(err),
            success: true,
            code: DING_TALK_ERROR_STATUS.USER_INFO,
          },
        });
      },
    });
  });
};
DingClient.prototype.openSingleChat = function(data) {
  return new Promise(function(resolve, reject) {
    if (!data) {
      reject({
        status: status,
        data: {
          code: DING_TALK_ERROR_STATUS.SINGLE_CHAT,
          message: 'data does not exist !!',
          success: false,
        },
      });
    }
    dd.biz.chat.openSingleChat({
      corpId: data.corpId,
      userId: data.userId,
      onSuccess: function() {
        resolve({
          status: status,
          data: {
            message: 'open single chat ok',
            result: data,
            success: true,
            code: 200,
          },
        });
      },
      onFail: function(err) {
        reject({
          status: status,
          data: {
            code: DING_TALK_ERROR_STATUS.SINGLE_CHAT,
            message: 'open single chat err : ' + JSON.stringify(err),
            success: false,
          },
        });
      },
    });
  });
};
var DingClient = new DingClient();
