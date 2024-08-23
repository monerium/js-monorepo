# Function: useTokens()

> **useTokens**(`params`?): [`QueryResult`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"tokens"`, `Token`[]\>

# Get tokens

## Parameters

• **params?** = `{}`

No required parameters.

• **params.query?**: [`QueryOptions`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`Token`[]\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"tokens"`, `Token`[]\>

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

[Token interface](/docs/packages/SDK/interfaces/Token.md)

## Defined in

[hooks.tsx:289](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L289)