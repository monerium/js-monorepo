[**Monerium SDK**](../README.md) • **Docs**

---

[Monerium SDK](../README.md) / NetworkStrict

# Type Alias: NetworkStrict\<C, E\>

> **NetworkStrict**\<`C`, `E`\>: `E` _extends_ `"production"` ? `"mainnet"` : `E` _extends_ `"sandbox"` ? `C` _extends_ `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) : `C` _extends_ `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) : `C` _extends_ `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) : `never` : `never`

## Type Parameters

• **C** _extends_ [`Chain`](Chain.md)

• **E** _extends_ [`ENV`](ENV.md)

## Defined in

[types.ts:31](https://github.com/monerium/js-monorepo/blob/b10be252d44a0e68c58bc7ef6fab8947911e4a7a/packages/sdk/src/types.ts#L31)
