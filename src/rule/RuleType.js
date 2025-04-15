/**
 * js内置类构造器 到 类型名称 映射
 * @type {Map<Object, string>}
 */
// @ts-ignore
let buildInClassMap = new Map([
    [ArrayBuffer, "ArrayBuffer"],
    [Uint8Array, "Uint8Array"],
    [Map, "Map"],
    [Set, "Set"]
]);


/**
 * 规则类型
 * 用于对值的类型进行检查
 * 
 * 此类的值仅在创建时变化
 * 创建后的RuleType类无法发生变化
 * 
 * 包含几个基本类型
 *  - number
 *  - boolean
 *  - string
 *  - bigint
 *  - array
 *  - object
 *  - buildInClass
 *  - null
 *  - undefined
 */
export class RuleType
{
    /**
     * 任意类型
     * 跳过一切类型判定通过所有类型
     * @type {boolean}
     */
    #any = false;

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
     * 对于number 允许的最小的值
     * @type {number | null}
     */
    #numberMin = null;
    /**
     * 对于number 允许的最大的值
     * @type {number | null}
     */
    #numberMax = null;

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
     * 对于string 允许的最小长度
     * @type {number | null}
     */
    #stringMinLength = null;
    /**
     * 对于string 允许的最大长度
     * @type {number | null}
     */
    #stringMaxLength = null;

