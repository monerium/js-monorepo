# Type Alias: NetworkStrict\<C, E\>

> **NetworkStrict**\<`C`, `E`\>: `E` *extends* `"production"` ? `"mainnet"` : `E` *extends* `"sandbox"` ? `C` *extends* `"ethereum"` ? [`EthereumTestnet`](/docs/SDK/type-aliases/EthereumTestnet.md) : `C` *extends* `"gnosis"` ? [`GnosisTestnet`](/docs/SDK/type-aliases/GnosisTestnet.md) : `C` *extends* `"polygon"` ? [`PolygonTestnet`](/docs/SDK/type-aliases/PolygonTestnet.md) : `never` : `never`

## Type Parameters

• **C** *extends* [`Chain`](/docs/SDK/type-aliases/Chain.md)

• **E** *extends* [`ENV`](/docs/SDK/type-aliases/ENV.md)

## Defined in

[types.ts:31](https://github.com/monerium/js-monorepo/blob/bdb556f177407a98459f8edb039e31cf37d07d7a/packages/sdk/src/types.ts#L31)
