[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QwQSocketClient

# Class: QwQSocketClient

Defined in: [qwqsocket.d.ts:460](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L460)

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

Defined in: [qwqsocket.d.ts:473](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L473)

客户端的自定义数据

***

### eventListener

> **eventListener**: `object`

Defined in: [qwqsocket.d.ts:478](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L478)

事件监听器

#### Index Signature

\[`x`: `string`\]: (`eventMetaObj`, `client`) => `void`

***

### sendData

> **sendData**: `EventHandler`\<\{ `body`: `any`; `prefix`: `string`; \}\>

Defined in: [qwqsocket.d.ts:465](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L465)

实例想要发送一个包

## Methods

### addEventRule()

> **addEventRule**(`eventName`, `eventRule`): `void`

Defined in: [qwqsocket.d.ts:486](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L486)

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

Defined in: [qwqsocket.d.ts:492](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L492)

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

Defined in: [qwqsocket.d.ts:498](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L498)

触发对端事件

#### Parameters

##### eventName

`string`

##### eventMetaObj?

`object`

#### Returns

`void`
