import { EventRule } from "../rule/EventRule.js";
import { MappingRules } from "../rule/MappingRules.js";
import { RuleType } from "../rule/RuleType.js";
import { EventHandler } from "../util/EventHandler.js";

/**
 * 传递服务端事件的短名称 包类型规则
 */
let submitServerShortNameObjRule = RuleType.object({
    key: RuleType.array([], RuleType.string()),
    short: RuleType.string()
});
/**
 * 传递客户端事件的短名称并触发 包类型规则
 */
let submitClientShortNameAndTriggerObjRule = RuleType.object({
    key: RuleType.array([], RuleType.string()),
    short: RuleType.string()
}, {
    value: RuleType.array([], RuleType.any())
});

// TODO 增加 查询操作 的解决方案

/**
 * qwq-socket 客户端
 * 表示 服务器侧 或 用户侧 的客户端实例
 */
export class QwQSocketClient
{
    /**
     * 表示连接到的服务器的事件规则
     * @type {MappingRules}
     */
    #serverMappingRules = new MappingRules();

    /**
     * 表示此客户端触发的事件相关规则
     * @type {MappingRules}
     */
    #clientMappingRules = new MappingRules();

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
     * @type {Object<string, (eventMetaObj: object, client: QwQSocketClient) => void>}
     */
    eventListener = {};

    constructor()
    { }

    /**
     * 添加事件规则
     * @param {string} eventName
     * @param {EventRule} eventRule
     */
    addEventRule(eventName, eventRule)
    {
        this.#clientMappingRules.clientAddEventRule(eventName, eventRule);
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
        switch (prefix[0])
        {
            case "*": {
                // 以事件名触发事件
                let eventName = prefix.slice(1);
                let eventRule = this.#clientMappingRules.getRuleByName(eventName);
                if (!eventRule)
                    throw "The event name provided by the server does not exist";

                let eventMetaObj = eventRule.verifyGetObject(body);
                this.#triggerLocalEvent(eventRule.eventName, eventMetaObj);

                break;
            }
            case "+": {
                if (!submitClientShortNameAndTriggerObjRule.verify(body))
                    throw "The body of the submit client short name packet sent by server has an type error";

                let eventName = prefix.slice(1);
                /**
                 * @type {{
                 *  key: Array<string>,
                 *  short: string,
                 *  value?: Array<any>
                 * }}
                 */
                let infoObj = body;
                let eventRule = this.#clientMappingRules.getRuleByName(eventName);
                if (!eventRule)
                    throw "The event name provided by the server does not exist";
                if (infoObj.short)
                    this.#clientMappingRules.setShortName(infoObj.short, eventRule);
                eventRule.resetKeyList(infoObj.key);
                if (infoObj.value)
                {
                    let eventMetaObj = eventRule.verifyGetArray(infoObj.value);
                    this.#triggerLocalEvent(eventRule.eventName, eventMetaObj);
                }

                break;
            }
            case "=": {
                if (!submitServerShortNameObjRule.verify(body))
                    throw "The body of the submit server short name packet sent by server has an type error";

                let eventName = prefix.slice(1);
                /**
                 * @type {{
                 *  key: Array<string>,
                 *  short: string
                 * }}
                 */
                let infoObj = body;
                let eventRule = this.#serverMappingRules.getRuleByName(eventName);
                if (!eventRule)
                {
                    eventRule = EventRule.createWithoutType(infoObj.key.map(o => ({ key: o })));
                    this.#serverMappingRules.clientAddEventRule(eventName, eventRule);
                    if (infoObj.short)
                        this.#serverMappingRules.setShortName(infoObj.short, eventRule);
                }
                else
                {
                    if (infoObj.short)
                        this.#serverMappingRules.setShortName(infoObj.short, eventRule);
                    if (infoObj.key)
                        eventRule.resetKeyList(infoObj.key);
                }

                break;
            }
            default: {
                let prefixFirstCharCode = prefix.charCodeAt(0);
                if (
                    (48 <= prefixFirstCharCode && prefixFirstCharCode <= 57) || // 0 - 9
                    (97 <= prefixFirstCharCode && prefixFirstCharCode <= 122) // a - z
                )
                { // 以简短名触发事件
                    let shortName = prefix;
                    let eventRule = this.#clientMappingRules.getRuleByShort(shortName);
                    if (!eventRule)
                        throw "The short name provided by the server does not exist";
                    let eventMetaObj = eventRule.verifyGetArray(body);
                    this.#triggerLocalEvent(eventRule.eventName, eventMetaObj);
                }
                else
                {
                    throw "protocol error";
                }
            }
        }
    }

    /**
     * 触发对端事件
     * @param {string} eventName
     * @param {object} [eventMetaObj]
     */
    sendTrigger(eventName, eventMetaObj = {})
    {
        let eventRule = this.#serverMappingRules.getRuleByName(eventName);
        if (eventRule?.shortName)
        { // 已知服务端事件简短名
            this.sendData.trigger({
                prefix: eventRule.shortName,
                body: eventRule.metaObjToArray(eventMetaObj)
            });
        }
        else
        { // 未知服务端事件简短名
            this.sendData.trigger({
                prefix: "*" + eventName,
                body: eventMetaObj
            });
        }
    }
}