# Type Alias: NetworkSemiStrict\<C\>

> **NetworkSemiStrict**\<`C`\>: `C` *extends* `"ethereum"` ? [`EthereumTestnet`](/docs/SDK/type-aliases/EthereumTestnet.md) \| `"mainnet"` : `C` *extends* `"gnosis"` ? [`GnosisTestnet`](/docs/SDK/type-aliases/GnosisTestnet.md) \| `"mainnet"` : `C` *extends* `"polygon"` ? [`PolygonTestnet`](/docs/SDK/type-aliases/PolygonTestnet.md) \| `"mainnet"` : `never`

## Type Parameters

• **C** *extends* [`Chain`](/docs/SDK/type-aliases/Chain.md)

## Defined in

[types.ts:23](https://github.com/monerium/js-monorepo/blob/bdb556f177407a98459f8edb039e31cf37d07d7a/packages/sdk/src/types.ts#L23)
