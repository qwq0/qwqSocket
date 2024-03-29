import { EventRule } from "./EventRule.js";
import { RuleType } from "./RuleType.js";

/**
 * 映射规则
 */
export class MappingRules
{
    /**
     * 事件名 到 事件规则 映射
     * @type {Map<string, EventRule>}
     */
    #eventNameMap = new Map();

    /**
     * 简短名 到 事件规则 映射
     * @type {Map<string, EventRule>}
     */
    #shortNameMap = new Map();

    /**
     * 简短名计数器
     * 简短名取36进制数字
     * @type {number}
     */
    #shortCount = 0;

    /**
     * 通过简短名获取事件规则
     * @param {string} shortName
     * @returns {EventRule}
     */
    getRuleByShort(shortName)
    {
        return this.#shortNameMap.get(shortName);
    }

    /**
     * 通过事件名获取事件规则
     * @param {string} eventName
     * @returns {EventRule}
     */
    getRuleByName(eventName)
    {
        return this.#eventNameMap.get(eventName);
    }

    /**
     * 添加一个事件规则
     * 并设置简短名
     * @param {string} eventName
     * @param {string} shortName
     * @param {EventRule} eventRule
     */
    #addEventRuleWithShortName(eventName, shortName, eventRule)
    {
        if (eventRule.mappingRules != null)
            throw "The EventRule cannot be added repeatedly";
        if (this.#eventNameMap.has(eventName))
            throw "Cannot add an EventRule using an existing event name";
        if (this.#shortNameMap.has(shortName))
            throw "Cannot use this short name because the short name is already used";
        eventRule.mappingRules = this;
        eventRule.eventName = eventName;
        eventRule.shortName = shortName;
        this.#eventNameMap.set(eventName, eventRule);
        this.#shortNameMap.set(shortName, eventRule);
    }

    /**
     * 添加一个事件规则
     * @param {string} eventName
     * @param {EventRule} eventRule
     */
    #addEventRule(eventName, eventRule)
    {
        if (eventRule.mappingRules != null)
            throw "The EventRule cannot be added repeatedly";
        if (this.#eventNameMap.has(eventName))
            throw "Cannot add an EventRule using an existing event name";
        eventRule.mappingRules = this;
        eventRule.eventName = eventName;
        this.#eventNameMap.set(eventName, eventRule);
    }

    /**
     * 服务端添加一个事件规则
     * 自动创建简短名
     * @param {string} eventName
     * @param {EventRule} eventRule
     */
    serverAddEventRule(eventName, eventRule)
    {
        let shortName = "";
        do
        {
            shortName = this.#shortCount.toString(36);
            this.#shortCount++;
        }
        while (this.#shortNameMap.has(shortName));

        this.#addEventRuleWithShortName(eventName, shortName, eventRule);
    }

    /**
     * 客户端添加一个事件规则
     * 不自动创建简短名
     * @param {string} eventName
     * @param {EventRule} eventRule
     */
    clientAddEventRule(eventName, eventRule)
    {
        this.#addEventRule(eventName, eventRule);
    }

    /**
     * 设置简短名
     * 不可重复设置简短名
     * @param {string} shortName
     * @param {EventRule} eventRule
     */
    setShortName(shortName, eventRule)
    {
        if (eventRule.mappingRules != this)
            throw "The EventRule is not appended to this MappingRules";
        if (eventRule.shortName)
            throw "Cannot set a short name because the EventRule already has a short name";
        if (this.#shortNameMap.has(shortName) && this.#shortNameMap.get(shortName) != eventRule)
            throw "Cannot use this short name because the short name is already used";
        eventRule.shortName = shortName;
        this.#shortNameMap.set(shortName, eventRule);
    }
}