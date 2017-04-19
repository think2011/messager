const router = require('koa-rest-router')()
const Vultr  = require('./modules/Vultr')

const vultr = new Vultr()


// TODO ZH 19/04/2017
let data = {
    action  : '4w/VHwb4u9YqWKf1Gbcjd89KosKVNk8fNo7UdbSIlX8=',
    captcha : 'udadku',
    password: 'z@vultr@z27Z',
    username: '452125301.hzplay@gmail.com'
}

vultr.login(data)

router.resource('captchas', {
    async index (ctx, next) {
        let image = await Vultr.getCaptcha()

        await ctx.render('captchas', {
            image
        })
    },

    async create(ctx, next) {
        let {captcha} = ctx.request.fields
        let data      = {
            action  : '4w/VHwb4u9YqWKf1Gbcjd89KosKVNk8fNo7UdbSIlX8=',
            captcha,
            password: 'z@vultr@z27Z',
            username: '452125301.hzplay@gmail.com'
        }

        ctx.body = await Vultr.login(data)
        next()
    }
})

module.exports = router.middleware()