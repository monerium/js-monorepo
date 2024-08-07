[Monerium SDK React Provider](../README.md) / UseAuthReturn

# Type Alias: UseAuthReturn

> **UseAuthReturn**: \{`authorize`: (`params`?: [`AuthorizeParams`](AuthorizeParams.md)) => `Promise`\<`void`\>;`disconnect`: () => `Promise`\<`void`\>;`error`: `unknown`;`isAuthorized`: `boolean`;`isLoading`: `boolean`;`revokeAccess`: () => `Promise`\<`void`\>; \}

## Type declaration

| Name           | Type                                                                        | Description                                                 | Defined in                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `authorize`    | (`params`?: [`AuthorizeParams`](AuthorizeParams.md)) => `Promise`\<`void`\> | Constructs the url and redirects to the Monerium auth flow. | [sdk-react-provider/src/lib/types.ts:25](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L25) |
| `disconnect`   | () => `Promise`\<`void`\>                                                   | -                                                           | [sdk-react-provider/src/lib/types.ts:37](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L37) |
| `error`        | `unknown`                                                                   | -                                                           | [sdk-react-provider/src/lib/types.ts:35](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L35) |
| `isAuthorized` | `boolean`                                                                   | Indicates whether the SDK is authorized.                    | [sdk-react-provider/src/lib/types.ts:29](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L29) |
| `isLoading`    | `boolean`                                                                   | Indicates whether the SDK authorization is loading.         | [sdk-react-provider/src/lib/types.ts:33](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L33) |
| `revokeAccess` | () => `Promise`\<`void`\>                                                   | -                                                           | [sdk-react-provider/src/lib/types.ts:38](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L38) |

## Defined in

[sdk-react-provider/src/lib/types.ts:21](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L21)
