[**qwq-socket**](../README.md)

***

[qwq-socket](../README.md) / getTypeDefineByBinder

# Function: getTypeDefineByBinder()

> **getTypeDefineByBinder**(`serverBinder`, `clientBinder`, `options?`): `string`

Defined in: [qwqsocket.d.ts:725](https://github.com/qwq0/qwqSocket/blob/457d813c35c0c89201d779d2228a0ecc7c7b8182/dist/qwqsocket.d.ts#L725)

通过绑定器生成类型定义文件

## Parameters

### serverBinder

[`RuleBinder`](../classes/RuleBinder.md)

### clientBinder

[`RuleBinder`](../classes/RuleBinder.md)

### options?

#### extend?

\{ `importClientType`: `boolean`; `importModuleName`: `string`; `lisienerBind`: `boolean`; `lisienerBindType`: `"type"` \| `"interface"` \| `"namespace"`; \}

#### extend.importClientType?

`boolean`

#### extend.importModuleName?

`string`

#### extend.lisienerBind?

`boolean`

#### extend.lisienerBindType?

`"type"` \| `"interface"` \| `"namespace"`

#### preset?

\{ `lisienerBind`: `boolean` \| `"type"` \| `"interface"` \| `"namespace"`; \}

#### preset.lisienerBind?

`boolean` \| `"type"` \| `"interface"` \| `"namespace"`

## Returns

`string`
