[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QwQSocketClient

# Class: QwQSocketClient

Defined in: [qwqsocket.d.ts:449](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L449)

qwq-socket 客户端
表示 服务器侧 或 用户侧 的客户端实例

## Constructors

### Constructor

> **new QwQSocketClient**(): `QwQSocketClient`

#### Returns

`QwQSocketClient`

## Properties

### data

> **data**: `object`

Defined in: [qwqsocket.d.ts:462](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L462)

客户端的自定义数据

***

### eventListener

> **eventListener**: `object`

Defined in: [qwqsocket.d.ts:467](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L467)

事件监听器

#### Index Signature

\[`x`: `string`\]: (`eventMetaObj`, `client`) => `void`

***

### sendData

> **sendData**: `EventHandler`\<\{ `body`: `any`; `prefix`: `string`; \}\>

Defined in: [qwqsocket.d.ts:454](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L454)

实例想要发送一个包

## Methods

### addEventRule()

> **addEventRule**(`eventName`, `eventRule`): `void`

Defined in: [qwqsocket.d.ts:475](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L475)

添加事件规则

#### Parameters

##### eventName

`string`

##### eventRule

[`EventRule`](EventRule.md)

#### Returns

`void`

***

### receiveData()

> **receiveData**(`prefix`, `body`): `void`

Defined in: [qwqsocket.d.ts:481](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L481)

收到客户端的数据

#### Parameters

##### prefix

`string`

##### body

`any`

#### Returns

`void`

***

### sendTrigger()

> **sendTrigger**(`eventName`, `eventMetaObj?`): `void`

Defined in: [qwqsocket.d.ts:487](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L487)

触发对端事件

#### Parameters

##### eventName

`string`

##### eventMetaObj?

`object`

#### Returns

`void`
