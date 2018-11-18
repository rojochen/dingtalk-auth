const router = require('koa-router')()
router.prefix('/dd')
router.post('/config', require('../controller/dingtalk').getConfig);

module.exports = router
