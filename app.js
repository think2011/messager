const modules = require('./modules')

;(async function loop() {
    let vultrResult = await modules.vultr()

    if (vultrResult === 0) {
        setTimeout(loop, 1000 * 60 * 60 * 3)
    }
})()