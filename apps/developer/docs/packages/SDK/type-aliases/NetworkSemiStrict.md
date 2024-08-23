# Type Alias: NetworkSemiStrict\<C\>

> **NetworkSemiStrict**\<`C`\>: `C` *extends* `"ethereum"` ? [`EthereumTestnet`](/docs/packages/SDK/type-aliases/EthereumTestnet.md) \| `"mainnet"` : `C` *extends* `"gnosis"` ? [`GnosisTestnet`](/docs/packages/SDK/type-aliases/GnosisTestnet.md) \| `"mainnet"` : `C` *extends* `"polygon"` ? [`PolygonTestnet`](/docs/packages/SDK/type-aliases/PolygonTestnet.md) \| `"mainnet"` : `never`

## Type Parameters

• **C** *extends* [`Chain`](/docs/packages/SDK/type-aliases/Chain.md)

## Defined in

[types.ts:23](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L23)
