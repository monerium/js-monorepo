[**Monerium SDK**](../README.md) • **Docs**

***

[Monerium SDK](../README.md) / NetworkSemiStrict

# Type Alias: NetworkSemiStrict\<C\>

> **NetworkSemiStrict**\<`C`\>: `C` *extends* `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) \| `"mainnet"` : `C` *extends* `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) \| `"mainnet"` : `C` *extends* `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) \| `"mainnet"` : `never`

## Type Parameters

• **C** *extends* [`Chain`](Chain.md)

## Defined in

[types.ts:23](https://github.com/monerium/js-monorepo/blob/62e0077f6672014c8c720b1b4b4f6d6fcc529502/packages/sdk/src/types.ts#L23)
