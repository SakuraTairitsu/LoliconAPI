import plugin from "../../lib/plugins/plugin.js"
import fetch from "node-fetch"
import moment from "moment"
import lodash from "lodash"
import sharp from 'sharp' //依赖安装命令pnpm add sharp@latest -w

const config = {
    /** 设置CD，主人不受限制，单位为秒 */
    CD: 15,

    /** 设置图片地址所使用的在线反代服务 */
    proxy: "i.pixiv.re",

    /** 返回图片的规格 */
    size: "original", // 可写值：原图[original] 缩略图[regular] ；还有三个我想没人用：[small | thumb | mini]（自己试

    /** 是否排除 AI 作品 */
    excludeAI: true,

    // 0为非 R18，1为 R18，2为混合
    r18_Master: 1, // 主人特供
    r18: 0 // 群员？爬！
}


/** 当tag为空时使用预设，在下面添加即可 */
const random_pic = [
    "萝莉|女孩子",
    "猫耳|白丝"
]

const NumReg = "[零一壹二两三四五六七八九十百千万亿\\d]+"
const Lolicon_KEY = new RegExp(`^来\\s?(${NumReg})?(张|份|点)(.*)(涩|色|瑟)(图|圖)`)

export class LoliconAPI extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: "LoliconAPI",
            /** 功能描述 */
            dsc: "https://api.lolicon.app",
            /** https://oicqjs.github.io/oicq/#events */
            event: "message",
            /** 优先级，数字越小等级越高 */
            priority: 0,
            rule: [{
                /** 命令正则匹配 */
                reg: Lolicon_KEY,
                /** 执行方法 */
                fnc: "setu",
                /** 禁用日志 */
                log: false
            }]
        })
    }

    async setu(e) {
        // 检测是否处于CD中
        let CDTIME = await redis.get(`LoliconAPI_${e.group_id}_CD`)
        if (CDTIME && !e.isMaster) return e.reply("「冷却中」先生，冲太快会炸膛！")
        let GetTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        await redis.set(`LoliconAPI_${e.group_id}_CD`, GetTime, { EX: config.CD })

        let tag = e.msg.replace(new RegExp(`^来\\s?(${NumReg})?(?:张|份|点)\|(?:涩|色|瑟)(?:图|圖)`, "g"), "")
        let num = e.msg.match(new RegExp(NumReg))

        if (num) { num = convertChineseNumberToArabic(num[0]) } else num = 1

        // 限制num最大值为20
        if (num > 20) {
            return e.reply("[WARN] 先生，冲太多会炸膛！")
        } else if (num === 0) {
            return e.reply("你TM故意找茬是不是？")
        } else if (num === "" || num === null) {
            num = 1
        }

        await e.reply("[LoliconAPI] 少女祈祷中…", false, { recallMsg: 30 })

        // 三元表达式
        let r18Value = e.isGroup ? (e.isMaster ? config.r18_Master : config.r18) : (e.isMaster ? config.r18_Master : 2)
        let tagValue = tag || lodash.sample(random_pic)
        let url = `https://api.lolicon.app/setu/v2?proxy=${config.proxy}&size=${config.size}&r18=${r18Value}&tag=${tagValue}&excludeAI=${config.excludeAI}&num=${num}`

        try {
            let response = await fetch(url)

            let result = await response.json()
            if (Array.isArray(result.data) && result.data.length === 0) return e.reply("[LoliconAPI] 未获取到相关数据！")

            let msgs = []
            let successCount = 0
            let failureCount = 0
            for (let item of result.data) {
                try {
                    let isValid = await checkImageURL(item.urls.original)
                    if (isValid) {
                        successCount++

                        // 获取图片URL
                        const imageUrl = item.urls.original

                        if (!e.isGroup) {
                            let msg = [
                                '标题：' + item.title + '\n',
                                '画师：' + item.author + '\n',
                                'Pid：' + item.pid + '\n',
                                'R18：' + item.r18 + '\n',
                                'Tags：' + item.tags.join('，') + '\n',
                                segment.image(imageUrl)
                            ]
                            msgs.push(msg)
                        } else {
                            // 获取图片数据
                            const response = await fetch(imageUrl)
                            const imageData = await response.arrayBuffer()
                            // 处理图片数据
                            logger.info('正在处理图片…')
                            const processedImageData = await processImage(imageData)

                            // 构建一条包含处理后的图片的消息
                            let msg = [
                                '标题：' + item.title + '\n',
                                '画师：' + item.author + '\n',
                                'Pid：' + item.pid + '\n',
                                'R18：' + item.r18 + '\n',
                                'Tags：' + item.tags.join('，') + '\n',
                                segment.image(processedImageData)
                            ]
                            msgs.push(msg)
                        }
                    } else {
                        failureCount++
                        // 如果图片 URL 无效，可以在这里添加操作（懒得写了
                    }
                } catch (error) {
                    logger.warn(error)
                }
            }

            // 图片仅有一张且失败的处理
            if (successCount === 0 && failureCount === 1) return e.reply('[LoliconAPI] 获取图片失败！', false, { recallMsg: 120 })

            // 为获取图片不全的数组添加提示信息，但所有图片都获取成功时，不显示成功和失败数量（不想尾部添加提示信息注释掉本行代码即可
            if (failureCount > 0) msgs.push(`[LoliconAPI] 获取图片成功 ${successCount} 张，失败 ${failureCount} 张~`)

            // 制作并发送转发消息
            return e.reply(await makeForwardMsg(e, msgs, '[-----LoliconAPI-----]'))
        } catch (error) {
            // 错误信息
            logger.warn(error)
            return e.reply("[LoliconAPI] 请检查网络环境！")
        }
    }
}

