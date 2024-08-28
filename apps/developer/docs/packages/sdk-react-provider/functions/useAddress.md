# Function: useAddress()

> **useAddress**(`params`: \{`address`: `string`;`query`: `{}`; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"address"`, [`Address`](/docs/packages/sdk-react-provider/interfaces/Address.md)\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.address` | `string` | Fetch a specific address. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Address`](/docs/packages/sdk-react-provider/interfaces/Address.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"address"`, [`Address`](/docs/packages/sdk-react-provider/interfaces/Address.md)\>

## Example

```ts
const {
   address, // useQuery's `data` property
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
