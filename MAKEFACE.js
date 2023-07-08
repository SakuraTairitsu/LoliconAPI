import plugin from '../../lib/plugins/plugin.js'

const Key = 'https://api.caonm.net/'

export class face extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'makeFace',
            /** 功能描述 */
            dsc: '表情制作',
            event: 'message',
            priority: 0,
            rule: [
                {
                    reg: '^猫羽雫?(.*)气象$',
                    fnc: 'Weather'
                },
                {
                    reg: '^日历$',
                    fnc: 'Mouth'
                },
                {
                    reg: '^漫图$',
                    fnc: 'Anime_Pic'
                },
                {
                    reg: '^二维码生成(.*)$',
                    fnc: 'Code'
                },
                {
                    reg: '^(.*)处男证|处男证(.*)$',
                    fnc: 'Virgin'
                },
                {
                    reg: '^(.*)泡妞证|泡妞证(.*)$',
                    fnc: 'ChaseAfterGirls'
                },
                {
                    reg: '^(.*)老婆证|老婆证(.*)$',
                    fnc: 'Wife'
                },
                {
                    reg: '^(.*)老公证|老公证(.*)$',
                    fnc: 'Husband'
                },
                {
                    reg: '^(.*)女权证|女权证(.*)$',
                    fnc: 'Strong_Woman'
                },
                {
                    reg: '^(.*)光棍证|光棍证(.*)$',
                    fnc: 'Singlehood'
                },
                {
                    reg: '^(.*)老司机证|老司机证(.*)$',
                    fnc: 'Driver'
                },
                {
                    reg: '^(.*)仙女证|仙女证(.*)$',
                    fnc: 'Sister'
                },
                {
                    reg: '^(.*)屌丝证|屌丝证(.*)$',
                    fnc: 'DS'
                },
                {
                    reg: '^(.*)美女证|美女证(.*)$',
                    fnc: 'Beauty'
                },
                {
                    reg: '^(.*)帅哥证|帅哥证(.*)$',
                    fnc: 'Handsome_Boy'
                },
                {
                    reg: '^(.*)世界首富证|世界首富证(.*)$',
                    fnc: 'NB'
                },
                {
                    reg: '^(.*)订婚证|订婚证(.*)$',
                    fnc: 'Betrothal_certificate'
                },
                {
                    reg: '^(.*)白富美证|白富美证(.*)$',
                    fnc: 'NB_Woman'
                },
                {
                    reg: '^(.*)高富帅证|高富帅证(.*)$',
                    fnc: 'NB_Man'
                },
                {
                    reg: '^(.*)基友证|基友证(.*)$',
                    fnc: 'Gay'
                },
                {
                    reg: '^(.*)炸虾球|炸虾球(.*)$',
                    fnc: 'Fish'
                },
                {
                    reg: '^(.*)启动|启动(.*)$',
                    fnc: 'Activate'
                },
                {
                    reg: '^(.*)女同|女同(.*)$',
                    fnc: 'GirlGay'
                },
                {
                    reg: '^(.*)男同|男同(.*)$',
                    fnc: 'BoyGay'
                },
                {
                    reg: '^(.*)体操服举牌|体操服举牌(.*)$',
                    fnc: 'RaiseCard'
                },
                {
                    reg: '^(.*)传球|传球(.*)$',
                    fnc: 'Pass'
                },
                {
                    reg: '^(.*)黑白|黑白(.*)$',
                    fnc: 'Black'
                },
                {
                    reg: '^(.*)骗子|骗子(.*)$',
                    fnc: 'Cheater'
                },
                {
                    reg: '^(.*)冠军|冠军(.*)$',
                    fnc: 'Champion'
                },
                {
                    reg: '^(.*)女装协议|女装协议(.*)$',
                    fnc: 'Agreement'
                },
                {
                    reg: '^(.*)和泉纱雾举牌|和泉纱雾举牌(.*)$',
                    fnc: 'IzumiSagiri'
                },
                {
                    reg: '^(.*)啊|啊(.*)$',
                    fnc: 'A'
                },
                {
                    reg: '^(.*)踹|踹(.*)$',
                    fnc: 'Holds'
                },
                {
                    reg: '^(.*)思|思(.*)$',
                    fnc: 'Miss'
                },
                {
                    reg: '^(.*)奠|奠(.*)$',
                    fnc: 'Death'
                },
                {
                    reg: '^来(点|张|份)(白丝|(b|B)(s|S))',
                    fnc: 'BS'
                },
                {
                    reg: '^来(点|张|份)(黑丝|(h|H)(s|S))',
                    fnc: 'HS'
                },
                {
                    reg: '龙图',
                    fnc: 'FUCK'
                },
                {
                    reg: '柴郡',
                    fnc: 'Face'
                },
                {
                    reg: '^小(c|C)酱$',
                    fnc: 'Small_C'
                },
                {
                    reg: '^美女举牌(.*)$',
                    fnc: 'MM_Card'
                },
                {
                    reg: '^黑丝举牌(.*)$',
                    fnc: 'HS_Card'
                }
            ]
        })
    }

    // 猫羽雫天气
    async Weather(e) {
        let position = e.msg.match(new RegExp('^猫羽雫?(.*)气象$'))
        if (position) {
            let district = position[1]
            return e.reply(segment.image(`https://api.caonm.net/api/qqtq/t?msg=${district}&type=img&n=1&key=${Key}`))
        }
        return false
    }

    // 日历
    async Mouth(e) {
        return e.reply(segment.image(`https://api.caonm.net/api/ri/li?key=${Key}`))
    }

    // 漫图
    async Anime_Pic(e) {
        return e.reply(segment.image(`https://api.caonm.net/api/dm/index?key=${Key}`))
    }

    // 二维码生成
    async Code(e) {
        let text = e.msg.replace(/二维码生成/g, '')
        if (text) return e.reply(segment.image(`https://api.starchent.top/API/ewm.php?text=${text}&size=512`))
    }

    // 处男证
    async Virgin(e) {
        return generateCertificate(e, '处男证', 'https://api.caonm.net/api/zhen/c30')
    }

    // 泡妞证
    async ChaseAfterGirls(e) {
        return generateCertificate(e, '泡妞证', 'https://api.caonm.net/api/zhen/c14')
    }

    // 老婆证
    async Wife(e) {
        return generateCertificate(e, '老婆证', 'https://api.caonm.net/api/zhen/c13')
    }

    // 老公证
    async Husband(e) {
        return generateCertificate(e, '老公证', 'https://api.caonm.net/api/zhen/c13')
    }

    // 女权证
    async Strong_Woman(e) {
        return generateCertificate(e, '女权证', 'https://api.caonm.net/api/zhen/c12')
    }

    // 光棍证
    async Singlehood(e) {
        return generateCertificate(e, '光棍证', 'https://api.caonm.net/api/zhen/c11')
    }

    // 老司机证
    async Driver(e) {
        return generateCertificate(e, '老司机证', 'https://api.caonm.net/api/zhen/c10')
    }

    // 仙女证
    async Sister(e) {
        return generateCertificate(e, '仙女证', 'https://api.caonm.net/api/zhen/c9')
    }

    // 屌丝证
    async DS(e) {
        return generateCertificate(e, '屌丝证', 'https://api.caonm.net/api/zhen/c8')
    }

    // 美女证
    async Beauty(e) {
        return generateCertificate(e, '美女证', 'https://api.caonm.net/api/zhen/c7')
    }

    // 帅哥证
    async Handsome_Boy(e) {
        return generateCertificate(e, '帅哥证', 'https://api.caonm.net/api/zhen/c6')
    }

    // 世界首富证
    async NB(e) {
        return generateCertificate(e, '世界首富证', 'https://api.caonm.net/api/zhen/c5')
    }

    // 订婚证
    async Betrothal_certificate(e) {
        return generateCertificate(e, '订婚证', 'https://api.caonm.net/api/zhen/c4')
    }

    // 白富美证
    async NB_Woman(e) {
        return generateCertificate(e, '白富美证', 'https://api.caonm.net/api/zhen/c3')
    }

    // 高富帅证
    async NB_Man(e) {
        return generateCertificate(e, '高富帅证', 'https://api.caonm.net/api/zhen/c2')
    }

    // 基友证
    async Gay(e) {
        return generateCertificate(e, '基友证', 'https://api.caonm.net/api/zhen/c1')
    }

    // 炸虾球
    async Fish(e) {
        return generateCertificate(e, '炸虾球', 'https://api.f4team.cn/API/face_yu/')
    }

    // 启动
    async Activate(e) {
        return generateCertificate(e, '启动', 'https://api.caonm.net/api/op/o')
    }

    // 女同
    async GirlGay(e) {
        return generateCertificate(e, '女同', 'https://api.caonm.net/api/asc/c66')
    }

    // 男同
    async BoyGay(e) {
        return generateCertificate(e, '男同', 'https://api.caonm.net/api/asc/c6')
    }

    // 体操服举牌
    async RaiseCard(e) {
        return generateCertificate(e, '体操服举牌', 'https://api.caonm.net/api/jupai/m')
    }

    // 传球
    async Pass(e) {
        return generateCertificate(e, '传球', 'https://api.caonm.net/api/ikun/a')
    }

    // 黑白
    async Black(e) {
        return generateCertificate(e, '黑白', 'https://api.f4team.cn/API/yi/')
    }

    // 骗子
    async Cheater(e) {
        return generateCertificate(e, '骗子', 'https://api.caonm.net/api/pianzi/c')
    }

    // 冠军
    async Champion(e) {
        return generateCertificate(e, '冠军', 'https://api.caonm.net/api/daoguan/c')
    }

    // 女装协议
    async Agreement(e) {
        return generateCertificate(e, '女装协议', 'https://api.caonm.net/api/jqxy/n')
    }

    // 和泉纱雾举牌
    async IzumiSagiri(e) {
        return generateCertificate(e, '和泉纱雾举牌', 'https://api.caonm.net/api/wus/w')
    }

    // 啊
    async A(e) {
        return generateCertificate(e, '啊', 'https://api.caonm.net/api/asc/c7')
    }

    // 踹
    async Holds(e) {
        return generateCertificate(e, '踹', 'https://api.caonm.net/api/zt/ti_2')
    }

    // 思
    async Miss(e) {
        return generateCertificate(e, '思', 'https://api.f4team.cn/API/face_thsee/')
    }

    // 奠
    async Death(e) {
        return generateCertificate(e, '奠', 'https://api.caonm.net/api/zt/ji')
    }

    // 白丝
    async BS(e) {
        await e.reply(segment.image(`https://api.caonm.net/api/bhs/b?key=${Key}`))
        return true
    }

    // 黑丝
    async HS(e) {
        await e.reply(segment.image(`https://api.caonm.net/api/bhs/h?key=${Key}`))
        return true
    }

    // 龙图
    async FUCK(e) {
        await e.reply(segment.image(`https://api.caonm.net/api/long/l?key=${Key}`))
        return true
    }

    // 柴郡猫猫
    async Face(e) {
        await e.reply(segment.image(`https://api.caonm.net/api/chai/c?key=${Key}`))
        return true
    }

    // 小C酱
    async Small_C(e) {
        await e.reply(segment.image(`https://api.caonm.net/api/xc/index?key=${Key}`))
        return true
    }

    // 美女举牌
    async MM_Card(e) {
        let match = e.msg.match(/^美女举牌(.*)$/)
        if (match) {
            let content = match[1].trim()
            let msgs = content.split(' ')
            if (msgs.length < 1) return
            if (msgs.length <= 3 && msgs.every(msg => msg.length <= 5)) {
                let msg = msgs.join('[换行]')
                return e.reply(segment.image(`https://api.caonm.net/api/jupai/j?msg=${encodeURIComponent(msg)}&key=${Key}`))
            }
        }
        return e.reply('[WARN] 字数超出限制或格式错误！')
    }

    // 桑帛黑丝举牌
    // async HS_Card(e) {
    //     let match = e.msg.match(/^黑丝举牌(.*)$/)
    //     if (match) {
    //         let content = match[1].trim()
    //         let msgs = content.split(' ')
    //         if (msgs.length < 1) return
    //         if (msgs.length <= 4 && msgs.every(msg => msg.length <= 6)) {
    //             let msg = msgs.join('\\n')
    //             return e.reply(segment.image(`https://api.caonm.net/api/jupai/j2?msg=${encodeURIComponent(msg)}&key=${Key}`))
    //         }
    //     }
    //     return e.reply('[WARN] 字数超出限制或格式错误！')
    // }

    // 星创黑丝举牌
    async HS_Card(e) {
        let match = e.msg.match(/^黑丝举牌(.*)$/)
        if (match) {
            let content = match[1].trim()
            if (content === '') {
                return e.reply('[WARN] 请输入举牌内容！')
            }
            let msgs = content.split(' ')
            if (msgs.length <= 3 && msgs.every(msg => msg.length <= 5)) {
                let msg = msgs.map((msg, index) => `&msg${index === 0 ? '' : index}=${msg}`).join('')
                return e.reply(segment.image(`https://api.starchent.top/API/hsjp.php?rgb1=0&rgb2=0&rgb3=0${msg}`))
            } else {
                return e.reply('[WARN] 字数超出限制或格式错误！')
            }
        }
        return false
    }

    /**
     * 制作转发消息
     * @param {string} msg 转发内容
     */
    async makeForwardMsg(msg) {
        let userInfo = {
            nickname: 'MAPLE',
            user_id: 2523148477
        }

        let forwardMsg = [{
            ...userInfo,
            message: msg
        }]

        /** 制作转发内容 */
        if (this.e.isGroup) {
            forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
        } else {
            forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
        }

        /** 处理描述 */
        forwardMsg.data = forwardMsg.data.replace(/\n/g, '')
            .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
            .replace(/___+/, `<title color="#777777" size="26">「欲望养厉鬼」</title>`)
        return forwardMsg
    }
}

