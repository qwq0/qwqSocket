[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QwQSocketClient

# Class: QwQSocketClient

Defined in: [qwqsocket.d.ts:463](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L463)

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

Defined in: [qwqsocket.d.ts:476](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L476)

客户端的自定义数据

#### Index Signature

\[`x`: `string` \| `number` \| `symbol`\]: `any`

***

### eventListener

> **eventListener**: `object`

Defined in: [qwqsocket.d.ts:483](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L483)

事件监听器

#### Index Signature

\[`x`: `string`\]: (`eventMetaObj`, `client`) => `void`

***

### sendData

> **sendData**: `EventHandler`\<\{ `body`: `any`; `prefix`: `string`; \}\>

Defined in: [qwqsocket.d.ts:468](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L468)

实例想要发送一个包

## Methods

### addEventRule()

> **addEventRule**(`eventName`, `eventRule`): `void`

Defined in: [qwqsocket.d.ts:491](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L491)

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

Defined in: [qwqsocket.d.ts:497](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L497)

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

Defined in: [qwqsocket.d.ts:503](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L503)

触发对端事件

#### Parameters

##### eventName

`string`

##### eventMetaObj?

`object`

#### Returns

`void`
