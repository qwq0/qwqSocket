[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QueryError

# Class: QueryError

Defined in: [qwqsocket.d.ts:533](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L533)

查询时错误

## Extended by

- [`QueryTimeoutError`](QueryTimeoutError.md)

## Constructors

### Constructor

> **new QueryError**(`cause`): `QueryError`

Defined in: [qwqsocket.d.ts:539](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L539)

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

Defined in: [qwqsocket.d.ts:544](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L544)

错误原因

## Methods

### toString()

> **toString**(): `string`

Defined in: [qwqsocket.d.ts:545](https://github.com/qwq0/qwqSocket/blob/f6f63c5bd599ebbf32df8b5d1b9d07fafe4c5d1f/dist/qwqsocket.d.ts#L545)

#### Returns

`string`
