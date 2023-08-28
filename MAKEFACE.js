import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'

// 填写你的API密钥，在https://api.lolimi.cn获取（免费的
const Key = ''

export class makeFace extends plugin {
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
                    reg: '^刷(听歌|音乐)?时长$',
                    fnc: 'Music',
                },
                {
                    reg: '^猫羽雫?(.*)气象$',
                    fnc: 'Weather'
                },
                {
                    reg: '^二维码生成(.*)$',
                    fnc: 'Code'
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
                    reg: '^(.*)奠|奠(.*)$',
                    fnc: 'Death'
                },
                {
                    reg: '^(.*)想|想(.*)$',
                    fnc: 'Want'
                },
                {
                    reg: '^(.*)鸠|鸠(.*)$',
                    fnc: 'Phigros'
                },
                {
                    reg: '^(.*)看|看(.*)$',
                    fnc: 'Look'
                },
                {
                    reg: '^(.*)嗯|嗯(.*)$',
                    fnc: 'En'
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

    /** 刷听歌时长 */
    async Music(e) {
        if (Key === '') return logger.warn('[WARN] 未填写API密钥！')
        /** 判断是否为好友 */
        if (!(e.bot ?? Bot).fl.get(e.user_id)) {
            const response = await fetch(`https://api.lolimi.cn/api/pa/pa?qq=${e.user_id}&key=${Key}`)
            let msg
            if (response.ok) {
                msg = [
                    segment.at(e.user_id),
                    segment.image(`https://api.lolimi.cn/api/pa/pa?qq=${e.user_id}&key=${Key}`)
                ]
            } else {
                msg = [
                    segment.at(e.user_id),
                    ' 爬！'
                ]
            }
            return e.reply(msg)
        } else {
            const response = await fetch(`https://api.lolimi.cn/api/qq/mus?qq=${e.user_id}&key=${Key}`)
            if (!response.ok) return false
            let text = await response.text()
            text = text.replace(`QQ：${e.user_id}`, `QQ：${e.nickname}(${e.user_id})`).replace('运行结果： ', '运行结果：').replace('成功！', '成功！\n').replace('已经', '已')
            return e.reply(text, true, { recallMsg: 120 })
        }
    }

    // 猫羽雫天气
    async Weather(e) {
        let position = e.msg.match(new RegExp('^猫羽雫?(.*)气象$'))
        if (position) {
            let district = position[1]
            return await detection(e, `https://api.lolimi.cn/api/qqtq/t?msg=${district}&key=${Key}`)
        }
        return false
    }

    // 二维码生成
    async Code(e) {
        const text = e.msg.replace(/二维码生成/g, '')
        if (text) return await detection(e, `https://api.starchent.top/API/ewm.php?text=${text}&size=512`)
    }

    // 日历
    async Mouth(e) {
        return await detection(e, `https://api.lolimi.cn/api/ri/li?key=${Key}`)
    }

    // 漫图
    async Anime_Pic(e) {
        return await detection(e, `https://api.lolimi.cn/api/dm/index?key=${Key}`)
    }

    // 白丝
    async BS(e) {
        return await detection(e, `https://api.lolimi.cn/api/bhs/b?key=${Key}`)
    }

    // 黑丝
    async HS(e) {
        return await detection(e, `https://api.lolimi.cn/api/bhs/h?key=${Key}`)
    }

    // 龙图
    async FUCK(e) {
        return await detection(e, `https://api.lolimi.cn/api/long/l?key=${Key}`)
    }

    // 柴郡猫猫
    async Face(e) {
        return await detection(e, `https://api.lolimi.cn/api/chai/c?key=${Key}`)
    }

    // 小C酱
    async Small_C(e) {
        return await detection(e, `https://api.lolimi.cn/api/xc/index?key=${Key}`)
    }

    // 处男证
    async Virgin(e) {
        return generateCertificate(e, '处男证', 'https://api.lolimi.cn/api/zhen/c30')
    }

    // 泡妞证
    async ChaseAfterGirls(e) {
        return generateCertificate(e, '泡妞证', 'https://api.lolimi.cn/api/zhen/c14')
    }

    // 老婆证
    async Wife(e) {
        return generateCertificate(e, '老婆证', 'https://api.lolimi.cn/api/zhen/c13')
    }

    // 老公证
    async Husband(e) {
        return generateCertificate(e, '老公证', 'https://api.lolimi.cn/api/zhen/c13')
    }

    // 女权证
    async Strong_Woman(e) {
        return generateCertificate(e, '女权证', 'https://api.lolimi.cn/api/zhen/c12')
    }

    // 光棍证
    async Singlehood(e) {
        return generateCertificate(e, '光棍证', 'https://api.lolimi.cn/api/zhen/c11')
    }

    // 老司机证
    async Driver(e) {
        return generateCertificate(e, '老司机证', 'https://api.lolimi.cn/api/zhen/c10')
    }

    // 仙女证
    async Sister(e) {
        return generateCertificate(e, '仙女证', 'https://api.lolimi.cn/api/zhen/c9')
    }

    // 屌丝证
    async DS(e) {
        return generateCertificate(e, '屌丝证', 'https://api.lolimi.cn/api/zhen/c8')
    }

    // 美女证
    async Beauty(e) {
        return generateCertificate(e, '美女证', 'https://api.lolimi.cn/api/zhen/c7')
    }

    // 帅哥证
    async Handsome_Boy(e) {
        return generateCertificate(e, '帅哥证', 'https://api.lolimi.cn/api/zhen/c6')
    }

    // 世界首富证
    async NB(e) {
        return generateCertificate(e, '世界首富证', 'https://api.lolimi.cn/api/zhen/c5')
    }

    // 订婚证
    async Betrothal_certificate(e) {
        return generateCertificate(e, '订婚证', 'https://api.lolimi.cn/api/zhen/c4')
    }

    // 白富美证
    async NB_Woman(e) {
        return generateCertificate(e, '白富美证', 'https://api.lolimi.cn/api/zhen/c3')
    }

    // 高富帅证
    async NB_Man(e) {
        return generateCertificate(e, '高富帅证', 'https://api.lolimi.cn/api/zhen/c2')
    }

    // 基友证
    async Gay(e) {
        return generateCertificate(e, '基友证', 'https://api.lolimi.cn/api/zhen/c1')
    }

    // 启动
    async Activate(e) {
        return generateCertificate(e, '启动', 'https://api.lolimi.cn/api/op/o')
    }

    // 女同
    async GirlGay(e) {
        return generateCertificate(e, '女同', 'https://api.lolimi.cn/api/asc/c66')
    }

    // 男同
    async BoyGay(e) {
        return generateCertificate(e, '男同', 'https://api.lolimi.cn/api/asc/c6')
    }

    // 体操服举牌
    async RaiseCard(e) {
        return generateCertificate(e, '体操服举牌', 'https://api.lolimi.cn/api/jupai/m')
    }

    // 传球
    async Pass(e) {
        return generateCertificate(e, '传球', 'https://api.lolimi.cn/api/ikun/a')
    }

    // 骗子
    async Cheater(e) {
        return generateCertificate(e, '骗子', 'https://api.lolimi.cn/api/pianzi/c')
    }

    // 冠军
    async Champion(e) {
        return generateCertificate(e, '冠军', 'https://api.lolimi.cn/api/daoguan/c')
    }

    // 女装协议
    async Agreement(e) {
        return generateCertificate(e, '女装协议', 'https://api.lolimi.cn/api/jqxy/n')
    }

    // 和泉纱雾举牌
    async IzumiSagiri(e) {
        return generateCertificate(e, '和泉纱雾举牌', 'https://api.lolimi.cn/api/wus/w')
    }

    // 啊
    async A(e) {
        return generateCertificate(e, '啊', 'https://api.lolimi.cn/api/asc/c7')
    }

    // 踹
    async Holds(e) {
        return generateCertificate(e, '踹', 'https://api.lolimi.cn/api/zt/ti_2')
    }

    // 奠
    async Death(e) {
        return generateCertificate(e, '奠', 'https://api.lolimi.cn/api/zt/ji')
    }

    // 想
    async Want(e) {
        return generateCertificate(e, '想', 'https://api.lolimi.cn/api/xiang/x_1')
    }

    // 鸠
    async Phigros(e) {
        return generateCertificate(e, '鸠', 'https://api.lolimi.cn/api/kan/kan')
    }

    // 看
    async Look(e) {
        return generateCertificate(e, '看', 'https://api.lolimi.cn/api/kan/kan_3')
    }

    // 嗯
    async En(e) {
        return generateCertificate(e, '嗯', 'https://api.lolimi.cn/api/kan/kan_4')
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
                return await detection(e, `https://api.lolimi.cn/api/jupai/j?msg=${encodeURIComponent(msg)}&key=${Key}`)
            }
        }
        return e.reply('[WARN] 字数超出限制或格式错误！')
    }

    // 黑丝举牌
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
                return await detection(e, `https://api.starchent.top/API/hsjp.php?rgb1=0&rgb2=0&rgb3=0${msg}`)
            } else {
                return e.reply('[WARN] 字数超出限制或格式错误！')
            }
        }
        return false
    }
}

