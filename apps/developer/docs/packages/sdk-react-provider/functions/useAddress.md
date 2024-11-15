# Function: useAddress()

> **useAddress**(`params`: \{`address`: `string`;`query`: `{}`; \}): `UseQueryResult`\<[`Address`](/docs/packages/sdk-react-provider/interfaces/Address.md), `Error`\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.address` | `string` | Fetch a specific address. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Address`](/docs/packages/sdk-react-provider/interfaces/Address.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

`UseQueryResult`\<[`Address`](/docs/packages/sdk-react-provider/interfaces/Address.md), `Error`\>

## Example

```ts
const {
   data,
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useAddress();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/address)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:296](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L296)
