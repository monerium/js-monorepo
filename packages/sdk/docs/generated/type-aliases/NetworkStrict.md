[**Monerium SDK**](../README.md) • **Docs**

---

[Monerium SDK](../README.md) / NetworkStrict

# Type Alias: NetworkStrict\<C, E\>

> **NetworkStrict**\<`C`, `E`\>: `E` _extends_ `"production"` ? `"mainnet"` : `E` _extends_ `"sandbox"` ? `C` _extends_ `"ethereum"` ? [`EthereumTestnet`](EthereumTestnet.md) : `C` _extends_ `"gnosis"` ? [`GnosisTestnet`](GnosisTestnet.md) : `C` _extends_ `"polygon"` ? [`PolygonTestnet`](PolygonTestnet.md) : `never` : `never`

## Type Parameters

• **C** _extends_ [`Chain`](Chain.md)

• **E** _extends_ [`ENV`](ENV.md)

## Defined in

[types.ts:31](https://github.com/monerium/js-monorepo/blob/6fd0ad80ad4e8d991580cbeedf4372ce7e758e51/packages/sdk/src/types.ts#L31)