async function generateCertificate(e, type, url) {
    // 艾特对象为Bot终止运行
    if (e.atBot) return false
    // 消息中包含@某人的操作
    if ((e.message[0] && e.message[0].type == 'at') || (e.message[1] && e.message[1].type == 'at')) {
        if (type === '老婆证') {
            return e.reply(segment.image(`${url}?qq=${e.at}&qq2=${e.user_id}&key=${Key}`))
        } else if (type === '老公证') {
            return e.reply(segment.image(`${url}?qq=${e.user_id}&qq2=${e.at}&key=${Key}`))
        } else if (type === '思' || type === '黑白' || type === '炸虾球') {
            return e.reply(segment.image(`${url}?QQ=${e.at}`))
        } else {
            return e.reply(segment.image(`${url}?qq=${e.at}&key=${Key}`))
        }
    }
    // replace方法替换字符串
    let QQNumber = e.msg.replace(new RegExp(`^((.*)${type}|${type}(.*))$`), '$2$3')
    // 自动去空格
    QQNumber = QQNumber.replace(/ /g, '')
    // 限制长度至少为5且最长为10
    if (Number.isInteger(Number(QQNumber)) && QQNumber.length >= 5 && QQNumber.length <= 10) {
        // 请求
        if (type === '老婆证') {
            return e.reply(segment.image(`${url}?qq=${QQNumber}&qq2=${e.user_id}&key=${Key}`))
        } else if (type === '老公证') {
            return e.reply(segment.image(`${url}?qq=${e.user_id}&qq2=${QQNumber}&key=${Key}`))
        } else if (type === '思' || type === '黑白' || type === '炸虾球') {
            return e.reply(segment.image(`${url}?QQ=${QQNumber}`))
        } else {
            return e.reply(segment.image(`${url}?qq=${QQNumber}&key=${Key}`))
        }
    } else {
        return false
    }
}