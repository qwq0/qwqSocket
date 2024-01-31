import { QwQSocketClient, QwQSocketServer, QwQSocketServerClient, RuleType } from "../index.js";
import { EventRule } from "../rule/EventRule.js";
import { BinderOperator } from "./BinderOperator.js";
import { QueryError } from "./QueryError.js";

let metaObjQueryIdKey = "-query-id";
let metaObjCauseKey = "-cause";

/**
 * 事件规则绑定器
 * 创建一个事件列表 然后附加到服务端或者客户端
 */
export class RuleBinder
{
    /**
     * 事件名列表
     * @type {Array<string>}
     */
    #eventNameList = [];

    /**
     * 事件名集合
     * @type {Set<string>}
     */
    #eventNameSet = new Set();

    /**
     * 事件名 到 事件规则 映射
     * @type {Map<string, EventRule>}
     */
    #eventRuleMap = new Map();

    /**
     * 事件名 到 事件监听器 映射
     * @type {Map<string, (eventMetaObj: object, target: QwQSocketServerClient | QwQSocketClient) => void>}
     */
    #eventListenerMap = new Map();

    /**
     * 绑定到指定端的事件
     * @type {"server" | "client" | "peer" | ""}
     */
    #bound = "";

    /**
     * 对端事件规则绑定器
     * @type {RuleBinder}
     */
    #opposite = null;

    /**
     * 检测合法的用户事件名
     * 允许 数字 大写或小写字母 下划线(_)
     * @param {string} name
     * @returns {boolean} 
     */
    static #isValidEventName(name)
    {
        return (/^[a-zA-Z0-9_]+$/).test(name);
    }

