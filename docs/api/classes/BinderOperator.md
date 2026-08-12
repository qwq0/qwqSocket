[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / BinderOperator

# Class: BinderOperator\<T\>

Defined in: [qwqsocket.d.ts:512](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L512)

绑定器操作器
用于操作socket发送事件或查询

## Type Parameters

### T

`T` *extends* [`QwQSocketServerClient`](QwQSocketServerClient.md) \| [`QwQSocketClient`](QwQSocketClient.md)

## Constructors

### Constructor

> **new BinderOperator**\<`T`\>(`target`): `BinderOperator`\<`T`\>

Defined in: [qwqsocket.d.ts:516](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L516)

#### Parameters

##### target

`T`

#### Returns

`BinderOperator`\<`T`\>

## Properties

### query

> **query**: `object`

Defined in: [qwqsocket.d.ts:530](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L530)

查询映射对象
调用函数触发对端事件

#### Index Signature

\[`x`: `string`\]: (`metaObj`, `timeout?`, `timeoutBehavior?`) => `Promise`\<`any`\>

***

### trigger

> **trigger**: `object`

Defined in: [qwqsocket.d.ts:522](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L522)

触发事件映射对象
调用函数触发对端事件

#### Index Signature

\[`x`: `string`\]: (`metaObj`) => `void`

## Methods

### addQuery()

> **addQuery**(`queryName`): `void`

Defined in: [qwqsocket.d.ts:542](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L542)

添加查询

#### Parameters

##### queryName

`string`

#### Returns

`void`

***

### addTrigger()

> **addTrigger**(`eventName`): `void`

Defined in: [qwqsocket.d.ts:537](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L537)

添加触发器

#### Parameters

##### eventName

`string`

#### Returns

`void`
