[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QwQSocketServerClient

# Class: QwQSocketServerClient

Defined in: [qwqsocket.d.ts:391](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L391)

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

Defined in: [qwqsocket.d.ts:410](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L410)

客户端的自定义数据

#### Index Signature

\[`x`: `string` \| `number` \| `symbol`\]: `any`

***

### eventListener

> **eventListener**: `object`

Defined in: [qwqsocket.d.ts:417](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L417)

事件监听器

#### Index Signature

\[`x`: `string`\]: (`eventMetaObj`, `client`) => `void`

***

### sendData

> **sendData**: `EventHandler`\<\{ `body`: `any`; `prefix`: `string`; \}\>

Defined in: [qwqsocket.d.ts:402](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L402)

实例想要发送一个包

## Methods

### receiveData()

> **receiveData**(`prefix`, `body`): `void`

Defined in: [qwqsocket.d.ts:425](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L425)

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

Defined in: [qwqsocket.d.ts:431](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L431)

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

Defined in: [qwqsocket.d.ts:397](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L397)

创建客户端实例

#### Parameters

##### server

[`QwQSocketServer`](QwQSocketServer.md)

#### Returns

`QwQSocketServerClient`
