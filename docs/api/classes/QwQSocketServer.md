[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QwQSocketServer

# Class: QwQSocketServer

Defined in: [qwqsocket.d.ts:425](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L425)

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

Defined in: [qwqsocket.d.ts:437](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L437)

客户端的映射规则
表示客户端触发的事件相关规则

***

### serverMappingRules

> **serverMappingRules**: `MappingRules`

Defined in: [qwqsocket.d.ts:431](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L431)

服务器的映射规则
表示服务端触发的事件相关规则

## Methods

### createClient()

> **createClient**(): [`QwQSocketServerClient`](QwQSocketServerClient.md)

Defined in: [qwqsocket.d.ts:442](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L442)

创建连接到此服务端的客户端

#### Returns

[`QwQSocketServerClient`](QwQSocketServerClient.md)
