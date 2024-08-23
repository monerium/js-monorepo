# Function: useAddress()

> **useAddress**(`params`: \{`address`: `string`;`query`: `{}`; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"address"`, `Address`\>

# Get address

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.address` | `string` | Fetch a specific address. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`Address`\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"address"`, `Address`\>

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

[Address interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Address.md)

## Defined in

[hooks.tsx:311](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L311)
