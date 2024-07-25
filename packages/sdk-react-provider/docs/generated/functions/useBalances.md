[Monerium SDK React Provider](../README.md) / useBalances

# Function: useBalances()

> **useBalances**(`params`?: \{`profileId`: `string`;`query`: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Balances`](../interfaces/Balances.md)[]\>; \}): [`QueryResult`](../type-aliases/QueryResult.md)\<`"balances"`, [`Balances`](../interfaces/Balances.md)[]\>

# Get balances

## Parameters

| Parameter           | Type                                                                                           | Description                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `params`?           | `object`                                                                                       | No required parameters.                                                                                             |
| `params.profileId`? | `string`                                                                                       | Fetch balances for a specific profile.                                                                              |
| `params.query`?     | [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Balances`](../interfaces/Balances.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](../type-aliases/QueryResult.md)\<`"balances"`, [`Balances`](../interfaces/Balances.md)[]\>

## Example

```ts
const {
  balances, // useQuery's `data` property
  isLoading,
  isError,
  error,
  refetch,
  ...moreUseQueryResults
} = useBalances();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/profile-balances)

[Balances interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Balances.md)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:334](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/hooks.tsx#L334)
