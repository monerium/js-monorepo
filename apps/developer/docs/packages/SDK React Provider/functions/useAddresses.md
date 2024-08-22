[Monerium SDK React Provider](../README.md) / useAddresses

# Function: useAddresses()

> **useAddresses**(`params`?: \{`chain`: `number` \| `Chain`;`profile`: `string`;`query`: `{}`; \}): [`QueryResult`](../type-aliases/QueryResult.md)\<`"addresses"`, `Address`[]\>

# Get addresses

## Parameters

| Parameter         | Type                                                             | Description                                                                                                         |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `params`?         | `object`                                                         | No required parameters.                                                                                             |
| `params.chain`?   | `number` \| `Chain`                                              | Fetch addresses for a specific chain.                                                                               |
| `params.profile`? | `string`                                                         | Fetch addresses for a specific profile.                                                                             |
| `params.query`?   | [`QueryOptions`](../type-aliases/QueryOptions.md)\<`Address`[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](../type-aliases/QueryResult.md)\<`"addresses"`, `Address`[]\>

## Example

```ts
const {
  addresses, // useQuery's `data` property
  isLoading,
  isError,
  error,
  refetch,
  ...moreUseQueryResults
} = useAddresses();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses)

[Address interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Address.md)

## Defined in

[hooks.tsx:368](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L368)
