[Monerium SDK React Provider](../README.md) / UseAuthReturn

# Type Alias: UseAuthReturn

> **UseAuthReturn**: \{`authorize`: () => `Promise`\<`void`\>;`error`: `unknown`;`isAuthorized`: `boolean`;`isLoading`: `boolean`; \}

## Type declaration

| Name           | Type                      | Description                                                 | Defined in                                                                                                                                                                       |
| -------------- | ------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authorize`    | () => `Promise`\<`void`\> | Constructs the url and redirects to the Monerium auth flow. | [sdk-react-provider/src/lib/types.ts:19](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/types.ts#L19) |
| `error`        | `unknown`                 | -                                                           | [sdk-react-provider/src/lib/types.ts:29](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/types.ts#L29) |
| `isAuthorized` | `boolean`                 | Indicates whether the SDK is authorized.                    | [sdk-react-provider/src/lib/types.ts:23](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/types.ts#L23) |
| `isLoading`    | `boolean`                 | Indicates whether the SDK authorization is loading.         | [sdk-react-provider/src/lib/types.ts:27](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/types.ts#L27) |

## Defined in

[sdk-react-provider/src/lib/types.ts:15](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/types.ts#L15)
