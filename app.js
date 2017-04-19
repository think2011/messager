process.env.TZ = 'Asia/Shanghai'

const path    = require('path')
const Koa     = require('koa')
const logger  = require('koa-logger')
const body    = require('koa-better-body')
const render  = require('koa-ejs')
const routes  = require('./routes')

const app = new Koa()

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
    /*   let vultrResult = await modules.vultr()

     if (vultrResult === 0) {
     setTimeout(loop, 1000 * 60 * 60 * 3)
     }*/
})()
