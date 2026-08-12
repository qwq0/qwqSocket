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
class RuleType
{
    // -- any --
    /**
     * 任意类型
     * 跳过一切类型判定通过所有类型
     * @type {boolean}
     */
    #any = false;

    // -- number --
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

    // -- boolean --
    /**
     * 允许 boolean 类型
     * @type {boolean}
     */
    #boolean = false;

    // -- string --
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

    // -- bigint --
    /**
     * 允许 bigint 类型
     * @type {boolean}
     */
    #bigint = false;

    // -- array --
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

    // -- object --
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

    // -- 内置类 --
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

    // -- void --
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

    // -- enum --
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
                        case "ArrayBuffer": {
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

                    // if (Object.getPrototypeOf(value) != Object.prototype || Object.getPrototypeOf(value) != null)
                    //     return false;
                    // TODO 添加可选的原型校验

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

        if (this.#any)
            orList.push("any");
        if (this.#number)
            orList.push("number");
        if (this.#boolean)
            orList.push("boolean");
        if (this.#string)
            orList.push("string");
        if (this.#bigint)
            orList.push("bigint");
        if (this.#array)
        {
            if (this.#arrayRule.length == 0)
            {
                if (this.#arrayDefaultRule)
                    orList.push(`Array<${this.#arrayDefaultRule.typeDefine()}>`);
                else
                    orList.push("Array");
            }
            else
            {
                /** @type {Array<string>} */
                let valueTypeList = [];
                let defaultType = (this.#arrayDefaultRule ? this.#arrayDefaultRule.typeDefine() : "never");
                for (let i = 0; i < this.#arrayRule.length; i++)
                {
                    let rule = this.#arrayRule[i];
                    valueTypeList.push(rule ? rule.typeDefine() : defaultType);
                }
                if (this.#arrayDefaultRule)
                    valueTypeList.push("..." + defaultType);
                orList.push("[" + valueTypeList.join(", ") + "]");
            }
        }
        if (this.#object)
        {
            if (this.#keyRuleMap.size == 0)
            {
                if (this.#defaultValueRule)
                    orList.push(`Object<string, ${this.#defaultValueRule.typeDefine()}>`);
                else
                    orList.push(`Object`);
            }
            else
            {
                /** @type {Array<string>} */
                let valueTypeList = [];
                this.#keyRuleMap.forEach((value, key) =>
                {
                    valueTypeList.push(
                        key + (this.#necessaryKey.has(key) ? ": " : "?: ") + value.typeDefine()
                    );
                });
                if (this.#defaultValueRule)
                    valueTypeList.push(`[x: string]?: ${this.#defaultValueRule.typeDefine()}`);
                orList.push("{ " + valueTypeList.join(", ") + " }");
            }
        }
        if (this.#buildInClass)
            orList.push(this.#classTypeName);
        if (this.#enableNull)
            orList.push("null");
        if (this.#enableUndefined)
            orList.push("undefined");
        if (this.#enumSet && this.#enumSet.size > 0)
        {
            this.#enumSet.forEach(o =>
            {
                let type = typeof (o);
                if (
                    type == "number" ||
                    type == "boolean" ||
                    type == "string"
                )
                {
                    orList.push(JSON.stringify(o));
                }
                else if (type == "bigint")
                {
                    orList.push(o.toString() + "n");
                }
                else if (type == "undefined")
                {
                    orList.push("undefined");
                }
                else if (o === null)
                {
                    orList.push("null");
                }
            });
        }

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
     * @param {Object<string, RuleType>} necessary 必须有的成员
     * @param {Object<string, RuleType>} [optional] 可以有的成员
     * @param {RuleType} [defaultValueRule] 如果设置 则允许任何键的成员
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
 * 类型规则合并函数运行的参数
 * @typedef {number | string | RuleType | Array | Set | Map} RuleMergeFuncAllowParamType
 */

/**
 * 求交值 取其中的非空内容
 * 其中一个为null返回另一个值
 * 当两个都非空且不相等时抛错
 * @template {RuleMergeFuncAllowParamType} T
 * @param {T} a
 * @param {T} b
 * @returns {T}
 */
function intersectNonNull(a, b)
{
    if (!(parentStateA && parentStateB))
        return null;
    else if (a == b)
        return a;
    else if (a == null || b == null)
        return (a != null ? a : b);
    else // ab都非空且不相等
        throw "Unable to intersect RuleType with conflicting types";
}
/**
 * 合并值 取相同值
 * 当其中一侧父限制为真时 返回这一侧的值
 * 当父限制同时为真时 其中一个为null时为null
 * 都不为null且两个值不相同时报错
 * @template {RuleMergeFuncAllowParamType} T
 * @param {T} a
 * @param {T} b
 * @returns {T}
 */
function mergeSame(a, b)
{
    if ((!parentStateA) && (!parentStateB))
        return null;
    else if (!parentStateA)
        return b;
    else if (!parentStateB)
        return a;
    else if (a == null || b == null)
        return null;
    else if (a == b)
        return a;
    else // ab都非空且不相等
        throw "Unable to merge Ruletypes with conflicting types";
}

/**
 * 表示一个事件的规则
 */
class EventRule
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
        // TODO 此处应当支持客户端与服务端类型信息不同的场景(若客户端选择不进行类型检查)
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
            if (Object.hasOwn(srcObj, key) && srcObj[key] !== undefined)
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

    /**
     * 生成类型定义格式
     * 获取事件元对象的类型定义格式
     * @returns {string}
     */
    typeDefine()
    {
        let contents = [];
        this.metaObjKeyList.forEach(key =>
        {
            let valueType = this.#metaObjRuleMap.get(key);
            if (valueType == undefined)
                throw "missing meta object type rule";
            let valueTypeDef = valueType.typeDefine();
            contents.push(key + ": " + valueTypeDef + ";");
        });
        return ("{\n" + contents.map(o => "    " + o).join("\n") + "\n}");
    }
}

/**
 * 事件与规则的映射上下文
 */
class MappingRules
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

/**
 * 事件处理器
 * 可以定多个事件响应函数
 * @template {*} T
 */
class EventHandler
{
    /**
     * 回调列表
     * @type {Array<function(T): void>}
     */
    cbList = [];
    /**
     * 单次回调列表
     * @type {Array<function(T): void>}
     */
    onceCbList = [];
    /**
     * 单次触发Promise复用
     * @type {Promise<T>}
     */
    #oncePromiseReuse = null;

    /**
     * 添加响应函数
     * @param {function(T): void} cb
     */
    add(cb)
    {
        this.cbList.push(cb);
    }

    /**
     * 添加单次响应函数
     * 触发一次事件后将不再响应
     * @param {function(T): void} cb
     */
    addOnce(cb)
    {
        this.onceCbList.push(cb);
    }

    /**
     * 返回一个Primise
     * 下次响应时此primise将解决
     * @returns {Promise<T>}
     */
    oncePromise()
    {
        if (!this.#oncePromiseReuse)
        {
            this.#oncePromiseReuse = new Promise(resolve =>
            {
                this.addOnce(e => {
                    this.#oncePromiseReuse = null;
                    resolve(e);
                });
            });
        }
        return this.#oncePromiseReuse;
    }

    /**
     * 移除响应函数
     * @param {function(T): void} cb
     */
    remove(cb)
    {
        let ind = this.cbList.indexOf(cb);
        if (ind > -1)
        {
            this.cbList.splice(ind, 1);
        }
        else
        {
            ind = this.onceCbList.indexOf(cb);
            if (ind > -1)
            {
                this.onceCbList.splice(ind, 1);
            }
        }
    }

    /**
     * 移除所有响应函数
     */
    removeAll()
    {
        this.cbList = [];
        this.onceCbList = [];
    }

    /**
     * 触发事件
     * @param {T} e
     */
    trigger(e)
    {
        this.cbList.forEach(async (o) => { o(e); });
        this.onceCbList.forEach(async (o) => { o(e); });
        this.onceCbList = [];
    }

    /**
     * 存在监听器
     * @returns {boolean}
     */
    existListener()
    {
        return (this.cbList.length > 0 || this.onceCbList.length > 0);
    }
}

/**
 * 连接到 qwq-socket 服务器的客户端实例
 * 绑定到一个服务器上下文
 */
class QwQSocketServerClient
{
    /**
     * @type {import("./QwQSocketServer").QwQSocketServer}
     */
    #server = null;

    /**
     * 此服务器实例的映射规则
     * 表示服务端触发的事件相关规则
     * 在整个 服务端实例 间共享
     * @type {MappingRules}
     */
    #serverMappingRules = null;

    /**
     * 客户端的映射规则
     * 表示客户端触发的事件相关规则
     * 在整个 服务端实例 间共享
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
     * @type {{ [x: string | number | symbol]: any }}
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
     * @returns {QwQSocketServerClient}
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
     * 触发本端事件
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

/**
 * qwq-socket 服务器
 * 表示一个可接受客户端连接的服务器上下文
 */
class QwQSocketServer
{
    /**
     * 服务器的映射规则
     * 表示服务端触发的事件相关规则
     * @type {MappingRules}
     */
    serverMappingRules = new MappingRules();
    /**
     * 客户端的映射规则
     * 表示客户端触发的事件相关规则
     * @type {MappingRules}
     */
    clientMappingRules = new MappingRules();

    /**
     * 创建连接到此服务端的客户端
     * @returns {QwQSocketServerClient}
     */
    createClient()
    {
        let ret = QwQSocketServerClient.create(this);
        return ret;
    }
}

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
class QwQSocketClient
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
     * @type {{ [x: string | number | symbol]: any }}
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
     * 触发本端事件
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
            let eventRule = this.#clientMappingRules.getRuleByShort(shortName);
            if (!eventRule)
                throw "The short name provided by the server does not exist";
            let eventMetaObj = eventRule.verifyGetArray(body);
            this.#triggerLocalEvent(eventRule.eventName, eventMetaObj);
            return;
        }

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
                // 以事件名触发事件并报告简短名
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
                // 报告服务端事件对应的简短名
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
                throw "protocol error";
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

/**
 * 36的8次方
 */
const num_36_pow_8 = 2821109907456;

/**
 * 生成唯一字符串(qwq-uid)
 * 基于毫秒级时间和随机数
 * 
 * qwq-uid格式
 * 仅由 小写字母 数字 连字符 组成
 * 不以连字符开头或结尾
 * 不存在两个相邻的连字符
 * 即由零或几个连字符分隔的多个字母和数字子串
 * 第一个子串为36进制的毫秒级时间戳
 * 其后的子串为36进制的随机数
 * 
 * 优先安全随机
 * 当安全随机不可用时回退到普通随机(不保证安全性)
 * 
 * @param {number} [randomSection] 随机节数量
 * @returns {string}
 */
function uniqueIdentifierString(randomSection = 2)
{
    var ret = Math.floor(Date.now()).toString(36);
    if (globalThis?.crypto?.getRandomValues)
    {
        let randomBuffer = crypto.getRandomValues(new Uint8Array(randomSection * 6));
        for (let i = 0; i < randomSection; i++)
        {
            let value = 0;
            for (let j = 0; j < 6; j++)
                value = (value + randomBuffer[(i * 6) + j]) / 256;
            ret += "-" + Math.floor(Math.random() * num_36_pow_8).toString(36);
        }
    }
    else
    {
        for (let i = 0; i < randomSection; i++)
            ret += "-" + Math.floor(Math.random() * num_36_pow_8).toString(36);
    }
    return ret;
}

/**
 * 查询时错误
 */
class QueryError
{
    /**
     * 错误原因
     * @type {string}
     */
    cause = "";

    /**
     * 请求错误
     * 在请求处理函数中抛出将返回错误
     * @param {string} cause
     */
    constructor(cause)
    {
        this.cause = cause;
    }

    toString()
    {
        return `QueryError: ${this.cause}`;
    }
}

/**
 * 查询超时错误
 * 当发起查询超时时抛出
 */
class QueryTimeoutError extends QueryError
{
    constructor()
    {
        super("Timeout");
    }

    toString()
    {
        return `QueryError: Timeout`;
    }
}

const metaObjQueryIdKey$1 = "-query-id";
const metaObjCauseKey$1 = "-cause";

/**
 * 绑定器操作器
 * 用于操作socket发送事件或查询
 * @template {QwQSocketClient | QwQSocketServerClient} T
 */
class BinderOperator
{
    /**
     * 操作器的操作目标
     * @type {T}
     */
    #target = null;

    /**
     * 触发事件映射对象
     * 调用函数触发对端事件
     * @type {Object<string, (metaObj: Object) => void>}
     */
    trigger = {};

    /**
     * 查询映射对象
     * 调用函数触发对端事件
     * @type {Object<string, (metaObj: Object, timeout?: number, timeoutBehavior?: "reject" | "resolve" | "discard") => Promise<Object>>}
     */
    query = {};

    /**
     * @param {T} target
     */
    constructor(target)
    {
        this.#target = target;
    }

    /**
     * 添加触发器
     * @param {string} eventName
     */
    addTrigger(eventName)
    {
        if (this.trigger[eventName])
            throw `Trigger "${eventName}" already exists`;
        this.trigger[eventName] = (metaObj) =>
        {
            this.#target.sendTrigger(eventName, metaObj);
        };
    }

    /**
     * 添加查询
     * @param {string} queryName
     */
    addQuery(queryName)
    {
        if (this.query[queryName])
            throw `Query "${queryName}" already exists`;

        let requestEventName = queryName + "-req";
        let respondEventName = queryName + "-rsp";
        let errorRespondEventName = queryName + "-ersp";

        if (this.#target.eventListener[respondEventName])
            throw `Unable to bind query "${queryName}" because response event listener is occupied`;
        if (this.#target.eventListener[errorRespondEventName])
            throw `Unable to bind query "${queryName}" because error response event listener is occupied`;

        /**
         * 查询中的映射
         * 查询id 到 查询响应操作对象 映射
         * @type {Map<string, {
         *  resolve: (value: any) => void,
         *  reject: (err: any) => void,
         *  startTime: number,
         *  timeoutId?: number | NodeJS.Timeout
         * }>}
         */
        let inQueryMap = new Map();

        this.#target.eventListener[respondEventName] = (/** @type {any} */ metaObj) =>
        {
            let queryId = metaObj[metaObjQueryIdKey$1];
            let inQueryObj = inQueryMap.get(queryId);
            if (inQueryObj)
            {
                inQueryMap.delete(queryId);
                delete metaObj[metaObjQueryIdKey$1];

                inQueryObj.resolve(metaObj);
            }
        };
        this.#target.eventListener[errorRespondEventName] = (/** @type {any} */ metaObj) =>
        {
            let queryId = metaObj[metaObjQueryIdKey$1];
            let inQueryObj = inQueryMap.get(queryId);
            if (inQueryObj)
            {
                inQueryMap.delete(queryId);

                inQueryObj.reject(new QueryError(metaObj[metaObjCauseKey$1]));
            }
        };

        this.query[queryName] = (queryMetaObj, timeout, timeoutBehavior) =>
        {
            if (queryMetaObj[metaObjQueryIdKey$1] != undefined)
                throw `Cannot use internally occupied name "${metaObjQueryIdKey$1}"`;

            return new Promise((resolve, reject) =>
            {
                let queryId = uniqueIdentifierString();
                let metaObj = Object.assign({}, queryMetaObj);
                metaObj[metaObjQueryIdKey$1] = queryId;

                inQueryMap.set(queryId, {
                    resolve,
                    reject,
                    startTime: Date.now(),
                    timeoutId: (
                        timeout != undefined ?
                            setTimeout(() =>
                            {
                                let inQueryObj = inQueryMap.get(queryId);
                                inQueryMap.delete(queryId);

                                if (timeoutBehavior == "resolve")
                                    inQueryObj.resolve(null);
                                else if (timeoutBehavior != "discard")
                                    inQueryObj.reject(new QueryTimeoutError());
                            }, timeout) :
                            undefined
                    )
                });

                this.#target.sendTrigger(requestEventName, metaObj);
            });
        };
    }
}

/**
 * 事件监听器函数
 * @typedef {(
 *  ((eventMetaObj: any, target: QwQSocketServerClient | QwQSocketClient) => void) |
 *  ((eventMetaObj: any, target: QwQSocketServerClient) => void) |
 *  ((eventMetaObj: any, target: QwQSocketClient) => void)
 * )} QwQSocketEventListener
 */

/**
 * 查询处理器函数
 * @typedef {(
 *  ((eventMetaObj: any, target: QwQSocketServerClient | QwQSocketClient) => (Promise<any> | any)) |
 *  ((eventMetaObj: any, target: QwQSocketServerClient) => (Promise<any> | any)) |
 *  ((eventMetaObj: any, target: QwQSocketClient) => (Promise<any> | any))
 * )} QwQSocketQueryProcessor
 */

const metaObjQueryIdKey = "-query-id";
const metaObjCauseKey = "-cause";

/**
 * 事件规则绑定器
 * 创建一个事件列表 然后附加到服务端或者客户端
 */
class RuleBinder
{
    /**
     * 事件名列表
     * @type {Array<string>}
     */
    #eventNameList = [];

    /**
     * 事件名集合
     * 包括处理后的查询名
     * @type {Set<string>}
     */
    #eventNameSet = new Set();

    /**
     * 事件名 到 事件规则 映射
     * 包括处理后的查询规则
     * @type {Map<string, EventRule>}
     */
    #eventRuleMap = new Map();

    /**
     * 事件名 到 事件监听器 映射
     * @type {Map<string, QwQSocketEventListener>}
     */
    #eventListenerMap = new Map();

    /**
     * 查询名集合
     * @type {Set<string>}
     */
    #queryNameSet = new Set();

    /**
     * 查询名 到 查询原始规则信息 映射
     * 仅在生成类型定义时使用
     * @type {Map<string, { req: EventRule, rsp: EventRule }>}
     */
    #queryRuleMap = new Map();

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
     * 事件监听器对象缓存
     * 将绑定器附加到服务器的客户端实例时使用
     * @type {Object}
     */
    #eventListenerObjectCache = null;

    /**
     * @private
     */
    constructor()
    { }

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
     * @param {QwQSocketEventListener} listener
     */
    setEventListener(eventName, listener)
    {
        if (!RuleBinder.#isValidEventName(eventName))
            throw `"${eventName}" is not a valid event name`;
        this.#addEventName(eventName);
        if (this.#eventListenerMap.has(eventName))
            throw `The "${eventName}" event listener is defined repeatedly`;
        this.#eventListenerMap.set(eventName, listener);
        this.#eventListenerObjectCache = null;
    }

    /**
     * 设置多个事件监听器
     * @param {Object<string, QwQSocketEventListener>} eventListeners
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

        this.#queryNameSet.add(queryName);

        let requestEventName = queryName + "-req";
        let respondEventName = queryName + "-rsp";
        let errorRespondEventName = queryName + "-ersp";

        if (requestRule.hasKey(metaObjQueryIdKey) || responseRule.hasKey(metaObjQueryIdKey))
            throw `Cannot use internally occupied name "${metaObjQueryIdKey}"`;

        this.#queryRuleMap.set(queryName, { req: requestRule, rsp: responseRule });

        let opposite = this.#opposite;
        if (opposite == null)
            throw "Cannot bind event response because the opposite does not exist";

        // 绑定请求事件
        this.#addEventName(requestEventName);
        if (this.#eventRuleMap.has(requestEventName))
            throw `The "${queryName}" query request rule is defined repeatedly`;
        this.#eventRuleMap.set(
            requestEventName,
            requestRule.getCopy().addParamToFront(metaObjQueryIdKey, RuleType.string())
        );

        // 绑定响应事件
        opposite.#addEventName(respondEventName);
        if (opposite.#eventRuleMap.has(respondEventName))
            throw `The "${queryName}" query response rule is defined repeatedly`;
        opposite.#eventRuleMap.set(
            respondEventName,
            responseRule.getCopy().addParamToFront(metaObjQueryIdKey, RuleType.string())
        );

        // 绑定错误响应事件
        opposite.#addEventName(errorRespondEventName);
        if (opposite.#eventRuleMap.has(errorRespondEventName))
            throw `The "${queryName}" query error-response rule is defined repeatedly`;
        opposite.#eventRuleMap.set(
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
     * 添加多个查询规则
     * @param {Object<string, { request: EventRule, response: EventRule }>} queryRules
     */
    addQueryRules(queryRules)
    {
        Object.entries(queryRules).forEach(([queryName, queryRulePair]) =>
        {
            this.addQueryRule(queryName, queryRulePair.request, queryRulePair.response);
        });
    }

    /**
     * 设置查询处理函数
     * @param {string} queryName
     * @param {QwQSocketQueryProcessor} processor
     */
    setQueryProcessor(queryName, processor)
    {
        if (!RuleBinder.#isValidEventName(queryName))
            throw `"${queryName}" is not a valid query name`;

        this.#queryNameSet.add(queryName);

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
     * 设置多个查询处理函数
     * @param {Object<string, QwQSocketQueryProcessor>} queryProcessors
     */
    setQueryProcessors(queryProcessors)
    {
        Object.entries(queryProcessors).forEach(([queryName, processor]) =>
        {
            this.setQueryProcessor(queryName, processor);
        });
    }

    /**
     * 应用到实例
     *  - 对于 Server 设置事件规则
     *  - 对于 ServerClient 设置监听器函数
     *  - 对于 Client 同时设置事件规则与监听器
     * @param {QwQSocketServer | QwQSocketServerClient | QwQSocketClient} target
     */
    applyToInstance(target)
    {
        if (this.#bound == "server") // 应用到服务端
        {
            if (target instanceof QwQSocketServer) // 应用到 服务端 实例
            {
                // 向 服务端 实例 添加服务端事件的规则
                this.#eventNameList.forEach(eventName =>
                {
                    let eventRule = this.#eventRuleMap.get(eventName);
                    if (!eventRule)
                        throw `Cannot attach to target because rule "${eventName}" is missing`;
                    target.serverMappingRules.serverAddEventRule(eventName, eventRule.getCopy());
                });

                // 向 服务端 实例 添加客户端事件的规则
                if (this.#opposite)
                {
                    let opposite = this.#opposite;
                    opposite.#eventNameList.forEach(eventName =>
                    {
                        let eventRule = opposite.#eventRuleMap.get(eventName);
                        if (!eventRule)
                            throw `Cannot attach to target because rule "${eventName}" is missing`;
                        target.clientMappingRules.serverAddEventRule(eventName, eventRule.getCopyWithoutType());
                    });
                }
            }
            else if (target instanceof QwQSocketServerClient) // 应用到 服务端的单个客户端 实例
            {
                // 向 服务端的单个客户端 实例 添加事件监听器
                if (Object.keys(target.eventListener).length == 0 && target.eventListener.constructor == Object)
                { // 使用缓存
                    if (!this.#eventListenerObjectCache)
                    {
                        this.#eventListenerObjectCache = {};
                        this.#eventNameList.forEach(eventName =>
                        {
                            let eventListener = this.#eventListenerMap.get(eventName);
                            if (eventListener)
                                this.#eventListenerObjectCache[eventName] = eventListener;
                        });
                    }
                    target.eventListener = Object.create(this.#eventListenerObjectCache);
                }
                else
                { // 不使用缓存
                    this.#eventNameList.forEach(eventName =>
                    {
                        let eventListener = this.#eventListenerMap.get(eventName);
                        if (eventListener)
                        {
                            if (target.eventListener[eventName])
                                throw `Cannot attach to target because a listener "${eventName}" is already bound on the target`;
                            // @ts-ignore
                            target.eventListener[eventName] = eventListener;
                        }
                    });
                }
            }
            else
                throw "The binding type does not match the target (should bind to server)";

        }
        else if (this.#bound == "client") // 应用到客户端
        {
            if (!(target instanceof QwQSocketClient))
                throw "The binding type does not match the target";
            this.#eventNameList.forEach(eventName =>
            {
                let eventRule = this.#eventRuleMap.get(eventName);
                if (!eventRule)
                    throw `Cannot attach to target because rule "${eventName}" is missing`;
                target.addEventRule(eventName, eventRule.getCopy());

                let eventListener = this.#eventListenerMap.get(eventName);
                if (eventListener)
                {
                    if (target.eventListener[eventName])
                        throw `Cannot attach to target because a listener "${eventName}" is already bound on the target`;
                    // @ts-ignore
                    target.eventListener[eventName] = eventListener;
                }
            });
        }
        else
            throw "Unsupported binding type (should bind to client)";
    }

    /**
     * 创建操作器
     * @template {QwQSocketServerClient | QwQSocketClient} K
     * @param {K} target 
     * @returns {BinderOperator<K>}
     */
    createOperator(target)
    {
        let opposite = this.#opposite;
        if (opposite == null)
            throw "Cannot create operator because the opposite RuleBinder does not exist";
        let ret = new BinderOperator(target);
        opposite.#eventNameList.forEach(eventName =>
        {
            ret.addTrigger(eventName);
        });
        opposite.#queryNameSet.forEach(queryName =>
        {
            ret.addQuery(queryName);
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
     * 创建类型定义文件
     * 便于在调用时查询
     * @returns {{
     *  event: Array<{
     *      name: string,
     *      metaType: string
     *  }>,
     *  query: Array<{
     *      name: string,
     *      reqType: string,
     *      rspType: string
     *  }>
     * }}
     */
    genTypeDefine()
    {
        /** @type {Map<string, { metaType: string }>} */
        let eventDefMap = new Map();
        /** @type {Map<string, { reqType: string, rspType: string }>} */
        let queryDefMap = new Map();

        this.#eventNameList.forEach(o =>
        {
            let splIndex = o.lastIndexOf("-");
            if (splIndex == -1)
            { // 事件
                let evnetRule = this.#eventRuleMap.get(o);
                eventDefMap.set(o, {
                    metaType: evnetRule.typeDefine()
                });
            }
            else
            { // 查询
                let suffix = o.slice(splIndex + 1);
                if (
                    suffix != "req" &&
                    suffix != "rsp" &&
                    suffix != "ersp"
                )
                {
                    throw "unknow surfix name";
                }
            }
        });

        this.#queryNameSet.forEach(o =>
        {
            let queryRule = this.#queryRuleMap.get(o);
            queryDefMap.set(o, {
                reqType: queryRule.req.typeDefine(),
                rspType: queryRule.rsp.typeDefine()
            });
        });

        return {
            event: Array.from(eventDefMap.entries()).map(o => ({
                name: o[0],
                metaType: o[1].metaType
            })),
            query: Array.from(queryDefMap.entries()).map(o => ({
                name: o[0],
                reqType: o[1].reqType,
                rspType: o[1].rspType
            }))
        };
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

/**
 * 逐行添加缩进
 * @param {string} str
 * @param {number} level
 * @param {boolean} ignoreFirstLine
 * @returns {string}
 */
function addIndent(str, level = 1, ignoreFirstLine = false)
{
    let indent = "";
    for (let i = 0; i < level; i++)
        indent += "    ";
    return str.split("\n").map((o, i) => (ignoreFirstLine && i == 0 ? o : indent + o)).join("\n");
}

/**
 * 给字符串收尾添加引号
 * @param {string} str
 * @returns {string}
 */
function strQuote(str)
{
    if (typeof (str) != "string")
        throw "strQuote param is not string";
    return JSON.stringify(str);
}

/**
 * 通过绑定器生成类型定义文件
 * @param {RuleBinder} serverBinder
 * @param {RuleBinder} clientBinder
 * @param {{ 
 *  extend?: {
 *      lisienerBind?: boolean,
 *      lisienerBindType?: "type" | "interface" | "namespace",
 *      importModuleName?: string,
 *      importClientType?: boolean
 *  },
 *  preset?: {
 *      lisienerBind?: boolean | "type" | "interface" | "namespace"
 *  }
 * }} [options]
 * @returns {string}
 */
function getTypeDefineByBinder(serverBinder, clientBinder, options = {})
{
    options = Object.assign({}, options);
    for (let key of ["extend", "preset"])
    {
        if (options[key])
            options[key] = Object.assign({}, options[key]);
        else
            options[key] = {};
    }

    // 预设配置
    if (options.preset.lisienerBind)
    {
        options.extend.lisienerBind = true;
        options.extend.importClientType = true;
        if (typeof (options.preset.lisienerBind) == "string")
            options.extend.lisienerBindType = options.preset.lisienerBind;
        else
            options.extend.lisienerBindType = "type";
    }

    let serverDefine = serverBinder.genTypeDefine();
    let clientDefine = clientBinder.genTypeDefine();

    let ret = "";
    let separator = "\n\n";

    // --- 事件类型 ---

    ret += ([
        "export type serverBinderEventMap = {",
        serverDefine.event.map(o => addIndent(`${o.name}: ${o.metaType};`)).join("\n"),
        "};"
    ]).join("\n") + separator;

    ret += ([
        "export type serverBinderQueryMap = {",
        addIndent(
            serverDefine.query.map(o => ([
                `${o.name}: {`,
                addIndent(`req: ${o.reqType};`),
                addIndent(`rsp: ${o.rspType};`),
                `};`
            ]).join("\n")).join("\n")
        ),
        "};"
    ]).join("\n") + separator;


    ret += ([
        "export type clientBinderEventMap = {",
        clientDefine.event.map(o => addIndent(`${o.name}: ${o.metaType};`)).join("\n"),
        "};"
    ]).join("\n") + separator;

    ret += ([
        "export type clientBinderQueryMap = {",
        addIndent(
            clientDefine.query.map(o => ([
                `${o.name}: {`,
                addIndent(`req: ${o.reqType};`),
                addIndent(`rsp: ${o.rspType};`),
                `};`
            ]).join("\n")).join("\n"),
        ),
        "};"
    ]).join("\n") + separator;

    // --- 操作器 ---

    let extendContent = ([
        "export interface ServerSocketOperator",
        "{",
        "    trigger: {",
        "        [K in keyof clientBinderEventMap]?: (e: clientBinderEventMap[K]) => void;",
        "    };",
        "    query: {",
        `        [K in keyof clientBinderQueryMap]?: (e: clientBinderQueryMap[K]["req"]) => Promise<clientBinderQueryMap[K]["rsp"]>;`,
        "    };",
        "}",
        "",
        "export interface ClientSocketOperator",
        "{",
        "    trigger: {",
        "        [K in keyof serverBinderEventMap]?: (e: serverBinderEventMap[K]) => void;",
        "    };",
        "    query: {",
        `        [K in keyof serverBinderQueryMap]?: (e: serverBinderQueryMap[K]["req"]) => Promise<serverBinderQueryMap[K]["rsp"]>;`,
        "    };",
        "}",
        ""
    ]);

    // --- 扩展内容 ---

    if (options.extend.importClientType)
    { // 导入客户端类型
        let importModule = options.extend.importModuleName;
        if (!importModule)
        {
            importModule = "qwq-socket";
        }
        extendContent.push(...([
            `type QwQSocketClient = import(${strQuote(importModule)}).QwQSocketClient;`,
            `type QwQSocketServerClient = import(${strQuote(importModule)}).QwQSocketServerClient;`,
            ""
        ]));
    }

    if (options.extend.lisienerBind)
    { // 监听器绑定

        /**
         * 监听器类型块
         * @param {"Server" | "Client"} direction
         * @param {"event" | "query"} oper
         * @param {"type" | "interface" | "namespace"} type
         * @returns {string}
         */
        function listenerTypeBlock(direction, oper, type)
        {
            let useTypeName = `${direction == "Server" ? "server" : "client"}Binder${oper == "query" ? "Query" : "Event"}Map`;

            /**
             * 监听器类型单行
             * @param {string} name
             * @returns {string}
             */
            function listenerFunctionType(name)
            {
                return (
                    `(e: ${useTypeName}[${name}]${oper == "query" ? `["req"]` : ""}, client: ${direction == "Server" ? "QwQSocketServerClient" : "QwQSocketClient"})` +
                    ` => ${oper == "query" ? `${useTypeName}[K]["rsp"] | Promise<${useTypeName}[K]["rsp"]>` : "void"}`
                );
            }

            /**
             * 监听器类型行
             * @returns {string}
             */
            function listenerTypeLines()
            {
                if (type == "type")
                {
                    return `    [K in keyof ${useTypeName}]?: ${listenerFunctionType("K")};`;
                }
                else
                {
                    let arr = (direction == "Server" ? serverDefine : clientDefine)[oper];
                    return arr.map((/** @type {{ name: string; }} */ o) =>
                        `    ${type == "interface" ? `${o.name}:` : `type ${o.name} =`} ${listenerFunctionType(strQuote(o.name))};`
                    ).join("\n");
                }
            }

            return ([
                `export ${type} ${direction}Bind${oper == "query" ? "QueryProcessor" : "EventLisiener"}${type == "type" ? " = " : "\n"}{`,
                listenerTypeLines(),
                "}"
            ]).join("\n");
        }

        let exportType = options.extend.lisienerBindType;
        if (!exportType)
        {
            exportType = "type";
        }

        extendContent.push(...([
            listenerTypeBlock("Server", "event", exportType),
            "",
            listenerTypeBlock("Server", "query", exportType),
            "",
            listenerTypeBlock("Client", "event", exportType),
            "",
            listenerTypeBlock("Client", "query", exportType),
            ""
        ]));
    }

    ret += extendContent.join("\n") + separator;
    return ret;
}

export { BinderOperator, EventRule, QueryError, QueryTimeoutError, QwQSocketClient, QwQSocketServer, QwQSocketServerClient, RuleBinder, RuleType, getTypeDefineByBinder };
