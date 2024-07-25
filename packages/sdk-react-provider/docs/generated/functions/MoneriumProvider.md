[Monerium SDK React Provider](../README.md) / MoneriumProvider

# Function: MoneriumProvider()

> **MoneriumProvider**(`params`: \{`children`: `ReactNode`;`clientId`: `'f99e629b-6dca-11ee-8aa6-5273f65ed05b'`;`environment`: `'sandbox'`;`redirectUrl`: `'http://localhost:5173'`; \}): `Element`

## Parameters

| Parameter             | Type                          | Description                      |
| --------------------- | ----------------------------- | -------------------------------- |
| `params`              | `object`                      |                                  |
| `params.children`     | `ReactNode`                   | Rest of the application.         |
| `params.clientId`?    | `string`                      | Monerium auth flow client id.    |
| `params.environment`? | `"sandbox"` \| `"production"` | Monerium environment.            |
| `params.redirectUrl`? | `string`                      | Monerium auth flow redirect url. |

## Returns

`Element`

## Defined in

[sdk-react-provider/src/lib/provider.tsx:20](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/provider.tsx#L20)
