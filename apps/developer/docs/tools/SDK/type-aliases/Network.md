# Type Alias: Network\<C, E\>

> **Network**\<`C`, `E`\>: `C` *extends* [`Chain`](/docs/tools/SDK/type-aliases/Chain.md) ? `E` *extends* [`ENV`](/docs/tools/SDK/type-aliases/ENV.md) ? [`NetworkStrict`](/docs/tools/SDK/type-aliases/NetworkStrict.md)\<`C`, `E`\> & [`NetworkSemiStrict`](/docs/tools/SDK/type-aliases/NetworkSemiStrict.md)\<`C`\> : `never` : `never`

## Type Parameters

• **C** *extends* [`Chain`](/docs/tools/SDK/type-aliases/Chain.md) = [`Chain`](/docs/tools/SDK/type-aliases/Chain.md)

• **E** *extends* [`ENV`](/docs/tools/SDK/type-aliases/ENV.md) = [`ENV`](/docs/tools/SDK/type-aliases/ENV.md)

## Defined in

[types.ts:57](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L57)
