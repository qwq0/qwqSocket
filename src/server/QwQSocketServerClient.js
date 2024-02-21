import { MappingRules } from "../rule/MappingRules.js";
import { EventHandler } from "../util/EventHandler.js";

/**
 * 连接到 qwq-socket 服务器的客户端实例
 * 绑定到一个服务器上下文
 */
export class QwQSocketServerClient
{
    /**
     * @type {import("./QwQSocketServer").QwQSocketServer}
     */
    #server = null;

    /**
     * 此服务器实例的映射规则
     * 表示服务端触发的事件相关规则
     * @type {MappingRules}
     */
    #serverMappingRules = null;

    /**
     * 客户端的映射规则
     * 表示客户端触发的事件相关规则
     * @type {MappingRules}
     */
    #clientMappingRules = null;

    /**
     * 实例想要发送一个包
     * @type {EventHandler<{ prefix: string, body: Object }>}
     */
    sendData = new EventHandler();

    /**
     * 客户端的自定义数据
     * @type {object}
     */
    data = {};

    /**
     * 事件监听器
     * @type {Object<string, (eventMetaObj: object, client: QwQSocketServerClient) => void>}
     */
    eventListener = {};

    /**
     * 传递给客户端指定服务端事件的简短名的时间
     * 服务端事件名 到 传递时间 映射
     * @type {Map<string, number>}
     */
    #submitServerShortNameTimeMap = new Map();
    /**
     * 已经传递给客户端指定客户端事件简短名的事件集合
     * 客户端事件名 集合
     * @type {Set<string>}
     */
    #submitClientShortNameSet = new Set();

    /**
     * @private
     */
    constructor()
    { }

    /**
     * 创建客户端实例
     * @param {import("./QwQSocketServer").QwQSocketServer} server
     */
    static create(server)
    {
        let ret = new QwQSocketServerClient();
        ret.#server = server;
        ret.#serverMappingRules = server.serverMappingRules;
        ret.#clientMappingRules = server.clientMappingRules;
        return ret;
    }

    /**
     * 触发事件
     * @param {string} eventName
     * @param {object} eventMetaObj
     */
    #triggerLocalEvent(eventName, eventMetaObj)
    {
        let eventListenerFunc = this.eventListener[eventName];
        if (eventListenerFunc)
        {
            try
            {
                eventListenerFunc(eventMetaObj, this);
            }
            catch (err)
            {
                console.error(err);
            }
        }
    }


    /**
     * 收到客户端的数据
     * @param {string} prefix
     * @param {Object} body 
     */
    receiveData(prefix, body)
    {
        if (prefix.length == 0)
            return;
        let prefixFirstCharCode = prefix.charCodeAt(0);
        if (
            (48 <= prefixFirstCharCode && prefixFirstCharCode <= 57) || // 0 - 9
            (97 <= prefixFirstCharCode && prefixFirstCharCode <= 122) // a - z
        )
        { // 以简短名触发事件
            let shortName = prefix;
            let eventRule = this.#serverMappingRules.getRuleByShort(shortName);
            if (!eventRule)
                throw "The short name provided by the client does not exist";
            let eventMetaObj = eventRule.verifyGetArray(body);
            this.#triggerLocalEvent(eventRule.eventName, eventMetaObj);
        }
        else if (prefix[0] == "*")
        { // 以事件名触发事件
            let eventName = prefix.slice(1);
            let eventRule = this.#serverMappingRules.getRuleByName(eventName);
            if (!eventRule)
                throw "The event name provided by the client does not exist";

            if (eventRule.shortName)
            { // 告知对端简短名
                let submitShortNameTime = this.#submitServerShortNameTimeMap.get(eventName);
                let now = Date.now();
                if (submitShortNameTime == undefined)
                {
                    this.sendData.trigger({
                        prefix: "=" + eventName,
                        body: {
                            key: eventRule.metaObjKeyList,
                            short: eventRule.shortName
                        }
                    });
                    this.#submitServerShortNameTimeMap.set(eventName, now);
                }
                else if (submitShortNameTime < now - 60 * 1000)
                    throw "The client knows the short name but does not execute it";
            }

            let eventMetaObj = eventRule.verifyGetObject(body);
            this.#triggerLocalEvent(eventRule.eventName, eventMetaObj);
        }
        else
        {
            throw "protocol error";
        }
    }

    /**
     * 触发对端事件
     * @param {string} eventName
     * @param {object} eventMetaObj
     */
    sendTrigger(eventName, eventMetaObj)
    {
        let eventRule = this.#clientMappingRules.getRuleByName(eventName);
        if (eventRule?.shortName)
        { // 存在简短名
            if (this.#submitClientShortNameSet.has(eventName))
            { // 已经传递简短名
                this.sendData.trigger({
                    prefix: eventRule.shortName,
                    body: eventRule.metaObjToArray(eventMetaObj)
                });
            }
            else
            { // 还未传递简短名
                this.sendData.trigger({
                    prefix: "+" + eventName,
                    body: {
                        short: eventRule.shortName,
                        key: eventRule.metaObjKeyList,
                        value: eventRule.metaObjToArray(eventMetaObj)
                    }
                });
                this.#submitClientShortNameSet.add(eventName);
            }
        }
        else
        { // 不存在简短名
            this.sendData.trigger({
                prefix: "*" + eventName,
                body: eventMetaObj
            });
        }
    }
}