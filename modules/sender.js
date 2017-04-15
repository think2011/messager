const conf  = require('../conf')
const utils = require('../assets/utils')

module.exports = new utils.Sender(conf.email)

