# Type Alias: NetworkStrict\<C, E\>

> **NetworkStrict**\<`C`, `E`\>: `E` *extends* `"production"` ? `"mainnet"` : `E` *extends* `"sandbox"` ? `C` *extends* `"ethereum"` ? [`EthereumTestnet`](/docs/packages/SDK/type-aliases/EthereumTestnet.md) : `C` *extends* `"gnosis"` ? [`GnosisTestnet`](/docs/packages/SDK/type-aliases/GnosisTestnet.md) : `C` *extends* `"polygon"` ? [`PolygonTestnet`](/docs/packages/SDK/type-aliases/PolygonTestnet.md) : `never` : `never`

## Type Parameters

• **C** *extends* [`Chain`](/docs/packages/SDK/type-aliases/Chain.md)

• **E** *extends* [`ENV`](/docs/packages/SDK/type-aliases/ENV.md)

## Defined in

[types.ts:31](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L31)
