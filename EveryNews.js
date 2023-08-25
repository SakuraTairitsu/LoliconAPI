import plugin from "../../lib/plugins/plugin.js"
import schedule from "node-schedule"
import { Group } from "icqq"

// 仅作图片API更换及兼容icqq 源码：https://github.com/MuXia-0326/YunzaiBotJsPluginMuXia

/** 推送北京时间（*-代表任意值 ？-不指定值，仅日期和星期域支持该字符.
    *  *  *  *  *  *
    ┬  ┬  ┬  ┬  ┬  ┬
    │  │  │  │  │  |
    │  │  │  │  │  └ 星期几，取值：0 - 7，其中 0 和 7 都表示是周日
    │  │  │  │  └─── 月份，取值：1 - 12
    │  │  │  └────── 日期，取值：1 - 31
    │  │  └───────── 时，取值：0 - 23
    │  └──────────── 分，取值：0 - 59
    └─────────────── 秒，取值：0 - 59（可选）
*/
const pushTime = "59 59 7 * * ?"

/**
 * 开启定时推送的群号
 * 单个群号：["123456789"]
 * 多个群号：["123456789","987654321"]
 */
const groupNumberList = []

/** 日报图片API */
const newsUrl = `https://api.03c3.cn/zb`

dayPushTask()

export class day60sNews extends plugin {
    constructor() {
        super({
            name: "EveryNews",
            dsc: "",
            event: "message.group",
            priority: 0,
            rule: [{
                reg: "^(今日)?(日报|新闻)$",
                fnc: "get60sDayNews",
                log: false
            }]
        })
    }

    async get60sDayNews(e) {
        send60sDayNews(e)
    }
}

function dayPushTask() {
    schedule.scheduleJob(pushTime, () => {
        for (var i = 0; i < groupNumberList.length; i++) {
            let group = Bot.pickGroup(groupNumberList[i])
            send60sDayNews(group)
        }
    })
}

async function send60sDayNews(e) {
    const msg = segment.image(newsUrl)
    if (e instanceof Group) {
        return e.sendMsg(msg)
    } else {
        return e.reply(msg)
    }
}