const program = require('commander')

program
    .option('-s, --service [service]', '已知的邮件服务 http://nodemailer.com/smtp/well-known')
    .option('-u, --user [user]', '邮箱账号')
    .option('-p, --pass [pass]', '邮箱密码')
    .option('-from, --form [form]', '发件人')
    .parse(process.argv)


let conf = {
    email: {
        service: program.service || '163',
        user   : program.user || 'hzplay2@163.com',
        pass   : program.pass || null,
        from   : program.from || 'hzplay2@163.com',
        to     : '452125301@qq.com'
    }
}

module.exports = conf
