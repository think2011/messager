const router = require('koa-rest-router')()
const Vultr  = require('./modules/Vultr')
const conf   = require('./conf')
const _      = require('lodash')

const vultr = new Vultr()

router.resource('captchas', {
    async index (ctx, next) {
        let tokens = await vultr.getLoginToken()

        await ctx.render('captchas', _.assign(tokens, ctx.query))
    },

    async create(ctx, next) {
        let fields = ctx.request.fields

        try {
            await vultr.login({
                action  : fields.action,
                captcha : fields.captcha,
                password: conf.vultr.pass,
                username: conf.vultr.user
            })
            ctx.body = '登录成功'
            vultr.check()
        } catch (err) {
            ctx.redirect(`/captchas?err=${encodeURI(err)}`)
        }

        next()
    }
})

module.exports = router.middleware()