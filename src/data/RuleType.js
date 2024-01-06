/**
 * 规则类型
 */
export class RuleType
{
    /**
     * 允许 number 类型
     * @type {boolean}
     */
    #number = false;
    /**
     * 对于number 允许整数
     * 仅包括安全整数
     * 不包括负0
     * @type {boolean}
     */
    #allowInteger = false;
    /**
     * 对于number 允许除整数外的有限数
     * @type {boolean}
     */
    #allowFinite = false;
    /**
     * 对于number 允许正无限
     * @type {boolean}
     */
    #allowPositiveInfinity = false;
    /**
     * 对于number 允许负无限
     * @type {boolean}
     */
    #allowNegativeInfinity = false;
    /**
     * 对于number 允许NaN
     * @type {boolean}
     */
    #allowNaN = false;
    /**
     * 对于number 允许的最大的值
     * @type {number | null}
     */
    #numberMax = null;
    /**
     * 对于number 允许的最小的值
     * @type {number | null}
     */
    #numberMin = null;


    /**
     * 允许 boolean 类型
     * @type {boolean}
     */
    #boolean = false;


    /**
     * 允许 string 类型
     * @type {boolean}
     */
    #string = false;
    /**
     * 对于string 允许的最大长度
     * @type {number | null}
     */
    #stringMaxLength = null;


    /**
     * 允许 bigint 类型
     * @type {boolean}
     */
    #biging = false;


    /**
     * 允许 数组
     * @type {boolean}
     */
    #array = false;
    /**
     * 对于数组 对应数组中对应的位置的值的类型
     * @type {Array<RuleType>}
     */
    #arrayRule = null;
    /**
     * 对于数组 剩余的值的规则
     * @type {RuleType}
     */
    #arrayDefaultRule = null;


    /**
     * 允许 对象 (不包括 数组)
     * @type {boolean}
     */
    #object = false;
    /**
     * 对于对象 必要的key
     * @type {Set<string>}
     */
    #necessaryKey = null;
    /**
     * 对于对象 必要或可选的key 对应的规则
     * @type {Map<string, RuleType>}
     */
    #keyRuleMap = null;
    /**
     * 对于对象 其他的值的规则
     * 若为 null 则不允许其他值存在
     * @type {RuleType}
     */
    #defaultValueRule = null;


    /**
     * 允许 null
     * @type {boolean}
     */
    #enableNull = false;
    /**
     * 允许 undefined
     * @type {boolean}
     */
    #enableUndefined = false;


    /**
     * 枚举类型的值
     * 表示仅允许此集合的值
     * 此属性的优先级最高
     * @type {Set<any>}
     */
    #enumSet = null;

    /**
     * 任意类型
     * 跳过一切类型判定通过所有类型
     * @type {boolean}
     */
    #any = false;