async function checkImageURL(url) {
    try {
        let response = await fetch(url, { method: "HEAD" })
        return response.ok
    } catch (error) {
        logger.warn(error)
        return false
    }
}

async function makeForwardMsg(e, msg = [], dec = '') {
    if (!Array.isArray(msg)) msg = [msg]

    let userInfo = {
        user_id: e.user_id,
        nickname: e.nickname
    }

    let forwardMsg = []
    for (const message of msg) {
        if (!message) continue
        forwardMsg.push({
            ...userInfo,
            message: message
        })
    }

    /** 制作转发内容 */
    if (e?.group?.makeForwardMsg) {
        forwardMsg = await e.group.makeForwardMsg(forwardMsg)
    } else if (e?.friend?.makeForwardMsg) {
        forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
    } else {
        return msg.join('\n')
    }

    if (dec) {
        /** 处理描述 */
        if (typeof (forwardMsg.data) === 'object') {
            let detail = forwardMsg.data?.meta?.detail
            if (detail) detail.news = [{ text: dec }]
        } else {
            forwardMsg.data = forwardMsg.data
                .replace(/\n/g, '')
                .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
                .replace(/___+/, `<title color="#777777" size="26">${dec}</title>`)
        }
    }
    return forwardMsg
}

async function processImage(imageData) {
    try {
        // 获取图片元数据
        let metadata = await sharp(imageData).metadata()

        // 定义一个数组，包含所有可能的修改选项
        let options = ['brightness', 'contrast', 'saturation', 'hue', 'width', 'height']

        // 随机选择一个选项
        let option = options[Math.floor(Math.random() * options.length)]

        // 根据选择的选项进行修改
        switch (option) {
            case 'brightness':
                // 修改亮度
                imageData = await sharp(imageData).modulate({ brightness: 1 + Math.random() * 0.02 }).toBuffer()
                break
            case 'contrast':
                // 修改对比度
                imageData = await sharp(imageData).modulate({ contrast: 1 + Math.random() * 0.02 }).toBuffer()
                break
            case 'saturation':
                // 修改饱和度
                imageData = await sharp(imageData).modulate({ saturation: 1 + Math.random() * 0.02 }).toBuffer()
                break
            case 'hue':
                // 修改色调
                imageData = await sharp(imageData).modulate({ hue: Math.floor(Math.random() * 3.6) }).toBuffer()
                break
            case 'width':
                // 修改宽度
                let newWidth = metadata.width - 1 + Math.floor(Math.random() * 2)
                imageData = await sharp(imageData).resize(newWidth, null, { withoutEnlargement: true }).toBuffer()
                break
            case 'height':
                // 修改高度
                let newHeight = metadata.height - 1 + Math.floor(Math.random() * 2)
                imageData = await sharp(imageData).resize(null, newHeight, { withoutEnlargement: true }).toBuffer()
                break
        }
        return imageData
    } catch (err) {
        logger.warn(err)
        return imageData
    }
}

/**
 * @description: 使用JS将数字从汉字形式转化为阿拉伯形式
 * @param {string} convert
 * @return {number}
 */
function convertChineseNumberToArabic(input) {
    if (!input && input != 0) return input
    // 如果是纯数字直接返回
    if (/^\d+$/.test(input)) return Number(input)
    // 字典
    let dictionary = new Map()
    dictionary.set('一', 1)
    dictionary.set('壹', 1) // 特殊
    dictionary.set('二', 2)
    dictionary.set('两', 2) // 特殊
    dictionary.set('三', 3)
    dictionary.set('四', 4)
    dictionary.set('五', 5)
    dictionary.set('六', 6)
    dictionary.set('七', 7)
    dictionary.set('八', 8)
    dictionary.set('九', 9)
    // 按照亿、万为分割将字符串划分为三部分
    let splitString = ''
    splitString = input.split('亿')
    let billionAndRest = splitString.length > 1 ? splitString : ['', input]
    let rest = billionAndRest[1]
    let billion = billionAndRest[0]
    splitString = rest.split('万')
    let tenThousandAndRemainder = splitString.length > 1 ? splitString : ['', rest]
    let tenThousand = tenThousandAndRemainder[0]
    let remainder = tenThousandAndRemainder[1]
    let parts = [billion, tenThousand, remainder]

    parts = parts.map(item => {
        let result = ''
        result = item.replace('零', '')
        let reg = new RegExp(`[${Array.from(dictionary.keys()).join('')}]`, 'g')
        result = result.replace(reg, substring => {
            return dictionary.get(substring)
        })
        let temp
        temp = /\d(?=千)/.exec(result)
        let thousand = temp ? temp[0] : '0'
        temp = /\d(?=百)/.exec(result)
        let hundred = temp ? temp[0] : '0'
        temp = /\d?(?=十)/.exec(result)
        let ten
        if (temp === null) {
            ten = '0'
        } else if (temp[0] === '') {
            ten = '1'
        } else {
            ten = temp[0]
        }
        temp = /\d$/.exec(result)
        let num = temp ? temp[0] : '0'
        return thousand + hundred + ten + num
    })
    // 借助parseInt自动去零
    return parseInt(parts.join(''))
}
