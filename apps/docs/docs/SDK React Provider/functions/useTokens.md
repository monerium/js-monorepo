# Function: useTokens()

> **useTokens**(`params`?): [`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"tokens"`, `Token`[]\>

# Get tokens

## Parameters

• **params?** = `{}`

No required parameters.

• **params.query?**: [`QueryOptions`](/docs/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`Token`[]\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"tokens"`, `Token`[]\>

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

[Token interface](/docs/SDK/interfaces/Token.md)

## Defined in

[hooks.tsx:289](https://github.com/monerium/js-monorepo/blob/bdb556f177407a98459f8edb039e31cf37d07d7a/packages/sdk-react-provider/src/lib/hooks.tsx#L289)
