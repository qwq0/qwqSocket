[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / QueryError

# Class: QueryError

Defined in: [qwqsocket.d.ts:544](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L544)

查询时错误

## Extended by

- [`QueryTimeoutError`](QueryTimeoutError.md)

## Constructors

### Constructor

> **new QueryError**(`cause`): `QueryError`

Defined in: [qwqsocket.d.ts:550](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L550)

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

Defined in: [qwqsocket.d.ts:555](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L555)

错误原因

## Methods

### toString()

> **toString**(): `string`

Defined in: [qwqsocket.d.ts:556](https://github.com/qwq0/qwqSocket/blob/0fa673c2c9bd391101242adbc78ce27a072a231b/dist/qwqsocket.d.ts#L556)

#### Returns

`string`
