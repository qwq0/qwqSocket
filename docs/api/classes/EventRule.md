[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / EventRule

# Class: EventRule

Defined in: [qwqsocket.d.ts:222](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L222)

表示一个事件的规则

## Constructors

### Constructor

> **new EventRule**(): `EventRule`

#### Returns

`EventRule`

## Properties

### eventName

> **eventName**: `string`

Defined in: [qwqsocket.d.ts:248](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L248)

事件名

***

### mappingRules

> **mappingRules**: `MappingRules`

Defined in: [qwqsocket.d.ts:258](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L258)

事件规则 所在的 映射规则

***

### metaObjKeyList

> **metaObjKeyList**: `string`[]

Defined in: [qwqsocket.d.ts:263](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L263)

事件元对象的key列表

***

### shortName

> **shortName**: `string`

Defined in: [qwqsocket.d.ts:253](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L253)

简短名

## Methods

### addParamToEnd()

> **addParamToEnd**(`key`, `rule?`): `EventRule`

Defined in: [qwqsocket.d.ts:310](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L310)

在事件规则元对象结尾追加参数

#### Parameters

##### key

`string`

##### rule?

[`RuleType`](RuleType.md)

#### Returns

`EventRule`

返回当前规则元对象本身

***

### addParamToFront()

> **addParamToFront**(`key`, `rule?`): `EventRule`

Defined in: [qwqsocket.d.ts:317](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L317)

在事件规则元对象开头追加参数

#### Parameters

##### key

`string`

##### rule?

[`RuleType`](RuleType.md)

#### Returns

`EventRule`

返回当前规则元对象本身

***

### getCopy()

> **getCopy**(): `EventRule`

Defined in: [qwqsocket.d.ts:268](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L268)

获取此事件规则的副本

#### Returns

`EventRule`

***

### getCopyWithoutType()

> **getCopyWithoutType**(): `EventRule`

Defined in: [qwqsocket.d.ts:273](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L273)

获取此事件规则无类型检查的副本

#### Returns

`EventRule`

***

### hasKey()

> **hasKey**(`key`): `boolean`

Defined in: [qwqsocket.d.ts:279](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L279)

是否拥有指定的key

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### metaObjToArray()

> **metaObjToArray**(`srcObj`): `any`[]

Defined in: [qwqsocket.d.ts:303](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L303)

转换元数据对象到数组

#### Parameters

##### srcObj

`object`

#### Returns

`any`[]

***

### resetKeyList()

> **resetKeyList**(`newKeyList`): `void`

Defined in: [qwqsocket.d.ts:285](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L285)

重设key列表
新的列表和原列表应当仅顺序不同 元素内容相同

#### Parameters

##### newKeyList

`string`[]

#### Returns

`void`

***

### verifyGetArray()

> **verifyGetArray**(`srcArray`): `object`

Defined in: [qwqsocket.d.ts:291](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L291)

从数组验证并获取事件元数据对象

#### Parameters

##### srcArray

`any`[]

#### Returns

`object`

***

### verifyGetObject()

> **verifyGetObject**(`srcObj`): `object`

Defined in: [qwqsocket.d.ts:297](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L297)

从元数据对象验证并获取事件元数据对象

#### Parameters

##### srcObj

`object`

#### Returns

`object`

***

### create()

> `static` **create**(`metaObjRuleList`): `EventRule`

Defined in: [qwqsocket.d.ts:230](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L230)

创建事件规则

#### Parameters

##### metaObjRuleList

`object`[]

#### Returns

`EventRule`

***

### createWithoutType()

> `static` **createWithoutType**(`metaObjKeyList`): `EventRule`

Defined in: [qwqsocket.d.ts:241](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L241)

创建事件规则
不检查类型

#### Parameters

##### metaObjKeyList

`object`[]

#### Returns

`EventRule`
