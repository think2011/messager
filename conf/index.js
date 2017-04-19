const program = require('commander')

program
    .option('-s, --service [service]', '已知的邮件服务 http://nodemailer.com/smtp/well-known')
    .option('-u, --user [user]', '邮箱账号')
    .option('-p, --pass [pass]', '邮箱密码')
    .option('-from, --form [form]', '发件人')
    .parse(process.argv)


let conf = {
    email  : {
        service: program.service || 'qq',
        user   : program.user || '452125301@qq.com',
        pass   : program.pass || null,
        from   : program.from || '452125301@qq.com',
        to     : '452125301@qq.com'
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    }
}

module.exports = conf
