const conf    = require('../conf')
const sender  = require('./sender')
const rp      = require('request-promise')
const cheerio = require('cheerio')
const _       = require('lodash')

let options = {
    url     : 'https://my.vultr.com/deploy/',
    loginUrl: 'https://my.vultr.com/',
    headers : Object.assign(conf.headers, {
        cookie: 'PHPSESSID=o5d0j04avr87i5jjc7amdso7p6',
    })
}

rp.debug = true


module.exports = class {
    constructor() {

    }

    async getLoginToken() {
        let res = await rp({
            gzip   : true,
            url    : options.loginUrl,
            headers: options.headers
        })

        let tokens   = {}
        let $        = cheerio.load(res)
        let $captcha = $('.captcha_container img')

        if ($captcha.length) {
            console.log('vultr:获取验证码')
            let captcha = await rp({
                url     : `https://my.vultr.com/${$captcha.attr('src')}`,
                headers : options.headers,
                encoding: null
            })

            tokens.captcha = `data:image/png;base64,${captcha.toString('base64')}`
            console.log('vultr:验证码完毕')
        }

        tokens.action = $('[name="action"]').val()

        return tokens
    }

    // 登录
    login(data) {
        return new Promise(async (resolve, reject) => {
            console.log('vultr:开始登录')
            let res = await rp({
                method                 : 'POST',
                simple                 : false,
                followAllRedirects     : true,
                resolveWithFullResponse: true,
                gzip                   : true,
                url                    : options.loginUrl,
                headers                : options.headers,
                form                   : data,
            })

            if (this.isLogin(res.body)) return reject('登录失败')

            resolve('登录成功')
            console.log('vultr:登录成功')
        })
    }

    // 获取验证码
    async getCaptcha() {
    }

    isLogin(body) {
        let $ = _.isString(body) ? cheerio.load(body) : body

        return !!$('[name="password"]').length
    }


    async run() {
        console.log('vultr:start')

        /**
         * status
         * 0 没结果
         * 1 上架了
         * 2 登出了
         */
        let status = null
        let $      = null

        try {
            $ = cheerio.load(await rp({
                gzip   : true,
                url    : options.url,
                headers: options.headers
            }))
        } catch (err) {
            console.error(err)
        }

        switch (true) {
            // 上架了
            case !!$('#VPSPLANID200.deployplansoldout').length:
                sender.send({
                    title: '便宜的 vultr vps 上架了',
                    body : `赶紧登录 https://my.vultr.com/deploy/ 购买！`
                }, (err, res) => {
                    console.log(err, res)
                })
                console.log('*** 上架啦！！ ***')
                status = 1
                break;

            // 登出了
            case this.isLogin($):
                this.startLogin()
                status = 2
                break;

            // 没结果
            default:
                console.log('*** 没有结果 ***')
                status = 0
        }
        console.log('vultr:end')

        return status
    }

    async startLogin() {
        let tokens = await this.getLoginTok                                                     en()

        if (tokens.captcha) {
            console.log('*** 验证码登录 ***')
            sender.send({
                title: 'messager:vultr授权过期了',
                body : `<a href="http://ss.think2011.net:3000/captcha">>> 赶紧去更新</a>`
            }, (err, res) => {
                console.log(err, res)
            })
        }
        else {
            console.log('*** 无需验证码 ***')
            this.login({
                action  : tokens.action,
                password: conf.vultr.pass,
                username: conf.vultr.user
            })
        }
    }
}