    /**
     * 验证值是否符合此规则
     * @param {any} value
     */
    verify(value)
    {
        if (this.#any)
            return true;
        if (this.#enumSet && this.#enumSet.has(value))
            return true;
        switch (typeof (value))
        {
            case "number": {
                if (!this.#number)
                    return false;

                if (Number.isSafeInteger(value) && !Object.is(value, -0))
                {
                    if (!this.#allowInteger)
                        return false;
                }
                else if (Number.isFinite(value))
                {
                    if (!this.#allowFinite)
                        return false;
                }
                else if (value == Infinity)
                {
                    return this.#allowPositiveInfinity;
                }
                else if (value == -Infinity)
                {
                    return this.#allowNegativeInfinity;
                }
                else
                {
                    return this.#allowNaN;
                }

                if (this.#numberMax != null && this.#numberMax < value)
                    return false;
                if (this.#numberMin != null && this.#numberMin > value)
                    return false;

                return true;
            }
            case "boolean": {
                return this.#boolean;
            }
            case "string": {
                if (!this.#string)
                    return false;
                if (this.#stringMaxLength != null && value.length > this.#stringMaxLength)
                    return false;
                return true;
            }
            case "object": {
                if (value == null)
                {
                    return this.#enableNull;
                }
                else if (Array.isArray(value))
                {
                    if (!this.#array)
                        return false;

                    for (let index = 0, length = Math.max(value.length, this.#arrayRule.length); index < length; index++)
                    {
                        let subValue = value[index];
                        let rule = this.#arrayRule?.[index];
                        if (rule)
                        {
                            if (!rule.verify(subValue))
                                return false;
                        }
                        else if (this.#arrayDefaultRule)
                        {
                            if (!this.#arrayDefaultRule.verify(subValue))
                                return false;
                        }
                        else
                            return false;
                    }

                    return true;
                }
                else
                {
                    if (!this.#object)
                        return false;

                    let entriesList = Object.entries(value);
                    let keySet = new Set(entriesList.map(o => o[0]));

                    if (this.#necessaryKey)
                        for (let key of this.#necessaryKey)
                        {
                            if (!keySet.has(key))
                                return false;
                        }

                    for (let [key, subValue] of entriesList)
                    {
                        let rule = this.#keyRuleMap.get(key);
                        if (rule)
                        {
                            if (!rule.verify(subValue))
                                return false;
                        }
                        else if (this.#defaultValueRule)
                        {
                            if (!this.#defaultValueRule.verify(subValue))
                                return false;
                        }
                        else
                            return false;
                    }
                    return true;
                }
            }
            case "bigint": {
                if (!this.#biging)
                    return false;
                return true;
            }
            case "undefined": {
                return this.#enableUndefined;
            }
        }
        return false;
    }

    /**
     * 合并两个规则
     * 这不是严格合并
     * @param {RuleType} target
     * @returns {RuleType}
     */
    merge(target)
    {
        let ret = new RuleType();

        if (this.#any || target.#any)
            return RuleType.any();

        ret.#number = this.#number || target.#number;
        ret.#allowInteger = this.#allowInteger || target.#allowInteger;
        ret.#allowFinite = this.#allowFinite || target.#allowFinite;
        ret.#allowPositiveInfinity = this.#allowPositiveInfinity || target.#allowPositiveInfinity;
        ret.#allowNegativeInfinity = this.#allowNegativeInfinity || target.#allowNegativeInfinity;
        ret.#allowNaN = this.#allowNaN || target.#allowNaN;
        ret.#numberMax = mergeSame(this.#numberMax, target.#numberMax);
        ret.#numberMin = mergeSame(this.#numberMin, target.#numberMin);

        ret.#boolean = this.#boolean || target.#boolean;

        ret.#string = this.#string || target.#string;

        ret.#biging = this.#biging || target.#biging;

        ret.#array = this.#array || target.#array;
        ret.#arrayRule = mergeSame(this.#arrayRule, target.#arrayRule);
        ret.#arrayDefaultRule = mergeSame(this.#arrayDefaultRule, target.#arrayDefaultRule);

        ret.#object = this.#object || target.#object;
        ret.#necessaryKey = mergeSame(this.#necessaryKey, target.#necessaryKey);
        ret.#keyRuleMap = mergeSame(this.#keyRuleMap, target.#keyRuleMap);
        ret.#defaultValueRule = mergeSame(this.#defaultValueRule, target.#defaultValueRule);

        ret.#enableNull = this.#enableNull || target.#enableNull;

        ret.#enableUndefined = this.#enableUndefined || target.#enableUndefined;

        if (this.#enumSet || target.#enumSet)
        {
            let enumSet = new Set();
            if (this.#enumSet)
            {
                this.#enumSet.forEach(o =>
                {
                    enumSet.add(o);
                });
            }
            if (target.#enumSet)
            {
                target.#enumSet.forEach(o =>
                {
                    enumSet.add(o);
                });
            }
            if (enumSet.size > 0)
                ret.#enumSet = enumSet;
        }

        return ret;
    }

    /**
     * 求交两个规则
     * 这不是严格求交
     * @param {RuleType} target
     * @returns {RuleType}
     */
    intersect(target)
    {
        let ret = new RuleType();

        if (this.#any)
            return target;
        else if (target.#any)
            return this;

        ret.#number = this.#number && target.#number;
        ret.#allowInteger = this.#allowInteger && target.#allowInteger;
        ret.#allowFinite = this.#allowFinite && target.#allowFinite;
        ret.#allowPositiveInfinity = this.#allowPositiveInfinity && target.#allowPositiveInfinity;
        ret.#allowNegativeInfinity = this.#allowNegativeInfinity && target.#allowNegativeInfinity;
        ret.#allowNaN = this.#allowNaN && target.#allowNaN;
        ret.#numberMax = intersectNonNull(this.#numberMax, target.#numberMax);
        ret.#numberMin = intersectNonNull(this.#numberMin, target.#numberMin);

        ret.#boolean = this.#boolean && target.#boolean;

        ret.#string = this.#string && target.#string;

        ret.#biging = this.#biging && target.#biging;

        ret.#array = this.#array && target.#array;
        ret.#arrayRule = intersectNonNull(this.#arrayRule, target.#arrayRule);
        ret.#arrayDefaultRule = intersectNonNull(this.#arrayDefaultRule, target.#arrayDefaultRule);

        ret.#object = this.#object && target.#object;
        ret.#necessaryKey = intersectNonNull(this.#necessaryKey, target.#necessaryKey);
        ret.#keyRuleMap = intersectNonNull(this.#keyRuleMap, target.#keyRuleMap);
        ret.#defaultValueRule = intersectNonNull(this.#defaultValueRule, target.#defaultValueRule);

        ret.#enableNull = this.#enableNull && target.#enableNull;

        ret.#enableUndefined = this.#enableUndefined && target.#enableUndefined;

        if (this.#enumSet || target.#enumSet)
        {
            let enumSet = new Set();
            if (this.#enumSet)
            {
                this.#enumSet.forEach(o =>
                {
                    if (target.verify(o))
                        enumSet.add(o);
                });
            }
            if (target.#enumSet)
            {
                target.#enumSet.forEach(o =>
                {
                    if (this.verify(o))
                        enumSet.add(o);
                });
            }
            if (enumSet.size > 0)
                ret.#enumSet = enumSet;
        }

        return ret;
    }

    /**
     * 创建任意类型的规则
     * @returns {RuleType}
     */
    static any()
    {
        let ret = new RuleType();
        ret.#any = true;
        return ret;
    }

    /**
     * 创建枚举型规则
     * @param {Iterable<any>} valueList
     * @returns {RuleType}
     */
    static enum(valueList)
    {
        let ret = new RuleType();
        ret.#enumSet = new Set(valueList);
        return ret;
    }

    /**
     * 创建 number 类型规则
     * 允许所有 number 类型
     * @returns {RuleType}
     */
    static number()
    {
        let ret = new RuleType();
        ret.#number = true;
        ret.#allowInteger = true;
        ret.#allowFinite = true;
        ret.#allowPositiveInfinity = true;
        ret.#allowNegativeInfinity = true;
        ret.#allowNaN = true;
        return ret;
    }

    /**
     * 创建 string 类型规则
     * @returns {RuleType}
     */
    static string()
    {
        let ret = new RuleType();
        ret.#string = true;
        return ret;
    }

    /**
     * 创建 boolean 类型规则
     * @returns {RuleType}
     */
    static boolean()
    {
        let ret = new RuleType();
        ret.#boolean = true;
        return ret;
    }

    /**
     * 创建 bigint 类型规则
     * @returns {RuleType}
     */
    static bigint()
    {
        let ret = new RuleType();
        ret.#biging = true;
        return ret;
    }

    /**
     * 创建 null 类型规则
     * @returns {RuleType}
     */
    static null()
    {
        let ret = new RuleType();
        ret.#enableNull = true;
        return ret;
    }

    /**
     * 创建 undefined 类型规则
     * @returns {RuleType}
     */
    static undefined()
    {
        let ret = new RuleType();
        ret.#enableUndefined = true;
        return ret;
    }

    /**
     * 创建 对象 类型规则
     * @param {Object<string, RuleType>} necessary
     * @param {Object<string, RuleType>} [optional]
     * @param {RuleType} [defaultValueRule]
     */
    static object(necessary, optional = {}, defaultValueRule = null)
    {
        let ret = new RuleType();

        ret.#object = true;
        let necessaryEntries = Object.entries(necessary);
        let optionalEntries = Object.entries(optional);
        ret.#necessaryKey = new Set(necessaryEntries.map(o => o[0]));
        ret.#keyRuleMap = new Map([
            ...optionalEntries,
            ...necessaryEntries
        ]);
        if (defaultValueRule)
            ret.#defaultValueRule = defaultValueRule;

        return ret;
    }

    /**
     * 创建 数组 类型规则
     * @param {Array<RuleType>} ruleArray
     * @param {RuleType} [defaultValueRule]
     */
    static array(ruleArray, defaultValueRule = null)
    {
        let ret = new RuleType();

        ret.#array = true;
        ret.#arrayRule = ruleArray;
        if (defaultValueRule)
            ret.#arrayDefaultRule = defaultValueRule;

        return ret;
    }
}

/**
 * 合并值 取其中的非空内容
 * 其中一个为null返回另一个值
 * 当两个都非空且不相等时抛错
 * @param {any} a
 * @param {any} b
 */
function intersectNonNull(a, b)
{
    if (a == b)
        return a;
    if (a != null && b != null)
        throw "Unable to intersect RuleType";
    return (a != null ? a : b);
}

/**
 * 合并值 取相同值
 * 其中一个为null时为null
 * 都不为null时两个值不相同时报错
 * @param {any} a
 * @param {any} b
 */
function mergeSame(a, b)
{
    if (a == null || b == null)
        return null;
    if (a != b)
        throw "Unable to merge RuleType";
    return a;
}