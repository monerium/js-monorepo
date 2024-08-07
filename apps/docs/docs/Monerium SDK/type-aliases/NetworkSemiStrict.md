[**Monerium SDK v2.14.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK](../Monerium%20SDK.md) / NetworkSemiStrict

# Type Alias: NetworkSemiStrict\<C\>

> **NetworkSemiStrict**\<`C`\>: `C` *extends* `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) \| `"mainnet"` : `C` *extends* `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) \| `"mainnet"` : `C` *extends* `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) \| `"mainnet"` : `never`

## Type Parameters

• **C** *extends* [`Chain`](Chain.md)

## Defined in

[types.ts:23](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk/src/types.ts#L23)
