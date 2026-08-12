[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / RuleBinder

# Class: RuleBinder

Defined in: [qwqsocket.d.ts:576](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L576)

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

Defined in: [qwqsocket.d.ts:599](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L599)

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

Defined in: [qwqsocket.d.ts:604](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L604)

添加多个事件规则

#### Parameters

##### eventRules

#### Returns

`void`

***

### addQueryRule()

> **addQueryRule**(`queryName`, `requestRule`, `responseRule`): `void`

Defined in: [qwqsocket.d.ts:626](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L626)

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

Defined in: [qwqsocket.d.ts:631](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L631)

添加多个查询规则

#### Parameters

##### queryRules

#### Returns

`void`

***

### applyToInstance()

> **applyToInstance**(`target`): `void`

Defined in: [qwqsocket.d.ts:657](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L657)

应用到实例
 - 对于 Server 设置事件规则
 - 对于 ServerClient 设置监听器函数
 - 对于 Client 同时设置事件规则与监听器

#### Parameters

##### target

[`QwQSocketServerClient`](QwQSocketServerClient.md) | [`QwQSocketClient`](QwQSocketClient.md) | [`QwQSocketServer`](QwQSocketServer.md)

#### Returns

`void`

***

### bindOpposite()

> **bindOpposite**(`target`): `void`

Defined in: [qwqsocket.d.ts:670](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L670)

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

Defined in: [qwqsocket.d.ts:664](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L664)

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

### genTypeDefine()

> **genTypeDefine**(): `object`

Defined in: [qwqsocket.d.ts:686](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L686)

创建类型定义文件
便于在调用时查询

#### Returns

`object`

##### event

> **event**: `object`[]

##### query

> **query**: `object`[]

***

### setEventListener()

> **setEventListener**(`eventName`, `listener`): `void`

Defined in: [qwqsocket.d.ts:612](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L612)

设置事件监听器

#### Parameters

##### eventName

`string`

##### listener

`QwQSocketEventListener`

#### Returns

`void`

***

### setEventListeners()

> **setEventListeners**(`eventListeners`): `void`

Defined in: [qwqsocket.d.ts:617](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L617)

设置多个事件监听器

#### Parameters

##### eventListeners

#### Returns

`void`

***

### setQueryProcessor()

> **setQueryProcessor**(`queryName`, `processor`): `void`

Defined in: [qwqsocket.d.ts:642](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L642)

设置查询处理函数

#### Parameters

##### queryName

`string`

##### processor

`QwQSocketQueryProcessor`

#### Returns

`void`

***

### setQueryProcessors()

> **setQueryProcessors**(`queryProcessors`): `void`

Defined in: [qwqsocket.d.ts:647](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L647)

设置多个查询处理函数

#### Parameters

##### queryProcessors

#### Returns

`void`

***

### \_\_#8@#isValidEventName()

> `static` **\_\_#8@#isValidEventName**(`name`): `boolean`

Defined in: [qwqsocket.d.ts:583](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L583)

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

Defined in: [qwqsocket.d.ts:593](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L593)

创建客户端事件规则集

#### Returns

`RuleBinder`

***

### createServerBound()

> `static` **createServerBound**(): `RuleBinder`

Defined in: [qwqsocket.d.ts:588](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L588)

创建服务端事件规则集

#### Returns

`RuleBinder`
