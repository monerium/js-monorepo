# Function: useBalances()

> **useBalances**(`params`?): [`QueryResult`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"balances"`, `Balances`[]\>

# Get balances

## Parameters

• **params?**

No required parameters.

• **params.profile?**: `string`

Fetch balances for a specific profile.

• **params.query?**: [`QueryOptions`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`Balances`[]\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"balances"`, `Balances`[]\>

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

[Balances interface](/docs/packages/SDK/interfaces/Balances.md)

## Defined in

[hooks.tsx:425](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L425)
