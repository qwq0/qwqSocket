[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / BinderOperator

# Class: BinderOperator\<T\>

Defined in: [qwqsocket.d.ts:507](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L507)

绑定器操作器
用于操作socket发送事件或查询

## Type Parameters

### T

`T` *extends* [`QwQSocketServerClient`](QwQSocketServerClient.md) \| [`QwQSocketClient`](QwQSocketClient.md)

## Constructors

### Constructor

> **new BinderOperator**\<`T`\>(`target`): `BinderOperator`\<`T`\>

Defined in: [qwqsocket.d.ts:511](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L511)

#### Parameters

##### target

`T`

#### Returns

`BinderOperator`\<`T`\>

## Properties

### query

> **query**: `object`

Defined in: [qwqsocket.d.ts:525](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L525)

查询映射对象
调用函数触发对端事件

#### Index Signature

\[`x`: `string`\]: (`metaObj`, `timeout?`, `timeoutBehavior?`) => `Promise`\<`any`\>

***

### trigger

> **trigger**: `object`

Defined in: [qwqsocket.d.ts:517](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L517)

触发事件映射对象
调用函数触发对端事件

#### Index Signature

\[`x`: `string`\]: (`metaObj`) => `void`

## Methods

### addQuery()

> **addQuery**(`queryName`): `void`

Defined in: [qwqsocket.d.ts:537](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L537)

添加查询

#### Parameters

##### queryName

`string`

#### Returns

`void`

***

### addTrigger()

> **addTrigger**(`eventName`): `void`

Defined in: [qwqsocket.d.ts:532](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L532)

添加触发器

#### Parameters

##### eventName

`string`

#### Returns

`void`
