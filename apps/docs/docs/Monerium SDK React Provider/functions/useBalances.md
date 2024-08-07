[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / useBalances

# Function: useBalances()

> **useBalances**(`params`?): [`QueryResult`](../type-aliases/QueryResult.md)\<`"balances"`, [`Balances`](../interfaces/Balances.md)[]\>

# Get balances

## Parameters

• **params?** = `{}`

No required parameters.

• **params.profileId?**: `string`

Fetch balances for a specific profile.

• **params.query?**: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Balances`](../interfaces/Balances.md)[]\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

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

[sdk-react-provider/src/lib/hooks.tsx:337](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/hooks.tsx#L337)
