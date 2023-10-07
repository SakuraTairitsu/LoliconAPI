import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js'
import fs from 'node:fs'
import yaml from 'yaml'
import path from 'path'

var blackListTriggered = false

const _path = process.cwd()
const file = './config/config/qq.yaml'
const Bot = yaml.parse(fs.readFileSync(file, 'utf8'))

const cacheDirs = [{
    name: 'data/image/',
    path: `${_path}/data/icqq/${Bot.qq}/image/`,
    clearReg: /^[a-z0-9]{8}|[a-z0-9]{16}|[a-z0-9]{32}$/,
}]

/** 开启Bot提示 */
const ON_TIP = '你好，你好，大家好'

/** 关闭Bot提示 */
const CLOSE_TIP = '祝你拥有愉快的一天，再见'

export class MAPLETOOLS extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'MAPLETOOLS',
            /** 功能描述 */
            dsc: '小工具',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 0,
            rule: [
                {
                    reg: '^#?字符串搜索(.*)$', //在云崽根目录下遍历所有文件查找指定字符串
                    fnc: 'SearchFiles',
                },
                {
                    reg: '^#?(今日)?(日报|新闻)$',
                    fnc: 'News',
                },
                {
                    reg: '^#?(加|拉)黑(名单)?(.*)$',
                    fnc: 'addBlackList',
                    permission: 'master',
                },
                {
                    reg: '^#?(查看)?黑名单(列表)?$',
                    fnc: 'BlackList',
                    permission: 'master',
                },
                {
                    reg: '^#?删(除)?黑(名单)?(.*)$',
                    fnc: 'delBlackList',
                    permission: 'master',
                },
                {
                    reg: '^#?(启动|开启)机器人$',
                    fnc: 'Power_ON',
                    permission: 'master',
                },
                {
                    reg: '^#?关闭机器人$',
                    fnc: 'Power_Off',
                    permission: 'master',
                },
                {
                    reg: '^#?清理缓存文件$',
                    fnc: 'clearCache',
                    permission: 'master',
                }
            ]
        })
    }

    /** SearchFiles */
    async SearchFiles(e) {
        if (e.isGroup) return e.reply('[WARN] 请私聊使用！')
        const searchString = e.msg.match(/^#?字符串搜索(.*)$/)?.[1]
        if (searchString) {
            await e.reply('[WAIT] 正在搜索：' + searchString)

            const startTime = Date.now()
            const folderPath = _path
            const resultFiles = await searchInFiles(folderPath, searchString)
            const endTime = Date.now()
            const duration = (endTime - startTime) / 1000

            if (resultFiles.length > 0) {
                resultFiles.unshift('找到以下文件包含目标字符串')
                resultFiles.push(`本次搜索用时 ${duration} 秒`)
                return e.reply(await common.makeForwardMsg(e, resultFiles, '[SearchFiles]'))
            } else {
                return e.reply('[WARN] 未找到包含目标字符串的文件')
            }
        } else {
            return e.reply('[WARN] 未提供有效的字符串')
        }
    }

    /** 日报 */
    async News(e) {
        return e.reply(segment.image('https://api.03c3.cn/zb'), e.isGroup ? true : false)
    }

    /** 加黑名单 */
    async addBlackList(e) {
        if (!e.atBot || e.isGroup) {
            if ((e.message[0] && e.message[0].type == 'at') || (e.message[1] && e.message[1].type == 'at')) {
                const config = getConfig()
                if (config.masterQQ.includes(e.at)) return e.reply('？')
                const Memberinfo = e.group.pickMember(Number(e.at)).info
                if (config.blackQQ.includes(e.at)) return e.reply(`已存在黑名单：\n${Memberinfo.nickname}(${e.at})`)

                addToBlackList(config, e.at)
                return e.reply(`已将${Memberinfo.nickname}(${e.at})拉黑！`)
            }
        }
        const QQNumber = e.msg.replace(new RegExp(`^#?(加|拉)黑(名单)?(.*)$`), '$3').replace(/ /g, '')
        if (Number.isInteger(Number(QQNumber)) && QQNumber.length >= 5 && QQNumber.length <= 10) {
            const config = getConfig()
            // 检查输入的 QQ 号是否是主人
            if (config.masterQQ.includes(Number(QQNumber))) return e.reply('？')
            if (config.blackQQ.includes(Number(QQNumber))) return e.reply(`已存在黑名单：${QQNumber}`)

            addToBlackList(config, Number(QQNumber))
            return e.reply(`已将 ${QQNumber} 拉黑！`)
        }
        return false
    }

    /** 黑名单 */
    async BlackList(e) {
        const config = getConfig()
        const blackQQList = config.blackQQ
        if (blackQQList.length === 0) return e.reply('黑名单为空！')
        let replyStr = ''
        if (e.isGroup) {
            // 在群组内触发指令
            for (let i = 0; i < blackQQList.length; i++) {
                const member = e.group.pickMember(blackQQList[i]).info
                replyStr += member ? `${i + 1}-${member.nickname}(${blackQQList[i]})\n` : `${i + 1}-${blackQQList[i]}\n`
            }
        } else {
            // 在私聊中触发指令
            for (let i = 0; i < blackQQList.length; i++) {
                replyStr += `${i + 1}-${blackQQList[i]}\n`
            }
        }
        const msgArray = ['可使用“删黑+序号”取消拉黑', replyStr]
        blackListTriggered = true
        return e.reply(await common.makeForwardMsg(e, msgArray, '[-----黑名单-----]'))
    }

    /** 删黑名单 */
    async delBlackList(e) {
        if (!blackListTriggered) return e.reply('[WARN] 请先查看黑名单列表再执行删除操作！')
        let index = e.msg.replace(new RegExp(`^#?删(除)?黑(名单)?(.*)$`), '$3')
        if (index.trim() === '' || index.trim() === null) return false
        index = parseInt(index)

        const config = getConfig()
        const blackQQList = config.blackQQ
        if (isNaN(index) || index < 1 || index > blackQQList.length) return e.reply('[WARN] 请输入正确的序号！')

        const deletedQQ = blackQQList.splice(index - 1, 1)
        writeConfig(config)
        return e.reply(`已取消拉黑：${deletedQQ}`)
    }

    /** 开机 */
    async Power_ON(e) {
        if (!e.isGroup) return e.reply('[WARN]请在群聊中使用！')
        const file = './config/config/group.yaml'
        const data = yaml.parse(await fs.promises.readFile(file, 'UTF8'))
        data[e.group_id] = { enable: null }
        const newyaml = yaml.stringify(data)
        await fs.promises.writeFile(file, newyaml, 'UTF8')
        return e.reply(ON_TIP)
    }

    /** 关机 */
    async Power_Off(e) {
        if (!e.isGroup) return e.reply('[WARN]请在群聊中使用！')
        const file = './config/config/group.yaml'
        const data = yaml.parse(await fs.promises.readFile(file, 'UTF8'))
        data[e.group_id] = { enable: ['MAPLETOOLS',] }
        const newYaml = yaml.stringify(data)
        await fs.promises.writeFile(file, newYaml, 'UTF8')
        return e.reply(CLOSE_TIP)
    }

    /** 清理缓存文件 */
    async clearCache(e) {
        let dataCount = 0
        await Promise.all(cacheDirs.map(async (dirItem) => {
            await e.reply(`开始清理${dirItem.name}缓存文件…`)
            const cacheFiles = await fs.promises.readdir(dirItem.path, { withFileTypes: true })
            const filesToClear = cacheFiles.filter(file => new RegExp(dirItem.clearReg).test(file.name))
            await Promise.all(filesToClear.map(file => fs.promises.unlink(path.join(dirItem.path, file.name))))
            dataCount += filesToClear.length
        }))
        return e.reply(`[Success] 清理完成，共清理缓存文件：${dataCount}个！`)
    }
}

