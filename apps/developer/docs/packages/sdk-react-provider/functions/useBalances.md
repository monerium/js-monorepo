# Function: useBalances()

> **useBalances**(`params`?: \{`profile`: `string`;`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`Balances`[]\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"balances"`, `Balances`[]\>

# Get balances

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.profile`? | `string` | Fetch balances for a specific profile. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`Balances`[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"balances"`, `Balances`[]\>

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

[Balances interface](/docs/packages/sdk/interfaces/Balances.md)

## Defined in

[hooks.tsx:425](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L425)
