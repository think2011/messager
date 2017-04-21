const router = require('koa-rest-router')()
const Vultr  = require('./modules/Vultr')
const conf   = require('./conf')


const vultr = new Vultr()


// TODO ZH 19/04/2017

vultr.startLogin()
// vultr.login(data)

router.resource('captchas', {
    async index (ctx, next) {
        let tokens = await this.getLoginToken()

        await ctx.render('captchas', tokens)
    },

    async create(ctx, next) {
        let fields = ctx.request.fields

        try {
            await Vultr.login({
                action  : fields.action,
                captcha : fields.action,
                password: conf.vultr.pass,
                username: conf.vultr.user
            })
            ctx.body = '登录成功'
        } catch (err) {
            ctx.redirect(`/captchas?err=${encodeURI(err)}`)
        }

        next()
    }
})

module.exports = router.middleware()