[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / RuleType

# Class: RuleType

Defined in: [qwqsocket.d.ts:19](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L19)

规则类型
用于对值的类型进行检查

此类的值仅在创建时变化
创建后的RuleType类无法发生变化

包含几个基本类型
 - number
 - boolean
 - string
 - bigint
 - array
 - object
 - buildInClass
 - null
 - undefined

## Constructors

### Constructor

> **new RuleType**(): `RuleType`

#### Returns

`RuleType`

## Methods

### intersect()

> **intersect**(`target`): `RuleType`

Defined in: [qwqsocket.d.ts:175](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L175)

求交两个规则
这不是严格求交
! 注意 ! 应当避免使用此方法
此方法可能在未来被弃用

#### Parameters

##### target

`RuleType`

#### Returns

`RuleType`

***

### merge()

> **merge**(`target`): `RuleType`

Defined in: [qwqsocket.d.ts:166](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L166)

合并两个规则
这不是严格合并
应当仅合并不同基本类型的值

#### Parameters

##### target

`RuleType`

#### Returns

`RuleType`

***

### verify()

> **verify**(`value`): `boolean`

Defined in: [qwqsocket.d.ts:158](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L158)

验证值是否符合此规则

#### Parameters

##### value

`any`

#### Returns

`boolean`

***

### any()

> `static` **any**(): `RuleType`

Defined in: [qwqsocket.d.ts:29](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L29)

创建 通过 任意类型的规则

#### Returns

`RuleType`

***

### array()

> `static` **array**(`ruleArray`, `defaultValueRule?`): `RuleType`

Defined in: [qwqsocket.d.ts:121](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L121)

创建 数组 类型规则

#### Parameters

##### ruleArray

`RuleType`[]

##### defaultValueRule?

`RuleType`

#### Returns

`RuleType`

***

### arrayWithLength()

> `static` **arrayWithLength**(`ruleArray`, `defaultValueRule`, `minLength`, `maxLength`): `RuleType`

Defined in: [qwqsocket.d.ts:130](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L130)

创建限制长度的 数组 类型规则

#### Parameters

##### ruleArray

`RuleType`[]

##### defaultValueRule

`RuleType`

##### minLength

`number`

##### maxLength

`number`

#### Returns

`RuleType`

***

### bigint()

> `static` **bigint**(): `RuleType`

Defined in: [qwqsocket.d.ts:92](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L92)

创建 bigint 类型规则

#### Returns

`RuleType`

***

### boolean()

> `static` **boolean**(): `RuleType`

Defined in: [qwqsocket.d.ts:87](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L87)

创建 boolean 类型规则

#### Returns

`RuleType`

***

### classArrayBuffer()

> `static` **classArrayBuffer**(): `RuleType`

Defined in: [qwqsocket.d.ts:153](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L153)

创建 ArrayBuffer类 类型规则

#### Returns

`RuleType`

***

### classMap()

> `static` **classMap**(`keyRule?`, `valueRule?`): `RuleType`

Defined in: [qwqsocket.d.ts:137](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L137)

创建 Map类 类型规则

#### Parameters

##### keyRule?

`RuleType`

##### valueRule?

`RuleType`

#### Returns

`RuleType`

***

### classSet()

> `static` **classSet**(`valueRule?`): `RuleType`

Defined in: [qwqsocket.d.ts:143](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L143)

创建 Set类 类型规则

#### Parameters

##### valueRule?

`RuleType`

#### Returns

`RuleType`

***

### classUint8Array()

> `static` **classUint8Array**(): `RuleType`

Defined in: [qwqsocket.d.ts:148](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L148)

创建 Uint8Array类 类型规则

#### Returns

`RuleType`

***

### enum()

> `static` **enum**(`valueList`): `RuleType`

Defined in: [qwqsocket.d.ts:35](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L35)

创建枚举型规则

#### Parameters

##### valueList

`Iterable`\<`any`\>

#### Returns

`RuleType`

***

### finite()

> `static` **finite**(): `RuleType`

Defined in: [qwqsocket.d.ts:63](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L63)

创建 number 中的 有限数 类型规则

#### Returns

`RuleType`

***

### finiteRange()

> `static` **finiteRange**(`minValue`, `maxValue`): `RuleType`

Defined in: [qwqsocket.d.ts:70](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L70)

创建 限制范围的 有限数 类型规则

#### Parameters

##### minValue

`number`

##### maxValue

`number`

#### Returns

`RuleType`

***

### integer()

> `static` **integer**(): `RuleType`

Defined in: [qwqsocket.d.ts:46](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L46)

创建 number 中的 整数 类型规则

#### Returns

`RuleType`

***

### integerRange()

> `static` **integerRange**(`minValue`, `maxValue`): `RuleType`

Defined in: [qwqsocket.d.ts:53](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L53)

创建 限制范围的 整数 类型规则

#### Parameters

##### minValue

`number`

##### maxValue

`number`

#### Returns

`RuleType`

***

### never()

> `static` **never**(): `RuleType`

Defined in: [qwqsocket.d.ts:24](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L24)

创建 不通过 任何值的规则

#### Returns

`RuleType`

***

### nonnegativeInteger()

> `static` **nonnegativeInteger**(): `RuleType`

Defined in: [qwqsocket.d.ts:58](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L58)

创建 number 中的 非负整数 类型规则

#### Returns

`RuleType`

***

### null()

> `static` **null**(): `RuleType`

Defined in: [qwqsocket.d.ts:97](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L97)

创建 null 类型规则

#### Returns

`RuleType`

***

### number()

> `static` **number**(): `RuleType`

Defined in: [qwqsocket.d.ts:41](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L41)

创建 number 类型规则
允许所有 number 类型

#### Returns

`RuleType`

***

### object()

> `static` **object**(`necessary`, `optional?`, `defaultValueRule?`): `RuleType`

Defined in: [qwqsocket.d.ts:110](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L110)

创建 对象 类型规则

#### Parameters

##### necessary

##### optional?

##### defaultValueRule?

`RuleType`

#### Returns

`RuleType`

***

### string()

> `static` **string**(): `RuleType`

Defined in: [qwqsocket.d.ts:75](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L75)

创建 string 类型规则

#### Returns

`RuleType`

***

### stringWithLength()

> `static` **stringWithLength**(`minLength`, `maxLength`): `RuleType`

Defined in: [qwqsocket.d.ts:82](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L82)

创建限制长度的 string 类型规则

#### Parameters

##### minLength

`number`

##### maxLength

`number`

#### Returns

`RuleType`

***

### undefined()

> `static` **undefined**(): `RuleType`

Defined in: [qwqsocket.d.ts:102](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L102)

创建 undefined 类型规则

#### Returns

`RuleType`
