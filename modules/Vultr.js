const conf    = require('../conf')
const sender  = require('./sender')
const rp      = require('request-promise')
const cheerio = require('cheerio')

let options = {
    gzip      : true,
    url       : 'https://my.vultr.com/deploy/',
    loginUrl  : 'https://my.vultr.com/',
    captchaUrl: 'https://my.vultr.com/_images/captcha.php?s=' + Date.now(),
    headers   : Object.assign(conf.headers, {
        cookie: '__cfduid=dda8d80d491de9dc011b746c18231d1c51492236644; _gat=1; _ga=GA1.2.96966057.1492322922; last_login_username=452125301.hzplay%40gmail.com; discuss_token=bH%298%29oh5%24fTpL%24cKt%2AmneXWaoH8QYoHv; PHPSESSID=4vst5op4gev82d0tm25abmlmk7; PHPSESSID_login_expire=1492330132',
    })
}


// 轮训请求
module.exports = class {
    constructor() {

    }

    // 登录
    static async login(data) {
        console.log('vultr:开始登录')
        let res = await rp({
            url    : options.loginUrl,
            method : 'POST',
            headers: options.headers,
            form   : data
        })

        console.log(res.body)

        console.log('vultr:登录成功')
        return res.body
    }

    // 获取验证码
    static async getCaptcha() {
        console.log('vultr:获取验证码')
        let res = await rp({
            url     : options.captchaUrl,
            headers : options.headers,
            encoding: null
        })

        console.log('vultr:验证码完毕')
        return `data:image/png;base64,${res.toString('base64')}`
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
            $ = cheerio.load(await rp(options))
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
            case !!$('[name="password"]').length:
                console.log(11)
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