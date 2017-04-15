const nodemailer = require('nodemailer')

/**
 * 发送邮件
 */
class Sender {
    /**
     * @param options
     * @param options.service 已知的邮件服务 http://nodemailer.com/smtp/well-known
     * @param options.from 发件人
     * @param [options.to] 收件人
     * @param options.user
     * @param options.pass
     */
    constructor(options) {
        let defaults = {
            service: options.service,
            auth   : {user: options.user, pass: options.pass},
            from   : options.from,
            to     : options.to
        }

        this.options     = defaults
        this.transporter = nodemailer.createTransport(defaults)
    }

    /**
     * 发送
     * @param options
     * @param options.title 标题
     * @param options.body 正文
     * @param [options.from] 发件人，默认用构造时的参数
     * @param [options.to] 收件人，默认用构造时的参数
     * @param cb
     */
    send(options, cb) {
        let defaults = {
            subject: options.title,
            html   : options.body,
            from   : this.options.from,
            to     : this.options.to || options.to
        }

        console.log(`transporter：${defaults.from} to ${defaults.to}`)
        this.transporter.sendMail(defaults, (err, res) => {
            this.transporter.close() // 如果没用，关闭连接池
            if (err) return cb(err)

            cb(null, res)
        })
    }
}

module.exports = Sender