[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QwQSocketServerClient

# Class: QwQSocketServerClient

Defined in: [qwqsocket.d.ts:380](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L380)

连接到 qwq-socket 服务器的客户端实例
绑定到一个服务器上下文

## Constructors

### Constructor

> **new QwQSocketServerClient**(): `QwQSocketServerClient`

#### Returns

`QwQSocketServerClient`

## Properties

### data

> **data**: `object`

Defined in: [qwqsocket.d.ts:398](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L398)

客户端的自定义数据

***

### eventListener

> **eventListener**: `object`

Defined in: [qwqsocket.d.ts:403](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L403)

事件监听器

#### Index Signature

\[`x`: `string`\]: (`eventMetaObj`, `client`) => `void`

***

### sendData

> **sendData**: `EventHandler`\<\{ `body`: `any`; `prefix`: `string`; \}\>

Defined in: [qwqsocket.d.ts:390](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L390)

实例想要发送一个包

## Methods

### receiveData()

> **receiveData**(`prefix`, `body`): `void`

Defined in: [qwqsocket.d.ts:411](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L411)

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

> **sendTrigger**(`eventName`, `eventMetaObj`): `void`

Defined in: [qwqsocket.d.ts:417](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L417)

触发对端事件

#### Parameters

##### eventName

`string`

##### eventMetaObj

`object`

#### Returns

`void`

***

### create()

> `static` **create**(`server`): `QwQSocketServerClient`

Defined in: [qwqsocket.d.ts:385](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L385)

创建客户端实例

#### Parameters

##### server

[`QwQSocketServer`](QwQSocketServer.md)

#### Returns

`QwQSocketServerClient`
