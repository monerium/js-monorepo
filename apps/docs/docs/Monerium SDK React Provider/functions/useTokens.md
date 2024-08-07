[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / useTokens

# Function: useTokens()

> **useTokens**(`params`?): [`QueryResult`](../type-aliases/QueryResult.md)\<`"tokens"`, [`Token`](../interfaces/Token.md)[]\>

# Get tokens

## Parameters

• **params?** = `{}`

No required parameters.

• **params.query?**: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Token`](../interfaces/Token.md)[]\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](../type-aliases/QueryResult.md)\<`"tokens"`, [`Token`](../interfaces/Token.md)[]\>

## Example

```ts
const {
   tokens, // useQuery's `data` property
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useTokens();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/tokens)

[Token interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Token.md)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:289](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/hooks.tsx#L289)
