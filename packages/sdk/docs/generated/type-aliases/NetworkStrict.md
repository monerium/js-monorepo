[**Monerium SDK**](../README.md) • **Docs**

***

[Monerium SDK](../README.md) / NetworkStrict

# Type Alias: NetworkStrict\<C, E\>

> **NetworkStrict**\<`C`, `E`\>: `E` *extends* `"production"` ? `"mainnet"` : `E` *extends* `"sandbox"` ? `C` *extends* `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) : `C` *extends* `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) : `C` *extends* `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) : `never` : `never`

## Type Parameters

• **C** *extends* [`Chain`](Chain.md)

• **E** *extends* [`ENV`](ENV.md)

## Defined in

[types.ts:31](https://github.com/monerium/js-monorepo/blob/294e3704bc2735fba770b1d2fbba8f31f3bfa306/packages/sdk/src/types.ts#L31)
