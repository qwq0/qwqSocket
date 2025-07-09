[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / RuleBinder

# Class: RuleBinder

Defined in: [qwqsocket.d.ts:571](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L571)

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

Defined in: [qwqsocket.d.ts:594](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L594)

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

Defined in: [qwqsocket.d.ts:599](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L599)

添加多个事件规则

#### Parameters

##### eventRules

#### Returns

`void`

***

### addQueryRule()

> **addQueryRule**(`queryName`, `requestRule`, `responseRule`): `void`

Defined in: [qwqsocket.d.ts:621](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L621)

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

Defined in: [qwqsocket.d.ts:626](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L626)

添加多个查询规则

#### Parameters

##### queryRules

#### Returns

`void`

***

### applyToInstance()

> **applyToInstance**(`target`): `void`

Defined in: [qwqsocket.d.ts:649](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L649)

应用到实例

#### Parameters

##### target

[`QwQSocketServerClient`](QwQSocketServerClient.md) | [`QwQSocketClient`](QwQSocketClient.md) | [`QwQSocketServer`](QwQSocketServer.md)

#### Returns

`void`

***

### bindOpposite()

> **bindOpposite**(`target`): `void`

Defined in: [qwqsocket.d.ts:662](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L662)

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

Defined in: [qwqsocket.d.ts:656](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L656)

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

Defined in: [qwqsocket.d.ts:678](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L678)

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

Defined in: [qwqsocket.d.ts:607](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L607)

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

Defined in: [qwqsocket.d.ts:612](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L612)

设置多个事件监听器

#### Parameters

##### eventListeners

#### Returns

`void`

***

### setQueryProcessor()

> **setQueryProcessor**(`queryName`, `processor`): `void`

Defined in: [qwqsocket.d.ts:637](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L637)

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

Defined in: [qwqsocket.d.ts:642](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L642)

设置多个查询处理函数

#### Parameters

##### queryProcessors

#### Returns

`void`

***

### \_\_#8@#isValidEventName()

> `static` **\_\_#8@#isValidEventName**(`name`): `boolean`

Defined in: [qwqsocket.d.ts:578](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L578)

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

Defined in: [qwqsocket.d.ts:588](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L588)

创建客户端事件规则集

#### Returns

`RuleBinder`

***

### createServerBound()

> `static` **createServerBound**(): `RuleBinder`

Defined in: [qwqsocket.d.ts:583](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L583)

创建服务端事件规则集

#### Returns

`RuleBinder`
