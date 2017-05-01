const {email, vultr} = require('./accounts')

let conf = {
    email  : {
        service: 'qq',
        user   : email.user,
        pass   : email.pass,
        from   : '452125301@qq.com',
        to     : '452125301@qq.com'
    },
    vultr  : {
        user: vultr.user,
        pass: vultr.pass
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    }
}


module.exports = conf
