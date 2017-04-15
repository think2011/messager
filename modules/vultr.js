const conf    = require('../conf')
const sender  = require('./sender')
const rp      = require('request-promise')
const cheerio = require('cheerio')

let options = {
    gzip   : true,
    url    : 'https://my.vultr.com/deploy/',
    headers: Object.assign(conf.headers, {
        cookie: '__cfduid=dda8d80d491de9dc011b746c18231d1c51492236644; last_login_username=452125301.hzplay%40gmail.com; PHPSESSID=8doik3mopca2peo6as54569n83; PHPSESSID_login_expire=1492268646',
    })
}

module.exports = async () => {
    console.log('vultr:start')

    /**
     * status
     * 0 没结果
     * 1 上架了
     * 2 登出了
     */
    let status = null
    let $      = cheerio.load(await rp(options))

    switch (true) {
        // 上架了
        case $('#VPSPLANID200.deployplansoldout').length:
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
        case $('[name="password"]').length:
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

