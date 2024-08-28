# Function: MoneriumProvider()

> **MoneriumProvider**(`params`: \{`children`: `ReactNode`;`clientId`: `string`;`environment`: `'sandbox'`;`redirectUri`: `string`;`redirectUrl`: `string`; \}): `Element`

Place this provider at the root of your application.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.children` | `ReactNode` | Rest of the application. |
| `params.clientId` | `string` | Monerium auth flow client id. |
| `params.environment`? | `"sandbox"` \| `"production"` | Monerium environment. |
| `params.redirectUri` | `string` | Monerium auth flow redirect url. |
| `params.redirectUrl`? | `string` | **Deprecated** use redirectUri |

## Returns

`Element`

## Defined in

[sdk-react-provider/src/lib/provider.tsx:19](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/provider.tsx#L19)
