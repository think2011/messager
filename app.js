process.env.TZ = 'Asia/Shanghai'

const path   = require('path')
const Koa    = require('koa')
const logger = require('koa-logger')
const body   = require('koa-better-body')
const render = require('koa-ejs')
const Vultr  = require('./modules/Vultr')
const routes = require('./routes')

const vultr = new Vultr()
const app   = new Koa()

render(app, {
    root   : path.join(__dirname, 'views'),
    layout : false,
    viewExt: 'ejs',
    cache  : true
})

app.use(logger())
app.use(body())
app.use(routes)

app.listen(3000, () => {
    console.log('app started at port http://localhost:3000...')
})

;(async function loop() {
    await vultr.check()

    console.log('*** 1个小时循环一次 ***')
    setTimeout(loop, 1000 * 60 * 60)
})()
