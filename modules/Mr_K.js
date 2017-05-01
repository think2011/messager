const chalk   = require('chalk')
const fs      = require('fs')
const fse     = require('fs-extra')
const conf    = require('../conf')
const sender  = require('./sender')
const rp      = require('request-promise')
const rq      = require('request')
const cheerio = require('cheerio')
const {mrK}   = require('../conf/accounts')
const iconv   = require('iconv-lite')
const async   = require('async')
const moment  = require('moment')
const _       = require('lodash')

let url  = {
    list: 'https://h5.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/blognew/get_abs?hostUin=2942298879&uin=452125301&blogType=0&reqInfo=1&num=50&g_tk=1037917341&format=json',
    detail(blogId){
        return `https://h5.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/blognew/blog_output_data?uin=2942298879&blogid=${blogId}`
    }
}
let rpap = rp.defaults({
    gzip   : true,
    headers: Object.assign(conf.headers, {cookie: mrK.cookie})
})

module.exports = class {
    constructor() {
        this.total = 0
    }

    async start() {

        let list = await this.fetchList()

        let tasks = _.map(list, (item) => {
            return (callback) => {
                let title = this.createTitle(item.pubTime, item.title)

                if (this.isExist(title)) {
                    console.log(chalk.cyan(`mr_k:无需下载【${title}】`))
                    callback()
                }
                else {
                    this.fetchDetailById(item.blogId)
                        .then((contents) => {
                            return this.saveDetail(title, contents)
                        })
                        .then(callback)
                }
            }
        })

        async.parallelLimit(tasks, 5, (err, results) => {
            if (err) console.log(err)
            console.log(chalk.green('=== mr_k 全部完成 ==='))
        })

    }

    async fetchList() {
        let res = await rpap({
            url     : url.list,
            encoding: null
        })

        return JSON.parse(iconv.decode(res, 'gbk')).data.list
    }

    async fetchDetailById(id) {
        let res = null
        try {
            res = await rpap({
                url: url.detail(id)
            })
        } catch (err) {
            //
        }

        if (res) {
            this.total = 0
            console.log('mr_k:获取成功')
            return res
        }
        else {
            this.total++
            console.log(`mr_k:当前第${this.total}次获取文章`)
            return this.fetchDetailById(id)
        }
    }

    /**
     * 以图片的形式保存内容
     * @param title
     * @param body {String}
     * @returns {Promise.<void>}
     */
    async saveDetail(title, body) {
        let dir = `${mrK.dir}/${title}`
        let $   = cheerio.load(body)

        let tasks = _.map($('#blogDetailDiv img'), (item, index) => {
            return (callback) => {
                let url = $(item).attr('src')

                console.log(`mr_k:下载【${title}】:${index}.jpg`)
                rpap({url})
                    .pipe(fs.createWriteStream(`${dir}/${index}.jpg`))
                    .on('finish', callback)
            }
        })

        fse.mkdirs(dir)
        return new Promise((resolve, reject) => {
            async.parallelLimit(tasks, 10, (err, results) => {
                if (err) {
                    return console.log(chalk.red(`mr_k:【${title}】失败`))
                }

                console.log(chalk.green(`mr_k:【${title}】完成`))
                resolve()
            })
        })
    }

    isExist(title) {
        return fs.existsSync(`${mrK.dir}/${title}`)
    }

    createTitle(pubTime, title) {
        return `${moment(pubTime).format('YYYY-MM-DD HH-mm')}__${title}`
    }
}