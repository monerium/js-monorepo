[**Monerium SDK**](../README.md) • **Docs**

---

[Monerium SDK](../README.md) / NetworkSemiStrict

# Type Alias: NetworkSemiStrict\<C\>

> **NetworkSemiStrict**\<`C`\>: `C` _extends_ `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) \| `"mainnet"` : `C` _extends_ `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) \| `"mainnet"` : `C` _extends_ `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) \| `"mainnet"` : `never`

## Type Parameters

• **C** _extends_ [`Chain`](Chain.md)

## Defined in

[types.ts:23](https://github.com/monerium/js-monorepo/blob/6fd0ad80ad4e8d991580cbeedf4372ce7e758e51/packages/sdk/src/types.ts#L23)
