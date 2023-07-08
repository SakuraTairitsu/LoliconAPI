import plugin from "../../lib/plugins/plugin.js"
import fetch from "node-fetch"
import moment from "moment"
import lodash from "lodash"

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
let Lolicon_KEY = new RegExp(`^来\\s?(${NumReg})?(张|份|点)(.*)(涩|色|瑟)(图|圖)`)

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

        if (num) num = this.translateChinaNum(num[0])
        else num = 1

        // 限制num最大值为20
        if (num > 20) {
            return e.reply("[WARN] 先生，冲太多会炸膛！")
        } else if (num === 0) {
            return e.reply("你TM故意找茬是不是？")
        } else if (num === "" || num === null) {
            num = 1
        }

        await e.reply("[LoliconAPI] 少女祈祷中…")

        // 三元表达式
        let r18Value = e.isGroup ? (e.isMaster ? config.r18_Master : config.r18) : (e.isMaster ? config.r18_Master : 2)
        let tagValue = tag || lodash.sample(random_pic)
        let url = `https://api.lolicon.app/setu/v2?proxy=${config.proxy}&size=${config.size}&r18=${r18Value}&tag=${tagValue}&excludeAI=${config.excludeAI}&num=${num}`

        try {
            let response = await fetch(url)

            let result = await response.json()
            if (Array.isArray(result.data) && result.data.length === 0) {
                return e.reply("[LoliconAPI] 未获取到相关数据！")
            }

            let msgs = []
            let successCount = 0
            let failureCount = 0
            for (let item of result.data) {
                try {
                    let isValid = await checkImageURL(item.urls.original)
                    if (isValid) {
                        successCount++
                        let msg = [
                            "标题：" + item.title + "\n",
                            "画师：" + item.author + "\n",
                            "Pid：" + item.pid + "\n",
                            "R18：" + item.r18 + "\n",
                            "Tag：" + item.tags.join("，") + "\n",
                            segment.image(item.urls.original)
                        ]
                        msgs.push(msg)
                    } else {
                        failureCount++
                        // 如果图片 URL 无效，可以在这里添加操作（懒得写了
                    }
                } catch (error) {
                    console.error(error)
                }
            }

            // 图片仅有一张且失败的处理
            if (successCount === 0 && failureCount === 1) return e.reply("[LoliconAPI] 获取图片失败！")

            // 图片仅有一张就不输出这条了，碍眼
            if (!(successCount === 1 && failureCount === 0)) msgs.push(`[LoliconAPI] 获取图片成功 ${successCount} 张，失败 ${failureCount} 张~`)

            // 制作并发送转发消息
            await e.reply(await this.makeForwardMsg(e, msgs))
        } catch (error) {
            // 错误信息
            console.error(error)
            await e.reply("[LoliconAPI] 请检查网络环境！")
        }
    }

    /**
     * 制作转发消息
     * @param {Array} msgs 转发内容
     */
    async makeForwardMsg(e, msgs) {
        /** 转发人昵称 */
        let nickname = e.nickname
        /** 转发人QQ */
        let user_id = e.user_id

        let userInfo = {
            user_id,
            nickname
        }

        let forwardMsg = []
        for (let msg of msgs) {
            forwardMsg.push({
                ...userInfo,
                message: msg
            })
        }

        /** 制作转发内容 */
        if (this.e.isGroup) {
            forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
        } else {
            forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
        }

        /** 处理描述 */
        forwardMsg.data = forwardMsg.data
            .replace(/\n/g, "")
            .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, "___")
            .replace(/___+/, `<title color="#777777" size="26">[-----LoliconAPI-----]</title>`)
        return forwardMsg
    }

    // ------------------------------------------------- 以下代码copy自椰羊，仅做略微修改 -------------------------------------------------

    /**
     * @description: 使用JS将数字从汉字形式转化为阿拉伯形式
     * @param {string} convert
     * @return {number}
     */
    translateChinaNum(convert) {
        if (!convert && convert != 0) return convert
        // 如果是纯数字直接返回
        if (/^\d+$/.test(convert)) return Number(convert)
        // 字典
        let map = new Map()
        map.set("一", 1)
        map.set("壹", 1) // 特殊
        map.set("二", 2)
        map.set("两", 2) // 特殊
        map.set("三", 3)
        map.set("四", 4)
        map.set("五", 5)
        map.set("六", 6)
        map.set("七", 7)
        map.set("八", 8)
        map.set("九", 9)
        // 按照亿、万为分割将字符串划分为三部分
        let split = ""
        split = convert.split("亿")
        let s_1_23 = split.length > 1 ? split : ["", convert]
        let s_23 = s_1_23[1]
        let s_1 = s_1_23[0]
        split = s_23.split("万")
        let s_2_3 = split.length > 1 ? split : ["", s_23]
        let s_2 = s_2_3[0]
        let s_3 = s_2_3[1]
        let arr = [s_1, s_2, s_3]

        // -------------------------------------------------- 对各个部分处理 --------------------------------------------------
        arr = arr.map(item => {
            let result = ""
            result = item.replace("零", "")
            // [ "一百三十二", "四千五百", "三千二百一十三" ] ==>
            let reg = new RegExp(`[${Array.from(map.keys()).join("")}]`, "g")
            result = result.replace(reg, substring => {
                return map.get(substring)
            })
            // [ "1百3十2", "4千5百", "3千2百1十3" ] ==> ["0132", "4500", "3213"]
            let temp
            temp = /\d(?=千)/.exec(result)
            let thousand = temp ? temp[0] : "0"
            temp = /\d(?=百)/.exec(result)
            let hundred = temp ? temp[0] : "0"
            temp = /\d?(?=十)/.exec(result)
            let ten
            if (temp === null) { // 说明没十：一百零二
                ten = "0"
            } else if (temp[0] === "") { // 说明十被简写了：十一
                ten = "1"
            } else { // 正常情况：一百一十一
                ten = temp[0]
            }
            temp = /\d$/.exec(result)
            let num = temp ? temp[0] : "0"
            return thousand + hundred + ten + num
        })
        // 借助parseInt自动去零
        return parseInt(arr.join(""))
    }
}

async function checkImageURL(url) {
    try {
        let response = await fetch(url, { method: "HEAD" })
        return response.ok
    } catch (error) {
        return false
    }
}