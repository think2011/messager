process.env.TZ = 'Asia/Shanghai'

const path = require('path')
const Mr_K = require('./modules/Mr_K')

const mr_k = new Mr_K()

mr_k.start()