    /**
     * 允许 bigint 类型
     * @type {boolean}
     */
    #bigint = false;

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
     * 对于数组 允许的最小长度
     * @type {number | null}
     */
    #arrayMinLength = null;
    /**
     * 对于数组 允许的最大长度
     * @type {number | null}
     */
    #arrayMaxLength = null;

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
     * 允许 js内置类
     * @type {boolean}
     */
    #buildInClass = false;
    /**
     * 对于js内置类 允许哪一种内置类
     * @type {"Map" | "Set" | "Uint8Array" | "ArrayBuffer" | null}
     */
    #classTypeName = null;
    /**
     * 对于内置类(Map) 允许的key类型
     * @type {RuleType}
     */
    #classKeyType = null;
    /**
     * 对于内置类(Map和Set) 允许的value类型
     * @type {RuleType}
     */
    #classValueType = null;

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
     * 表示总允许此集合的值
     * 此属性的优先级最高
     * 不在此集合中的值将正常进行判定
     * @type {Set<any>}
     */
    #enumSet = null;

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
            case "number": { // 数值类型
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
            case "boolean": { // bool类型
                return this.#boolean;
            }
            case "string": { // 字符串类型
                if (!this.#string)
                    return false;

                if (this.#stringMinLength != null && value.length < this.#stringMinLength)
                    return false;
                if (this.#stringMaxLength != null && value.length > this.#stringMaxLength)
                    return false;

                return true;
            }
            case "object": { // 对象
                if (value === null)
                { // null
                    return this.#enableNull;
                }
                else if (Array.isArray(value))
                { // 数组
                    if (!this.#array)
                        return false;

                    if (this.#arrayMinLength != null && this.#arrayMinLength > value.length)
                        return false;
                    if (this.#arrayMaxLength != null && this.#arrayMaxLength < value.length)
                        return false;

                    let fixRuleLength = (this.#arrayRule ? this.#arrayRule.length : 0);
                    for (let index = 0; index < fixRuleLength; index++)
                    {
                        let subValue = value[index];
                        let rule = this.#arrayRule[index];
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

                    let valueLength = value.length;
                    if (fixRuleLength < valueLength)
                    {
                        if (this.#arrayDefaultRule == null)
                            return false;
                        if (!this.#arrayDefaultRule.#any)
                        {
                            for (let index = fixRuleLength; index < valueLength; index++)
                            {
                                if (!this.#arrayDefaultRule.verify(value[index]))
                                    return false;
                            }
                        }
                    }

                    return true;
                }
                else if (this.#buildInClass && buildInClassMap.has(value?.constructor))
                { // 内置类
                    let classTypeName = buildInClassMap.get(value.constructor);
                    if (classTypeName != this.#classTypeName)
                        return false;

                    switch (classTypeName)
                    {
                        case "Map": {
                            if (this.#classKeyType.#any && this.#classValueType.#any)
                                return true;
                            for (let [subKey, subValue] of value)
                            {
                                if (!(this.#classKeyType.verify(subKey) && this.#classValueType.verify(subValue)))
                                    return false;
                            }
                            return true;
                        }
                        case "Set": {
                            if (this.#classValueType.#any)
                                return true;
                            for (let subValue of value)
                            {
                                if (!this.#classValueType.verify(subValue))
                                    return false;
                            }
                            return true;
                        }
                        case "Uint8Array": {
                            return true;
                        }
                        default: {
                            return false;
                        }
                    }
                }
                else
                { // 普通对象
                    if (!this.#object)
                        return false;

                    if (Object.getPrototypeOf(value) != Object.prototype)
                        return;

                    if (
                        this.#necessaryKey.size == 0 &&
                        this.#keyRuleMap.size == 0 &&
                        this.#defaultValueRule &&
                        this.#defaultValueRule.#any
                    )
                        return true;

                    let entriesList = Object.entries(value);
                    let keySet = new Set(entriesList.map(o => o[0]));

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
            case "bigint": { // bigint
                if (!this.#bigint)
                    return false;
                return true;
            }
            case "undefined": { // undefined
                return this.#enableUndefined;
            }
            // 以下两个类型应该用不到吧
            case "function": { // 函数
                return false;
            }
            case "symbol": { // symbol
                return false;
            }
        }
        return false;
    }

    /**
     * 合并两个规则
     * 这不是严格合并
     * 应当仅合并不同基本类型的值
     * @param {RuleType} target
     * @returns {RuleType}
     */
    merge(target)
    {
        let ret = new RuleType();

        if (this.#any || target.#any)
            return RuleType.any();

        if (ret.#number = mergeParent(this.#number, target.#number))
        {
            ret.#allowInteger = this.#allowInteger || target.#allowInteger;
            ret.#allowFinite = this.#allowFinite || target.#allowFinite;
            ret.#allowPositiveInfinity = this.#allowPositiveInfinity || target.#allowPositiveInfinity;
            ret.#allowNegativeInfinity = this.#allowNegativeInfinity || target.#allowNegativeInfinity;
            ret.#allowNaN = this.#allowNaN || target.#allowNaN;
            ret.#numberMin = mergeSame(this.#numberMin, target.#numberMin);
            ret.#numberMax = mergeSame(this.#numberMax, target.#numberMax);
        }

        ret.#boolean = this.#boolean || target.#boolean;

        if (ret.#string = mergeParent(this.#string, target.#string))
        {
            ret.#stringMinLength = mergeSame(this.#stringMinLength, target.#stringMinLength);
            ret.#stringMaxLength = mergeSame(this.#stringMaxLength, target.#stringMaxLength);
        }

        ret.#bigint = this.#bigint || target.#bigint;

        if (ret.#array = mergeParent(this.#array, target.#array))
        {
            if (this.#array && target.#array)
                throw "Unable to merge Ruletypes both contain Array type restrictions";
            ret.#arrayRule = mergeSame(this.#arrayRule, target.#arrayRule);
            ret.#arrayDefaultRule = mergeSame(this.#arrayDefaultRule, target.#arrayDefaultRule);
            ret.#arrayMinLength = mergeSame(this.#arrayMinLength, target.#arrayMinLength);
            ret.#arrayMaxLength = mergeSame(this.#arrayMaxLength, target.#arrayMaxLength);
        }

        if (ret.#object = mergeParent(this.#object, target.#object))
        {
            if (this.#object && target.#object)
                throw "Unable to merge Ruletypes both contain Object type restrictions";
            ret.#necessaryKey = mergeSame(this.#necessaryKey, target.#necessaryKey);
            ret.#keyRuleMap = mergeSame(this.#keyRuleMap, target.#keyRuleMap);
            ret.#defaultValueRule = mergeSame(this.#defaultValueRule, target.#defaultValueRule);
        }

        if (ret.#buildInClass = mergeParent(this.#buildInClass, target.#buildInClass))
        {
            if (this.#buildInClass && target.#buildInClass)
                throw "Unable to merge Ruletypes both contain buildInClass type restrictions";
            ret.#classTypeName = mergeSame(this.#classTypeName, target.#classTypeName);
            ret.#classKeyType = mergeSame(this.#classKeyType, target.#classKeyType);
            ret.#classValueType = mergeSame(this.#classValueType, target.#classValueType);
        }

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
     * ! 注意 ! 应当避免使用此方法
     * 此方法可能在未来被弃用
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

        if (ret.#number = intersectParent(this.#number, target.#number))
        {
            ret.#allowInteger = this.#allowInteger && target.#allowInteger;
            ret.#allowFinite = this.#allowFinite && target.#allowFinite;
            ret.#allowPositiveInfinity = this.#allowPositiveInfinity && target.#allowPositiveInfinity;
            ret.#allowNegativeInfinity = this.#allowNegativeInfinity && target.#allowNegativeInfinity;
            ret.#allowNaN = this.#allowNaN && target.#allowNaN;
            ret.#numberMin = intersectNonNull(this.#numberMin, target.#numberMin);
            ret.#numberMax = intersectNonNull(this.#numberMax, target.#numberMax);
        }

        ret.#boolean = this.#boolean && target.#boolean;

        if (ret.#string = intersectParent(this.#string, target.#string))
        {
            ret.#stringMinLength = intersectNonNull(this.#stringMinLength, target.#stringMinLength);
            ret.#stringMaxLength = intersectNonNull(this.#stringMaxLength, target.#stringMaxLength);
        }

        ret.#bigint = this.#bigint && target.#bigint;

        if (ret.#array = intersectParent(this.#array, target.#array))
        {
            throw "Unable to intersect Ruletypes both contain Array type restrictions";
        }

        if (ret.#object = intersectParent(this.#object, target.#object))
        {
            throw "Unable to intersect Ruletypes both contain Object type restrictions";
        }

        if (ret.#buildInClass = intersectParent(this.#buildInClass, target.#buildInClass))
        {
            throw "Unable to intersect Ruletypes both contain BuildInClass type restrictions";
        }

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
     * 生成类型定义格式
     * @returns {string}
     */
    typeDefine()
    {
        /**
         * @type {Array<string>}
         */
        let orList = [];

        if (this.#number)
            orList.push("number");
        if (this.#boolean)
            orList.push("boolean");
        if (this.#string)
            orList.push("string");
        if (this.#bigint)
            orList.push("bigint");
        if (this.#array)
            orList.push("Array");
        if (this.#object)
            orList.push("Object");
        if (this.#buildInClass)
            orList.push(this.#classTypeName);
        if (this.#enableNull)
            orList.push("null");
        if (this.#enableUndefined)
            orList.push("undefined");

        if (orList.length == 0)
            return "never";
        else
            return orList.join(" | ");
    }

    /**
     * 创建 不通过 任何值的规则
     * @returns {RuleType}
     */
    static never()
    {
        return new RuleType();
    }

    /**
     * 创建 通过 任意类型的规则
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
     * 创建 number 中的 整数 类型规则
     * @returns {RuleType}
     */
    static integer()
    {
        let ret = new RuleType();
        ret.#number = true;
        ret.#allowInteger = true;
        return ret;
    }

    /**
     * 创建 限制范围的 整数 类型规则
     * @param {number | null} minValue
     * @param {number | null} maxValue
     * @returns {RuleType}
     */
    static integerRange(minValue, maxValue)
    {
        let ret = RuleType.integer();

        if (Number.isNaN(minValue) || Number.isNaN(maxValue))
            throw "NaN cannot be used as a restriction";
        ret.#numberMin = minValue;
        ret.#numberMax = maxValue;

        return ret;
    }

    /**
     * 创建 number 中的 非负整数 类型规则
     * @returns {RuleType}
     */
    static nonnegativeInteger()
    {
        let ret = new RuleType();
        ret.#number = true;
        ret.#allowInteger = true;
        ret.#numberMin = 0;
        return ret;
    }

    /**
     * 创建 number 中的 有限数 类型规则
     * @returns {RuleType}
     */
    static finite()
    {
        let ret = new RuleType();
        ret.#number = true;
        ret.#allowInteger = true;
        ret.#allowFinite = true;
        return ret;
    }

    /**
     * 创建 限制范围的 有限数 类型规则
     * @param {number | null} minValue
     * @param {number | null} maxValue
     * @returns {RuleType}
     */
    static finiteRange(minValue, maxValue)
    {
        let ret = RuleType.finite();

        if (Number.isNaN(minValue) || Number.isNaN(maxValue))
            throw "NaN cannot be used as a restriction";
        ret.#numberMin = minValue;
        ret.#numberMax = maxValue;

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
     * 创建限制长度的 string 类型规则
     * @param {number} minLength
     * @param {number} maxLength
     * @returns {RuleType}
     */
    static stringWithLength(minLength, maxLength)
    {
        let ret = RuleType.string();

        if (Number.isNaN(minLength) || Number.isNaN(maxLength))
            throw "NaN cannot be used as a restriction";
        ret.#stringMinLength = minLength;
        ret.#stringMaxLength = maxLength;

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
        ret.#bigint = true;
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
     * @returns {RuleType}
     */
    static object(necessary, optional = {}, defaultValueRule = null)
    {
        let ret = new RuleType();

        ret.#object = true;
        let necessaryEntries = Object.entries(necessary);
        let optionalEntries = Object.entries(optional);
        ret.#necessaryKey = new Set(necessaryEntries.map(o => o[0]));
        optionalEntries.forEach(([key]) =>
        {
            if (ret.#necessaryKey.has(key))
                throw "Cannot use the same key as both necessary and optional fields";
        });
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
     * @returns {RuleType}
     */
    static array(ruleArray, defaultValueRule = null)
    {
        let ret = new RuleType();

        ret.#array = true;
        ret.#arrayRule = Array.from(ruleArray);
        if (defaultValueRule)
            ret.#arrayDefaultRule = defaultValueRule;

        return ret;
    }

    /**
     * 创建限制长度的 数组 类型规则
     * @param {Array<RuleType>} ruleArray
     * @param {RuleType} defaultValueRule
     * @param {number | null} minLength
     * @param {number | null} maxLength
     * @returns {RuleType}
     */
    static arrayWithLength(ruleArray, defaultValueRule, minLength, maxLength)
    {
        let ret = RuleType.array(ruleArray, defaultValueRule);

        if (Number.isNaN(minLength) || Number.isNaN(maxLength))
            throw "NaN cannot be used as a restriction";
        ret.#arrayMinLength = minLength;
        ret.#arrayMaxLength = maxLength;

        return ret;
    }

    /**
     * 创建 Map类 类型规则
     * @param {RuleType} [keyRule]
     * @param {RuleType} [valueRule]
     * @returns {RuleType}
     */
    static classMap(keyRule = RuleType.any(), valueRule = RuleType.any())
    {
        let ret = new RuleType();
        ret.#buildInClass = true;
        ret.#classTypeName = "Map";
        ret.#classKeyType = keyRule;
        ret.#classValueType = valueRule;
        return ret;
    }

    /**
     * 创建 Set类 类型规则
     * @param {RuleType} [valueRule]
     * @returns {RuleType}
     */
    static classSet(valueRule = RuleType.any())
    {
        let ret = new RuleType();
        ret.#buildInClass = true;
        ret.#classTypeName = "Set";
        ret.#classValueType = valueRule;
        return ret;
    }

    /**
     * 创建 Uint8Array类 类型规则
     * @returns {RuleType}
     */
    static classUint8Array()
    {
        let ret = new RuleType();
        ret.#buildInClass = true;
        ret.#classTypeName = "Uint8Array";
        return ret;
    }

    /**
     * 创建 ArrayBuffer类 类型规则
     * @returns {RuleType}
     */
    static classArrayBuffer()
    {
        let ret = new RuleType();
        ret.#buildInClass = true;
        ret.#classTypeName = "ArrayBuffer";
        return ret;
    }
}

/** a侧父限制状态 */
let parentStateA = false;
/** b侧父限制状态 */
let parentStateB = false;
/**
 * 求交父限制
 * @param {boolean} a
 * @param {boolean} b
 * @returns {boolean}
 */
function intersectParent(a, b)
{
    parentStateA = a;
    parentStateB = b;
    return a && b;
}
/**
 * 合并父限制
 * @param {boolean} a
 * @param {boolean} b
 * @returns {boolean}
 */
function mergeParent(a, b)
{
    parentStateA = a;
    parentStateB = b;
    return a || b;
}
/**
 * 求交值 取其中的非空内容
 * 其中一个为null返回另一个值
 * 当两个都非空且不相等时抛错
 * @param {any} a
 * @param {any} b
 */
function intersectNonNull(a, b)
{
    if ((!parentStateA) || (!parentStateB))
        return null;
    if (a == b)
        return a;
    if (a != null && b != null)
        throw "Unable to intersect RuleType with conflicting types";
    return (a != null ? a : b);
}
/**
 * 合并值 取相同值
 * 当其中一侧父限制为真时 返回这一侧的值
 * 当父限制同时为真时 其中一个为null时为null
 * 都不为null且两个值不相同时报错
 * @param {any} a
 * @param {any} b
 */
function mergeSame(a, b)
{
    if (!parentStateA)
        return b;
    if (!parentStateB)
        return a;
    if (a == null || b == null)
        return null;
    if (a != b)
        throw "Unable to merge Ruletypes with conflicting types";
    return a;
}