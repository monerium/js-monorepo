[**Monerium SDK**](../README.md) • **Docs**

***

[Monerium SDK](../README.md) / NetworkSemiStrict

# Type Alias: NetworkSemiStrict\<C\>

> **NetworkSemiStrict**\<`C`\>: `C` *extends* `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) \| `"mainnet"` : `C` *extends* `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) \| `"mainnet"` : `C` *extends* `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) \| `"mainnet"` : `never`

## Type Parameters

• **C** *extends* [`Chain`](Chain.md)

## Defined in

[types.ts:23](https://github.com/monerium/js-monorepo/blob/90e863940da8623462a29ce3ac59bdfdcf20271e/packages/sdk/src/types.ts#L23)
