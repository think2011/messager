const program = require('commander')

program
    .option('-s, --service [service]', '已知的邮件服务 http://nodemailer.com/smtp/well-known', 'qq')
    .option('-u, --user [user]', '邮箱账号', '452125301@qq.com')
    .option('-p, --pass [pass]', '邮箱密码', null)
    .option('-f, --from [from]', '发件人', '452125301@qq.com')
    .option('-t, --to [to]', '收件人', '452125301@qq.com')
    .option('--vultrUser [vultrUser]', 'vultr账号', '452125301.hzplay@gmail.com')
    .option('--vultrPass [vultrPass]', 'vultr密码', null)
    .parse(process.argv)


let conf = {
    email  : {
        service: program.service,
        user   : program.user,
        pass   : program.pass,
        from   : program.from,
        to     : program.to
    },
    vultr  : {
        user: program.vultrUser,
        pass: program.vultrPass
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    }
}


module.exports = conf
