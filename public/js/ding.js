const DING_TALK_ERROR_STATUS = Object.freeze({
  CONFIG: 700,
  AUTH_LOGIN: 701,
  USER_INFO: 703,
  SINGLE_CHAT: 704,
});

const status = 200;

class DingClient {
  getUrlParameter(sParam) {
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
  }
  getRegDingTalkData(agentId, corpId, timeStamp, nonceStr, signature) {
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
  }
  regDingTalk(param) {
    return new Promise((resolve, reject) => {
      dd.config(param);
      dd.ready(() => {
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
      dd.error(err => {
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
  }
  authLogin(corpId) {
    return new Promise((resolve, reject) => {
      dd.runtime.permission.requestAuthCode({
        corpId: corpId,
        onSuccess: result => {
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
        onFail: err => {
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
  }
  getUserInfo(corpId) {
    return new Promise((resolve, reject) => {
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
        onFail: err => {
          reject({
            status: status,
            data: {
              message: `userGet fail${JSON.stringify(err)}`,
              success: true,
              code: DING_TALK_ERROR_STATUS.USER_INFO,
            },
          });
        },
      });
    });
  }
  openSingleChat(data = null) {
    return new Promise((resolve, reject) => {
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
        onSuccess: () => {
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
        onFail: err => {
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
  }
}

export default new DingClient();
