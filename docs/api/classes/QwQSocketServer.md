[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QwQSocketServer

# Class: QwQSocketServer

Defined in: [qwqsocket.d.ts:436](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L436)

qwq-socket 服务器
表示一个可接受客户端连接的服务器上下文

## Constructors

### Constructor

> **new QwQSocketServer**(): `QwQSocketServer`

#### Returns

`QwQSocketServer`

## Properties

### clientMappingRules

> **clientMappingRules**: `MappingRules`

Defined in: [qwqsocket.d.ts:448](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L448)

客户端的映射规则
表示客户端触发的事件相关规则

***

### serverMappingRules

> **serverMappingRules**: `MappingRules`

Defined in: [qwqsocket.d.ts:442](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L442)

服务器的映射规则
表示服务端触发的事件相关规则

## Methods

### createClient()

> **createClient**(): [`QwQSocketServerClient`](QwQSocketServerClient.md)

Defined in: [qwqsocket.d.ts:453](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L453)

创建连接到此服务端的客户端

#### Returns

[`QwQSocketServerClient`](QwQSocketServerClient.md)