    /**
     * 添加事件名
     * @param {string} eventName
     */
    #addEventName(eventName)
    {
        if (this.#eventNameSet.has(eventName))
            return;
        this.#eventNameSet.add(eventName);
        this.#eventNameList.push(eventName);
    }

    /**
     * 添加事件规则
     * @param {string} eventName
     * @param {EventRule} eventRule
     */
    addEventRule(eventName, eventRule)
    {
        if (!RuleBinder.#isValidEventName(eventName))
            throw `"${eventName}" is not a valid event name`;
        this.#addEventName(eventName);
        if (this.#eventRuleMap.has(eventName))
            throw `The "${eventName}" event rule is defined repeatedly`;
        this.#eventRuleMap.set(eventName, eventRule.getCopy());
    }

    /**
     * 添加多个事件规则
     * @param {Object<string, EventRule>} eventRules
     */
    addEventRules(eventRules)
    {
        Object.entries(eventRules).forEach(([eventName, eventRule]) =>
        {
            this.addEventRule(eventName, eventRule);
        });
    }


    /**
     * 设置事件监听器
     * @param {string} eventName
     * @param {(eventMetaObj: object, target: QwQSocketServerClient | QwQSocketClient) => void} listener
     */
    setEventListener(eventName, listener)
    {
        if (!RuleBinder.#isValidEventName(eventName))
            throw `"${eventName}" is not a valid event name`;
        this.#addEventName(eventName);
        if (this.#eventListenerMap.has(eventName))
            throw `The "${eventName}" event listener is defined repeatedly`;
        this.#eventListenerMap.set(eventName, listener);
    }

    /**
     * 设置多个事件监听器
     * @param {Object<string, (eventMetaObj: object, target: QwQSocketServerClient | QwQSocketClient) => void>} eventListeners
     */
    setEventListeners(eventListeners)
    {
        Object.entries(eventListeners).forEach(([eventName, listener]) =>
        {
            this.setEventListener(eventName, listener);
        });
    }

    /**
     * 添加查询规则
     * @param {string} queryName
     * @param {EventRule} requestRule
     * @param {EventRule} responseRule
     */
    addQueryRule(queryName, requestRule, responseRule)
    {
        if (!RuleBinder.#isValidEventName(queryName))
            throw `"${queryName}" is not a valid query name`;

        let requestEventName = queryName + "-req";
        let respondEventName = queryName + "-rsp";
        let errorRespondEventName = queryName + "-ersp";

        if (requestRule.hasKey(metaObjQueryIdKey) || responseRule.hasKey(metaObjQueryIdKey))
            throw `Cannot use internally occupied name "${metaObjQueryIdKey}"`;

        let opposite = this.#opposite;
        if (opposite == null)
            throw "Cannot bind event response because the opposite does not exist";

        // 绑定请求事件
        opposite.#addEventName(requestEventName);
        if (opposite.#eventRuleMap.has(requestEventName))
            throw `The "${queryName}" query request rule is defined repeatedly`;
        opposite.#eventRuleMap.set(
            requestEventName,
            requestRule.getCopy().addParamToFront(metaObjQueryIdKey, RuleType.string())
        );

        // 绑定响应事件
        this.#addEventName(respondEventName);
        if (this.#eventRuleMap.has(respondEventName))
            throw `The "${queryName}" query response rule is defined repeatedly`;
        this.#eventRuleMap.set(
            respondEventName,
            responseRule.getCopy().addParamToFront(metaObjQueryIdKey, RuleType.string())
        );

        // 绑定错误响应事件
        this.#addEventName(errorRespondEventName);
        if (this.#eventRuleMap.has(errorRespondEventName))
            throw `The "${queryName}" query error-response rule is defined repeatedly`;
        this.#eventRuleMap.set(
            errorRespondEventName,
            EventRule.create([
                {
                    key: metaObjQueryIdKey,
                    rule: RuleType.string()
                },
                {
                    key: metaObjCauseKey,
                    rule: RuleType.string().merge(RuleType.undefined())
                }
            ])
        );
    }

    /**
     * 设置查询处理函数
     * @param {string} queryName
     * @param {(eventMetaObj: object, target: QwQSocketServerClient | QwQSocketClient) => (Promise<any> | any)} processor
     */
    setQueryProcessor(queryName, processor)
    {
        if (!RuleBinder.#isValidEventName(queryName))
            throw `"${queryName}" is not a valid query name`;

        let requestEventName = queryName + "-req";
        let respondEventName = queryName + "-rsp";
        let errorRespondEventName = queryName + "-ersp";

        this.#addEventName(requestEventName);
        if (this.#eventListenerMap.has(requestEventName))
            throw `The "${queryName}" query processor is defined repeatedly`;
        this.#eventListenerMap.set(
            requestEventName,
            async (eventMetaObj, target) => // 请求事件的监听器
            {
                let queryId = eventMetaObj[metaObjQueryIdKey];
                try
                {
                    let result = await processor(eventMetaObj, target);

                    if (result == null)
                    {
                        result = {};
                    }
                    else
                    {
                        if (typeof (result) != "object")
                            throw "query processor muse return a object";
                        result = Object.assign({}, result);
                    }

                    result[metaObjQueryIdKey] = queryId;

                    // 完成请求 触发响应事件
                    target.sendTrigger(respondEventName, result);
                }
                catch (err)
                { // 请求失败 触发错误响应事件
                    if (err instanceof QueryError)
                    {
                        target.sendTrigger(errorRespondEventName, {
                            [metaObjQueryIdKey]: queryId,
                            [metaObjCauseKey]: err.cause
                        });
                    }
                    else
                    {
                        console.error(err);
                        target.sendTrigger(errorRespondEventName, {
                            [metaObjQueryIdKey]: queryId
                        });
                    }
                }
            }
        );
    }

    /**
     * 应用到实例
     * @param {QwQSocketServer | QwQSocketServerClient | QwQSocketClient} target
     */
    applyToInstance(target)
    {
        if (this.#bound == "server")
        { // 应用到服务端
            if (target instanceof QwQSocketServer)
            { // 应用到服务端实例
                this.#eventNameList.forEach(eventName =>
                {
                    let eventRule = this.#eventRuleMap.get(eventName);
                    if (!eventRule)
                        throw `Cannot attach to target because rule "${eventName}" is missing`;
                    target.serverMappingRules.serverAddEventRule(eventName, eventRule.getCopy());
                });
            }
            else if (target instanceof QwQSocketServerClient)
            { // 应用到服务端的单个客户端实例
                this.#eventNameList.forEach(eventName =>
                {
                    let eventListener = this.#eventListenerMap.get(eventName);
                    if (!eventListener)
                        throw `Cannot attach to target because listener "${eventName}" is missing`;
                    // @ts-ignore
                    target.eventListener[eventName] = eventListener;
                });
            }
            else
                throw "The binding type does not match the target";

        }
        else if (this.#bound == "client")
        { // 应用到客户端
            if (!(target instanceof QwQSocketClient))
                throw "The binding type does not match the target";
            this.#eventNameList.forEach(eventName =>
            {
                let eventRule = this.#eventRuleMap.get(eventName);
                if (!eventRule)
                    throw `Cannot attach to target because rule "${eventName}" is missing`;
                target.addEventRule(eventName, eventRule.getCopy());

                let eventListener = this.#eventListenerMap.get(eventName);
                if (!eventListener)
                    throw `Cannot attach to target because listener "${eventName}" is missing`;
                // @ts-ignore
                target.eventListener[eventName] = eventListener;
            });
        }
        else
            throw "Unsupported binding type";
    }

    /**
     * 创建操作器
     * @param {QwQSocketServerClient | QwQSocketClient} target 
     * @returns {BinderOperator}
     */
    createOperator(target)
    {
        let ret = new BinderOperator(target);
        this.#eventNameList.forEach(eventName =>
        {
            ret.addTrigger(eventName);
        });
        return ret;
    }

    /**
     * 绑定对端
     * 服务端规则和客户端规则之间的绑定
     * @param {RuleBinder} target
     */
    bindOpposite(target)
    {
        if (
            (this.#opposite && this.#opposite != target) ||
            (target.#opposite && target.#opposite != this)
        )
            throw "Target cannot be bound because it is already bound to another target";
        this.#opposite = target;
        target.#opposite = this;
    }

    /**
     * 创建服务端事件规则集
     * @returns {RuleBinder}
     */
    static createServerBound()
    {
        let ret = new RuleBinder();
        ret.#bound = "server";
        return ret;
    }

    /**
     * 创建客户端事件规则集
     * @returns {RuleBinder}
     */
    static createClientBound()
    {
        let ret = new RuleBinder();
        ret.#bound = "client";
        return ret;
    }
}