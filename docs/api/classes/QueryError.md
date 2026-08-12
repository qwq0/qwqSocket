[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QueryError

# Class: QueryError

Defined in: [qwqsocket.d.ts:549](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L549)

查询时错误

## Extended by

- [`QueryTimeoutError`](QueryTimeoutError.md)

## Constructors

### Constructor

> **new QueryError**(`cause`): `QueryError`

Defined in: [qwqsocket.d.ts:555](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L555)

请求错误
在请求处理函数中抛出将返回错误

#### Parameters

##### cause

`string`

#### Returns

`QueryError`

## Properties

### cause

> **cause**: `string`

Defined in: [qwqsocket.d.ts:560](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L560)

错误原因

## Methods

### toString()

> **toString**(): `string`

Defined in: [qwqsocket.d.ts:561](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L561)

#### Returns

`string`
