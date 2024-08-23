# Type Alias: UseAuthReturn

> **UseAuthReturn**: \{`authorize`: (`params`?: [`AuthorizeParams`](/docs/packages/sdk-react-provider/type-aliases/AuthorizeParams.md)) => `Promise`\<`void`\>;`disconnect`: () => `Promise`\<`void`\>;`error`: `unknown`;`isAuthorized`: `boolean`;`isLoading`: `boolean`;`revokeAccess`: () => `Promise`\<`void`\>; \}

## Type declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `authorize` | (`params`?: [`AuthorizeParams`](/docs/packages/sdk-react-provider/type-aliases/AuthorizeParams.md)) => `Promise`\<`void`\> | Constructs the url and redirects to the Monerium auth flow. | [types.ts:25](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L25) |
| `disconnect` | () => `Promise`\<`void`\> | - | [types.ts:37](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L37) |
| `error` | `unknown` | - | [types.ts:35](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L35) |
| `isAuthorized` | `boolean` | Indicates whether the SDK is authorized. | [types.ts:29](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L29) |
| `isLoading` | `boolean` | Indicates whether the SDK authorization is loading. | [types.ts:33](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L33) |
| `revokeAccess` | () => `Promise`\<`void`\> | - | [types.ts:38](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L38) |

## Defined in

[types.ts:21](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L21)
