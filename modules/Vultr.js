const conf    = require('../conf')
const sender  = require('./sender')
const rp      = require('request-promise')
const cheerio = require('cheerio')
const _       = require('lodash')

let options = {
    url       : 'https://my.vultr.com/deploy/',
    loginUrl  : 'https://my.vultr.com/',
    captchaUrl: 'https://my.vultr.com/_images/captcha.php?s=' + Date.now(),
    headers   : Object.assign(conf.headers, {
        cookie: 'PHPSESSID=o5d0j04avr87i5jjc7amdso7p6',
    })
}

rp.debug = true


module.exports = class {
    constructor() {

    }

    async getLoginToken() {
    }

    // 登录
    async login(data) {
        console.log('vultr:开始登录')
        let res = await rp({
            simple                 : false,
            followAllRedirects     : true,
            resolveWithFullResponse: true,
            gzip                   : true,
            url                    : options.loginUrl,
            method                 : 'POST',
            headers                : options.headers,
            form                   : data,
        })

        console.log(res.body)

        console.log('vultr:登录成功')
        return res.body
    }

    // 获取验证码
    async getCaptcha() {
        console.log('vultr:获取验证码')
        let res = await rp({
            url     : options.captchaUrl,
            headers : options.headers,
            encoding: null
        })

        console.log('vultr:验证码完毕')
        return `data:image/png;base64,${res.toString('base64')}`
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
                sender.send({
                    title: 'messager:vultr授权过期了',
                    body : `授权过期了，赶紧去更新授权`
                }, (err, res) => {
                    console.log(err, res)
                })
                console.log('*** 授权过期 ***')
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
}