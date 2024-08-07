[**Monerium SDK v2.14.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK](../Monerium%20SDK.md) / NetworkStrict

# Type Alias: NetworkStrict\<C, E\>

> **NetworkStrict**\<`C`, `E`\>: `E` *extends* `"production"` ? `"mainnet"` : `E` *extends* `"sandbox"` ? `C` *extends* `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) : `C` *extends* `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) : `C` *extends* `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) : `never` : `never`

## Type Parameters

• **C** *extends* [`Chain`](Chain.md)

• **E** *extends* [`ENV`](ENV.md)

## Defined in

[types.ts:31](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk/src/types.ts#L31)
