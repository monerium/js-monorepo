[**Monerium SDK v2.12.1-beta0**](../README.md) • **Docs**

---

[Monerium SDK v2.12.1-beta0](../README.md) / NetworkSemiStrict

# Type alias: NetworkSemiStrict\<C\>

> **NetworkSemiStrict**\<`C`\>: `C` _extends_ `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) \| `"mainnet"` : `C` _extends_ `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) \| `"mainnet"` : `C` _extends_ `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) \| `"mainnet"` : `never`

## Type parameters

• **C** _extends_ [`Chain`](Chain.md)

## Source

[types.ts:23](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/types.ts#L23)
