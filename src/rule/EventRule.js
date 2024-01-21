import { RuleType } from "./RuleType.js";

/**
 * 表示一个事件的规则
 */
export class EventRule
{
    /**
     * 事件名
     * @type {string}
     */
    eventName = "";
    /**
     * 简短名
     * @type {string}
     */
    shortName = "";

    /**
     * 事件规则 所在的 映射规则
     * @type {import("./MappingRules.js").MappingRules}
     */
    mappingRules = null;

    /**
     * 事件元对象的key列表
     * @type {Array<string>}
     */
    metaObjKeyList = [];

    /**
     * 事件元对象的key集合
     * @type {Set<string>}
     */
    #metaObjKeySet = new Set();

    /**
     * 元对象的key 到 元对象的值的规则 映射
     * 若为null表示不进行类型检查
     * @type {Map<string, RuleType>}
     */
    #metaObjRuleMap = null;

    /**
     * 获取此事件规则的副本
     * @returns {EventRule}
     */
    getCopy()
    {
        let ret = new EventRule();

        ret.metaObjKeyList = this.metaObjKeyList.slice();
        ret.#metaObjKeySet = new Set(this.#metaObjKeySet);
        if (this.#metaObjRuleMap)
            ret.#metaObjRuleMap = new Map(this.#metaObjRuleMap);

        return ret;
    }

    /**
     * 获取此事件规则无类型检查的副本
     * @returns {EventRule}
     */
    getCopyWithoutType()
    {
        let ret = new EventRule();

        ret.metaObjKeyList = this.metaObjKeyList.slice();
        ret.#metaObjKeySet = new Set(this.#metaObjKeySet);

        return ret;
    }

    /**
     * 是否拥有指定的key
     * @param {string} key
     * @returns {boolean}
     */
    hasKey(key)
    {
        return this.#metaObjKeySet.has(key);
    }

    /**
     * 重设key列表
     * 新的列表和原列表应当仅顺序不同 元素内容相同
     * @param {Array<string>} newKeyList
     */
    resetKeyList(newKeyList)
    {
        if (!Array.isArray(newKeyList))
            throw "type error";
        if (newKeyList.length != this.metaObjKeyList.length)
            throw "The reset keylist has a different length";
        /**
         * @type {Set<string>}
         */
        let keySet = new Set();
        for (let key of newKeyList)
        {
            if (keySet.has(key))
                throw "Duplicate key in the reset keylist";
            if (!this.#metaObjKeySet.has(key))
                throw "The reset keylist has key that didnot exist before";
            keySet.add(key);
        }
        this.metaObjKeyList = newKeyList;
    }

    /**
     * 从数组验证并获取事件元数据对象
     * @param {Array<any>} srcArray
     * @returns {object}
     */
    verifyGetArray(srcArray)
    {
        if (!this.#metaObjRuleMap)
            throw "Unable to check type";

        if (srcArray == undefined)
            srcArray = [];
        else if (!Array.isArray(srcArray))
            throw "type error";

        if (srcArray.length > this.metaObjKeyList.length)
            throw "type error";

        let ret = {};

        for (let i = 0, length = this.metaObjKeyList.length; i < length; i++)
        {
            let key = this.metaObjKeyList[i];
            let rule = this.#metaObjRuleMap.get(key);
            let value = srcArray[i];
            if (rule.verify(value))
            {
                Object.defineProperty(
                    ret,
                    key,
                    {
                        value: value,
                        writable: true,
                        configurable: true,
                        enumerable: true
                    }
                );
            }
            else
            {
                throw "type error";
            }
        }
        return ret;
    }

    /**
     * 从元数据对象验证并获取事件元数据对象
     * @param {object} srcObj
     * @returns {object}
     */
    verifyGetObject(srcObj)
    {
        if (!this.#metaObjRuleMap)
            throw "Unable to check type";

        if (srcObj == undefined)
            srcObj = {};

        let ret = {};
        let keyList = Object.keys(srcObj);
        for (let key of keyList)
        {
            if (!this.#metaObjKeySet.has(key))
                throw "type error";
        }
        for (let [key, rule] of this.#metaObjRuleMap)
        {
            let value = srcObj[key];
            if (rule.verify(value))
            {
                Object.defineProperty(
                    ret,
                    key,
                    {
                        value: value,
                        writable: true,
                        configurable: true,
                        enumerable: true
                    }
                );
            }
            else
            {
                throw "type error";
            }
        }
        return ret;
    }

    /**
     * 转换元数据对象到数组
     * @param {object} srcObj
     * @returns {Array<any>}
     */
    metaObjToArray(srcObj)
    {
        let ret = [];
        this.metaObjKeyList.forEach((key, index) =>
        {
            if (Object.hasOwn(srcObj, key))
            {
                ret[index] = srcObj[key];
            }
        });
        if (ret.length > 0)
            return ret;
        else
            return undefined;
    }

    /**
     * 在事件规则元对象结尾追加参数
     * @param {string} key
     * @param {RuleType} [rule]
     * @returns {EventRule} 返回当前规则元对象本身
     */
    addParamToEnd(key, rule)
    {
        if (this.#metaObjKeySet.has(key))
            throw "Duplicate key in meta object";
        this.#metaObjKeySet.add(key);
        this.metaObjKeyList.push(key);
        if (this.#metaObjRuleMap)
        {
            if (!rule)
                throw "Missing rule type in meta object";
            this.#metaObjRuleMap.set(key, rule);
        }
        return this;
    }

    /**
     * 在事件规则元对象开头追加参数
     * @param {string} key
     * @param {RuleType} [rule]
     * @returns {EventRule} 返回当前规则元对象本身
     */
    addParamToFront(key, rule)
    {
        if (this.#metaObjKeySet.has(key))
            throw "Duplicate key in meta object";
        this.#metaObjKeySet.add(key);
        this.metaObjKeyList.unshift(key);
        if (this.#metaObjRuleMap)
        {
            if (!rule)
                throw "Missing rule type in meta object";
            this.#metaObjRuleMap.set(key, rule);
        }
        return this;
    }

    /**
     * 创建事件规则
     * @param {Array<{
     *  key: string,
     *  rule: RuleType
     * }>} metaObjRuleList
     */
    static create(metaObjRuleList)
    {
        let ret = new EventRule();
        ret.#metaObjRuleMap = new Map();
        ret.metaObjKeyList = metaObjRuleList.map(o => o.key);
        metaObjRuleList.forEach(o =>
        {
            if (ret.#metaObjKeySet.has(o.key))
                throw "Duplicate key in meta object";
            ret.#metaObjKeySet.add(o.key);
            if (!o.rule)
                throw "Missing rule type in meta object";
            ret.#metaObjRuleMap.set(o.key, o.rule);
        });
        return ret;
    }

    /**
     * 创建事件规则
     * 不检查类型
     * @param {Array<{
     *  key: string
     * }>} metaObjKeyList
     */
    static createWithoutType(metaObjKeyList)
    {
        let ret = new EventRule();
        ret.metaObjKeyList = metaObjKeyList.map(o => o.key);
        metaObjKeyList.forEach(o =>
        {
            if (ret.#metaObjKeySet.has(o.key))
                throw "Duplicate key in meta object";
            ret.#metaObjKeySet.add(o.key);
        });
        return ret;
    }
}