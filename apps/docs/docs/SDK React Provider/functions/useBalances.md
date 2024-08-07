# Function: useBalances()

> **useBalances**(`params`?): [`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"balances"`, `Balances`[]\>

# Get balances

## Parameters

• **params?** = `{}`

No required parameters.

• **params.profileId?**: `string`

Fetch balances for a specific profile.

• **params.query?**: [`QueryOptions`](/docs/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`Balances`[]\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"balances"`, `Balances`[]\>

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

[Balances interface](/docs/SDK/interfaces/Balances.md)

## Defined in

[hooks.tsx:337](https://github.com/monerium/js-monorepo/blob/bdb556f177407a98459f8edb039e31cf37d07d7a/packages/sdk-react-provider/src/lib/hooks.tsx#L337)
