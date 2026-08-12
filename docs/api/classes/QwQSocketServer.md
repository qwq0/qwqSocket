[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QwQSocketServer

# Class: QwQSocketServer

Defined in: [qwqsocket.d.ts:439](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L439)

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

Defined in: [qwqsocket.d.ts:451](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L451)

客户端的映射规则
表示客户端触发的事件相关规则

***

### serverMappingRules

> **serverMappingRules**: `MappingRules`

Defined in: [qwqsocket.d.ts:445](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L445)

服务器的映射规则
表示服务端触发的事件相关规则

## Methods

### createClient()

> **createClient**(): [`QwQSocketServerClient`](QwQSocketServerClient.md)

Defined in: [qwqsocket.d.ts:456](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L456)

创建连接到此服务端的客户端

#### Returns

[`QwQSocketServerClient`](QwQSocketServerClient.md)
