[**Monerium SDK v2.13.1**](../README.md) • **Docs**

---

[Monerium SDK v2.13.1](../README.md) / NetworkStrict

# Type alias: NetworkStrict\<C, E\>

> **NetworkStrict**\<`C`, `E`\>: `E` _extends_ `"production"` ? `"mainnet"` : `E` _extends_ `"sandbox"` ? `C` _extends_ `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) : `C` _extends_ `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) : `C` _extends_ `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) : `never` : `never`

## Type parameters

• **C** _extends_ [`Chain`](Chain.md)

• **E** _extends_ [`ENV`](ENV.md)

## Source

[types.ts:31](https://github.com/monerium/js-monorepo/blob/d7dd2f31ee14faec91d785d992389ffb611f1f1f/packages/sdk/src/types.ts#L31)
