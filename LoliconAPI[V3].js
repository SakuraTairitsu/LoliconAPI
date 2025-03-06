import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js'
import HttpsProxyAgent from 'https-proxy-agent'
import fetch from 'node-fetch'
import sharp from 'sharp'
import _ from 'lodash'

/** 配置 */
const config = {
    /** 图片地址所使用的在线反代服务 */
    proxy: '',

    /** 代理地址 */
    proxyAddress: '',

    /** 0[R18-] 1[R18+] 2[R18±] */
    r18: 0,

    /** 返回图片的规格 */
    size: 'original', // 可写值：原图[original] 缩略图[regular] ...[small|thumb|mini]

    /** 是否排除 AI 作品 */
    excludeAI: true,

    /** 风控发不出来把这个设为true */
    process: false
}

/** 预设，在下面添加即可（tag最多三个 */
const random_pic = [
    ['女孩子'],
    ['猫耳', '白裤袜'] // ['','','']
]

const NumReg = '[零一壹二贰两三叁四肆五伍六陆七柒八捌九玖十拾百佰千仟万亿\\d]+'
const reg = new RegExp(`^来\\s?(${NumReg})?[张份点](.*)[涩色瑟][图圖]`)

export class LoliconAPI extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'LoliconAPI',
            /** 功能描述 */
            dsc: 'https://api.lolicon.app',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 0,
            rule: [{
                /** 命令正则匹配 */
                reg,
                /** 执行方法 */
                fnc: 'main'
            }]
        })
    }

    /**
    * 撤回指定消息
    * @param e - 消息事件
    * @param message - 消息对象
    */
    recallMessage(e, message) {
        return e.isGroup ? e.group.recallMsg(message.message_id) : e.friend.recallMsg(message.message_id)
    }

    /**
     * 来份涩图
     * @param e - 消息事件
     * @param {Number} successCount - 成功计数
     * @param {Number} failureCount - 失败计数
     */
    async main(e, successCount = 0, failureCount = 0) {
        const startMessage = await e.reply(`[${this.name}] 少女祈祷中…`)

        const tags = e.msg.match(reg)[2].trim()

        const tag = tags ? tags.split(/[\s|,.\u3002\uff0c、]+/).map(tag => [tag]) : random_pic

        if (tag.length > 3) return e.reply('标签数量过多！', true)

        const num = e.msg.match(new RegExp(NumReg))
        const formatNum = num ? convertChineseNumberToArabic(num[0]) : 1

        if (formatNum > 20) {
            this.recallMessage(e, startMessage)
            return e.reply('先生，冲太多会炸膛！')
        } else if (formatNum === 0) {
            this.recallMessage(e, startMessage)
            return e.reply('你TM故意找茬是不是？')
        }

        const { proxy, proxyAddress, r18, size, excludeAI } = config

        try {
            const result = await fetch('https://api.lolicon.app/setu/v2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tag,
                    num: formatNum,
                    proxy: proxy || (proxyAddress ? 'i.pximg.net' : 'i.pixiv.re'),
                    r18,
                    size,
                    excludeAI
                })
            }).then(res => res.json()).catch(() => { return e.reply('出了点小问题，待会儿再试试吧~') })

            if (!Array.isArray(result.data) || result.data.length === 0) {
                this.recallMessage(e, startMessage)
                return e.reply(`[${this.name}] 未获取到相关数据！`)
            }

            const results = await Promise.all(result.data.map(async item => {
                try {
                    const { title, author, pid, r18, tags, urls } = item
                    const start = Date.now()
                    const response = await fetch(urls.original, {
                        headers: config.proxy
                            ? undefined
                            : config.proxyAddress
                                ? { 'Referer': 'https://www.pixiv.net/' }
                                : undefined,
                        agent: config.proxyAddress ? await proxyAgent(config.proxyAddress) : undefined
                    })

                    if (!response.ok) return { success: false }

                    const buffer = await response.arrayBuffer().then(Buffer.from).catch(() => undefined)

                    if (!buffer) return { success: false }

                    logger.debug(`[loliconAPI][${urls.original}] ${logger.magenta((buffer.length / 1024).toFixed(2) + 'KB')} ${logger.green(Date.now() - start + 'ms')}`)

                    const image = e.isGroup && config.process ? await processImage(buffer) : buffer

                    return {
                        success: true,
                        data: [
                            '标题：' + title + '\n',
                            '画师：' + author + '\n',
                            'Pid：' + pid + '\n',
                            'R18：' + r18 + '\n',
                            'Tags：' + tags.join('，') + '\n',
                            segment.image(image)
                        ]
                    }
                } catch (err) {
                    logger.error(err)
                    return { success: false }
                }
            }))

            const msgs = []

            results.forEach(result => {
                if (result.success) {
                    msgs.push(result.data)
                    successCount++
                } else {
                    failureCount++
                }
            })

            if (successCount === 0) {
                this.recallMessage(e, startMessage)
                return e.reply(`[${this.name}] 获取图片失败！`, false)
            }

            if (failureCount > 0) msgs.push(`获取图片成功 ${successCount} 张，失败 ${failureCount} 张`)

            const msg = await e.reply(await common.makeForwardMsg(e, msgs, `[-----${this.name}-----]`))

            return msg ? msg : e.reply('消息发送失败，可能被风控')
        } catch (err) {
            logger.error(err)
            return false
        }
    }
}

