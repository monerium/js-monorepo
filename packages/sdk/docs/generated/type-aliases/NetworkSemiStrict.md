[**Monerium SDK**](../README.md) • **Docs**

---

[Monerium SDK](../README.md) / NetworkSemiStrict

# Type Alias: NetworkSemiStrict\<C\>

> **NetworkSemiStrict**\<`C`\>: `C` _extends_ `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) \| `"mainnet"` : `C` _extends_ `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) \| `"mainnet"` : `C` _extends_ `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) \| `"mainnet"` : `never`

## Type Parameters

• **C** _extends_ [`Chain`](Chain.md)

## Defined in

[types.ts:23](https://github.com/monerium/js-monorepo/blob/b10be252d44a0e68c58bc7ef6fab8947911e4a7a/packages/sdk/src/types.ts#L23)
