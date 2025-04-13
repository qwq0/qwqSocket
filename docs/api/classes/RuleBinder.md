[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / RuleBinder

# Class: RuleBinder

Defined in: [qwqsocket.d.ts:560](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L560)

事件规则绑定器
创建一个事件列表 然后附加到服务端或者客户端

## Constructors

### Constructor

> **new RuleBinder**(): `RuleBinder`

#### Returns

`RuleBinder`

## Methods

### addEventRule()

> **addEventRule**(`eventName`, `eventRule`): `void`

Defined in: [qwqsocket.d.ts:583](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L583)

添加事件规则

#### Parameters

##### eventName

`string`

##### eventRule

[`EventRule`](EventRule.md)

#### Returns

`void`

***

### addEventRules()

> **addEventRules**(`eventRules`): `void`

Defined in: [qwqsocket.d.ts:588](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L588)

添加多个事件规则

#### Parameters

##### eventRules

#### Returns

`void`

***

### addQueryRule()

> **addQueryRule**(`queryName`, `requestRule`, `responseRule`): `void`

Defined in: [qwqsocket.d.ts:610](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L610)

添加查询规则

#### Parameters

##### queryName

`string`

##### requestRule

[`EventRule`](EventRule.md)

##### responseRule

[`EventRule`](EventRule.md)

#### Returns

`void`

***

### addQueryRules()

> **addQueryRules**(`queryRules`): `void`

Defined in: [qwqsocket.d.ts:615](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L615)

添加多个查询规则

#### Parameters

##### queryRules

#### Returns

`void`

***

### applyToInstance()

> **applyToInstance**(`target`): `void`

Defined in: [qwqsocket.d.ts:638](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L638)

应用到实例

#### Parameters

##### target

[`QwQSocketServerClient`](QwQSocketServerClient.md) | [`QwQSocketClient`](QwQSocketClient.md) | [`QwQSocketServer`](QwQSocketServer.md)

#### Returns

`void`

***

### bindOpposite()

> **bindOpposite**(`target`): `void`

Defined in: [qwqsocket.d.ts:651](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L651)

绑定对端
服务端规则和客户端规则之间的绑定

#### Parameters

##### target

`RuleBinder`

#### Returns

`void`

***

### createOperator()

> **createOperator**\<`K`\>(`target`): [`BinderOperator`](BinderOperator.md)\<`K`\>

Defined in: [qwqsocket.d.ts:645](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L645)

创建操作器

#### Type Parameters

##### K

`K` *extends* [`QwQSocketServerClient`](QwQSocketServerClient.md) \| [`QwQSocketClient`](QwQSocketClient.md)

#### Parameters

##### target

`K`

#### Returns

[`BinderOperator`](BinderOperator.md)\<`K`\>

***

### setEventListener()

> **setEventListener**(`eventName`, `listener`): `void`

Defined in: [qwqsocket.d.ts:596](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L596)

设置事件监听器

#### Parameters

##### eventName

`string`

##### listener

(`eventMetaObj`, `target`) => `void`

#### Returns

`void`

***

### setEventListeners()

> **setEventListeners**(`eventListeners`): `void`

Defined in: [qwqsocket.d.ts:601](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L601)

设置多个事件监听器

#### Parameters

##### eventListeners

#### Returns

`void`

***

### setQueryProcessor()

> **setQueryProcessor**(`queryName`, `processor`): `void`

Defined in: [qwqsocket.d.ts:626](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L626)

设置查询处理函数

#### Parameters

##### queryName

`string`

##### processor

(`eventMetaObj`, `target`) => `any`

#### Returns

`void`

***

### setQueryProcessors()

> **setQueryProcessors**(`queryProcessors`): `void`

Defined in: [qwqsocket.d.ts:631](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L631)

设置多个查询处理函数

#### Parameters

##### queryProcessors

#### Returns

`void`

***

### \_\_#8@#isValidEventName()

> `static` **\_\_#8@#isValidEventName**(`name`): `boolean`

Defined in: [qwqsocket.d.ts:567](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L567)

检测合法的用户事件名
允许 数字 大写或小写字母 下划线(_)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### createClientBound()

> `static` **createClientBound**(): `RuleBinder`

Defined in: [qwqsocket.d.ts:577](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L577)

创建客户端事件规则集

#### Returns

`RuleBinder`

***

### createServerBound()

> `static` **createServerBound**(): `RuleBinder`

Defined in: [qwqsocket.d.ts:572](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L572)

创建服务端事件规则集

#### Returns

`RuleBinder`
