#DingTalk Auth

To get Dingtalk config build on KOA2 Server

##Installation

```
npm install i
```

##Quick Start

1. set up ./src/config/env.js

```
//input your corpid & corpsecret
module.exports = {
    corpId: 'your corpid',
    corpsecret: 'your corpsecret'
};
```

2. start the server

```
npm run start
```

3.  get the config

```
http://localhost:3000/dd/config
```
## Ref

Dingtalk API: https://open-doc.dingtalk.com/
KOA1 Version: https://github.com/injekt/jsapi-demo
ALI SDK: https://github.com/ali-sdk/node-dingtalk