/**
 * 图片处理
 * @param {buffer} imageBuffer - 图片buffer
 */
async function processImage(imageBuffer) {
    logger.debug('执行图片处理')
    const start = Date.now()
    try {
        const metadata = sharp(imageBuffer)
        const option = _.sample(['brightness', 'contrast', 'saturation'])

        switch (option) {
            case 'brightness':
                logger.debug('brightness')
                metadata.modulate({ brightness: 1.01 })
                break
            case 'contrast':
                logger.debug('contrast')
                metadata.modulate({ contrast: 1.01 })
                break
            case 'saturation':
                logger.debug('saturation')
                metadata.modulate({ saturation: 1.01 })
                break
        }

        const buffer = await metadata.toBuffer()
        logger.debug(`[processImageBuffer] ${logger.magenta((imageBuffer.length / 1024).toFixed(2) + "kb")} => ${logger.magenta((buffer.length / 1024).toFixed(2) + "kb")} ${logger.green(Date.now() - start + "ms")}`)
        return buffer
    } catch (err) {
        logger.error(err)
        return imageBuffer
    }
}

/**
 * 初始化代理（兼容7.0.x和5.0.x
 * @param {String} proxyAddress - 代理地址
 */
function proxyAgent(proxyAddress) {
    try {
        const HttpsProxyAgentLatest = HttpsProxyAgent.HttpsProxyAgent
        return new HttpsProxyAgentLatest(proxyAddress)
    } catch {
        return new HttpsProxyAgent(proxyAddress)
    }
}

/**
 * 将中文数字转换为阿拉伯数字
 * @param {string} input - 输入的中文数字字符串
 * @returns {number} - 转换后的阿拉伯数字
 */
function convertChineseNumberToArabic(
    input, ten, result, splitString = '', parts = [], temp = false
) {
    if (!input && Number(input) !== 0) return input

    if (/^\d+$/.test(input)) return Number(input)

    const dictionary = new Map([
        ['一', 1],
        ['二', 2],
        ['三', 3],
        ['四', 4],
        ['五', 5],
        ['六', 6],
        ['七', 7],
        ['八', 8],
        ['九', 9],
        ['壹', 1],
        ['贰', 2],
        ['叁', 3],
        ['肆', 4],
        ['伍', 5],
        ['陆', 6],
        ['柒', 7],
        ['捌', 8],
        ['玖', 9],
        ['两', 2]
    ])

    splitString = input.split('亿')
    const billionAndRest = splitString.length > 1 ? splitString : ['', input]
    const rest = billionAndRest[1]
    const billion = billionAndRest[0]
    splitString = rest.split('万')
    const tenThousandAndRemainder = splitString.length > 1 ? splitString : ['', rest]
    const tenThousand = tenThousandAndRemainder[0]
    const remainder = tenThousandAndRemainder[1]
    parts = [billion, tenThousand, remainder]

    parts = parts.map(item => {
        result = item.replace('零', '')
        const reg = new RegExp(`[${Array.from(dictionary.keys()).join('')}]`, 'g')
        result = result.replace(reg, substring => {
            return dictionary.get(substring)
        })
        temp = /\d(?=[千仟])/.exec(result)
        const thousand = temp ? temp[0] : '0'
        temp = /\d(?=[百佰])/.exec(result)
        const hundred = temp ? temp[0] : '0'
        temp = /\d?(?=[十拾])/.exec(result)
        if (temp === null) {
            ten = '0'
        } else if (temp[0] === '') {
            ten = '1'
        } else {
            ten = temp[0]
        }
        temp = /\d$/.exec(result)
        const num = temp ? temp[0] : '0'
        return thousand + hundred + ten + num
    })
    return parseInt(parts.join(''))
}