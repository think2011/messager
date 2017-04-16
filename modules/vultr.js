const conf    = require('../conf')
const sender  = require('./sender')
const rp      = require('request-promise')
const cheerio = require('cheerio')

let options = {
    gzip   : true,
    url    : 'https://my.vultr.com/deploy/',
    headers: Object.assign(conf.headers, {
        cookie: '__cfduid=dda8d80d491de9dc011b746c18231d1c51492236644; _gat=1; _ga=GA1.2.96966057.1492322922; last_login_username=452125301.hzplay%40gmail.com; discuss_token=bH%298%29oh5%24fTpL%24cKt%2AmneXWaoH8QYoHv; PHPSESSID=4vst5op4gev82d0tm25abmlmk7; PHPSESSID_login_expire=1492330132',
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

    try {
        let $ = cheerio.load(await rp(options))
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