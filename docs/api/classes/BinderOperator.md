[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / BinderOperator

# Class: BinderOperator\<T\>

Defined in: [qwqsocket.d.ts:496](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L496)

绑定器操作器
用于操作socket发送事件或查询

## Type Parameters

### T

`T` *extends* [`QwQSocketServerClient`](QwQSocketServerClient.md) \| [`QwQSocketClient`](QwQSocketClient.md)

## Constructors

### Constructor

> **new BinderOperator**\<`T`\>(`target`): `BinderOperator`\<`T`\>

Defined in: [qwqsocket.d.ts:500](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L500)

#### Parameters

##### target

`T`

#### Returns

`BinderOperator`\<`T`\>

## Properties

### query

> **query**: `object`

Defined in: [qwqsocket.d.ts:514](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L514)

查询映射对象
调用函数触发对端事件

#### Index Signature

\[`x`: `string`\]: (`metaObj`, `timeout?`, `timeoutBehavior?`) => `Promise`\<`any`\>

***

### trigger

> **trigger**: `object`

Defined in: [qwqsocket.d.ts:506](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L506)

触发事件映射对象
调用函数触发对端事件

#### Index Signature

\[`x`: `string`\]: (`metaObj`) => `void`

## Methods

### addQuery()

> **addQuery**(`queryName`): `void`

Defined in: [qwqsocket.d.ts:526](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L526)

添加查询

#### Parameters

##### queryName

`string`

#### Returns

`void`

***

### addTrigger()

> **addTrigger**(`eventName`): `void`

Defined in: [qwqsocket.d.ts:521](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L521)

添加触发器

#### Parameters

##### eventName

`string`

#### Returns

`void`