async function generateCertificate(e, type, url) {
    try {
    // 艾特对象为Bot终止运行
    if (e.atBot) return false
    // 消息中包含@某人的操作
    if ((e.message[0] && e.message[0].type == 'at') || (e.message[1] && e.message[1].type == 'at')) {
        if (type === '老婆证') {
            return await detection(e, `${url}?qq=${e.at}&qq2=${e.user_id}&key=${Key}`)
        } else if (type === '老公证') {
            return await detection(e, `${url}?qq=${e.user_id}&qq2=${e.at}&key=${Key}`)
        } else {
            return await detection(e, `${url}?qq=${e.at}&key=${Key}`)
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
            return await detection(e, `${url}?qq=${QQNumber}&qq2=${e.user_id}&key=${Key}`)
        } else if (type === '老公证') {
            return await detection(e, `${url}?qq=${e.user_id}&qq2=${QQNumber}&key=${Key}`)
        } else {
            return await detection(e, `${url}?qq=${QQNumber}&key=${Key}`)
        }
    } else {
        return false
    }
} catch {
    return false
}
}

async function detection(e, imageUrl) {
    try {
        if (Key === '') return logger.warn('未填写API密钥！')
        const response = await fetch(imageUrl)
        if (response.ok) {
            logger.info(imageUrl)
            return e.reply(segment.image(imageUrl))
        } else {
            logger.warn('请检查网络环境，大概率API寄了！')
            return false
        }
    } catch {
        return false
    }
}
