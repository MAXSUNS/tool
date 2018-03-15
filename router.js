/**
 * Created by suns on 2018/3/14.
 */
const Router = require('koa-router')
const router = new Router()
const poet = require('./controller/poet')

router.post('/poet/add', poet.add)
router.get('/poet/info', poet.info)

module.exports = router