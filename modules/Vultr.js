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

module.exports = class {
    constructor() {

    }

    async getLoginToken() {
        let res = await rp({
            gzip   : true,
            url    : options.loginUrl,
            headers: options.headers
        })

        let tokens   = {
            captcha: null,
            action : null,
        }
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
    async login(data) {
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

        if (this.isLogin(cheerio.load(res.body))) return Promise.reject('登录失败')

        console.log('vultr:登录成功')
    }

    isLogin($) {
        return !!$('[name="password"]').length
    }

    /**
     * 检查上架情况
     * @returns {Promise.<void>}
     */
    async check() {
        console.log('vultr:开始检查')

        let $ = null
        try {
            $ = cheerio.load(await rp({
                gzip   : true,
                url    : options.url,
                headers: options.headers
            }))
        } catch (err) {
            console.error(err)
        }

        if (this.isLogin($)) {
            console.log('*** 未登录 ***')
            try {
                await this.startLogin()
                this.check() // 登录了，再来一次
            } catch (err) {
                console.log(err)
            }
            return
        }

        if (!!$('#VPSPLANID200.deployplansoldout').length) {
            console.log('*** 上架啦！！ ***')
            sender.send({
                title: '便宜的 vultr vps 上架了',
                body : `赶紧登录 https://my.vultr.com/deploy/ 购买！`
            }, (err, res) => {
                console.log(err, res)
            })
            return
        }

        console.log('*** 没有结果 ***')
        console.log('vultr:检查结束')
    }

    async startLogin() {
        let tokens = await this.getLoginToken()

        if (tokens.captcha) {
            console.log('*** 验证码登录 ***')
            sender.send({
                title: 'messager:vultr授权过期了',
                body : `<a href="http://ss.think2011.net:3000/captcha">>> 赶紧去更新</a>`
            }, (err, res) => {
                console.log(err, res)
            })
            return Promise.reject()
        }
        else {
            console.log('*** 无需验证码 ***')
            return this.login({
                action  : tokens.action,
                password: conf.vultr.pass,
                username: conf.vultr.user
            })
        }
    }
}