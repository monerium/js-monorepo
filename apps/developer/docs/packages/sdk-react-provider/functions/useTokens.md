# Function: useTokens()

> **useTokens**(`params`?: \{`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`Token`[]\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"tokens"`, `Token`[]\>

# Get tokens

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`Token`[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"tokens"`, `Token`[]\>

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

[Token interface](/docs/packages/sdk/interfaces/Token.md)

## Defined in

[hooks.tsx:262](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L262)