function ReadYaml(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const config = yaml.parse(fileContent)
    return config
}

function getConfig() {
    // 读取yaml文件
    const config = readConfig()
    if (!Array.isArray(config.blackQQ)) {
        config.blackQQ = []
    }
    if (!Array.isArray(config.whiteGroup)) {
        config.whiteGroup = []
    }
    if (!Array.isArray(config.blackGroup)) {
        config.blackGroup = []
    }
    return config
}

function addToBlackList(config, qq) {
    config.blackQQ.push(qq)
    // 写入配置文件
    writeConfig(config)
}

function readConfig() {
    return ReadYaml(`${process.cwd()}/config/config/other.yaml`)
}

function writeConfig(config) {
    // 将 config 对象转换为 YAML 字符串
    const yamlStr = yaml.stringify(config)
    // 将 YAML 字符串写入文件
    fs.writeFileSync(`${process.cwd()}/config/config/other.yaml`, yamlStr, 'utf8')
}

async function searchInFiles(folderPath, searchString) {
    const results = []
    const queue = [folderPath]

    while (queue.length > 0) {
        const currentPath = queue.shift()
        try {
            const files = await fs.promises.readdir(currentPath)

            for (const file of files) {
                const filePath = path.join(currentPath, file)
                const stat = await fs.promises.stat(filePath)

                if (stat.isDirectory()) {
                    queue.push(filePath)
                } else if (stat.isFile()) {
                    const match = await searchFile(filePath, searchString)
                    if (match) {
                        results.push(filePath)
                    }
                }
            }
        } catch (err) {
            logger.warn(`Error while processing ${currentPath}: ${err.message}`)
        }
    }
    return results
}

async function searchFile(filePath, searchString) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath, { encoding: 'utf-8' })
        let match = false

        stream.on('data', chunk => {
            if (chunk.includes(searchString)) {
                match = true
                stream.close()
            }
        })

        stream.on('error', err => {
            reject(err)
        })

        stream.on('close', () => {
            resolve(match)
        })
    })
}
