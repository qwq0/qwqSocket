[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QwQSocketServerClient

# Class: QwQSocketServerClient

Defined in: [qwqsocket.d.ts:391](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L391)

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

Defined in: [qwqsocket.d.ts:409](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L409)

客户端的自定义数据

***

### eventListener

> **eventListener**: `object`

Defined in: [qwqsocket.d.ts:414](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L414)

事件监听器

#### Index Signature

\[`x`: `string`\]: (`eventMetaObj`, `client`) => `void`

***

### sendData

> **sendData**: `EventHandler`\<\{ `body`: `any`; `prefix`: `string`; \}\>

Defined in: [qwqsocket.d.ts:401](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L401)

实例想要发送一个包

## Methods

### receiveData()

> **receiveData**(`prefix`, `body`): `void`

Defined in: [qwqsocket.d.ts:422](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L422)

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

Defined in: [qwqsocket.d.ts:428](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L428)

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

Defined in: [qwqsocket.d.ts:396](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L396)

创建客户端实例

#### Parameters

##### server

[`QwQSocketServer`](QwQSocketServer.md)

#### Returns

`QwQSocketServerClient`
