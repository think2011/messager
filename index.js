const conf   = require('./conf')
const Sender = require('./assets/utils/Sender')

let sender = new Sender(conf.email)

sender.send({
    title: '试邮件d22',
    body : 'ffffffas是的发额'
}, (err, res) => {
    console.log(err, res)
})