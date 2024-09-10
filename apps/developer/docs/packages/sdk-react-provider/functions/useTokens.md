# Function: useTokens()

> **useTokens**(`params`?: \{`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Token`](/docs/packages/sdk-react-provider/interfaces/Token.md)[]\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"tokens"`, [`Token`](/docs/packages/sdk-react-provider/interfaces/Token.md)[]\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Token`](/docs/packages/sdk-react-provider/interfaces/Token.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"tokens"`, [`Token`](/docs/packages/sdk-react-provider/interfaces/Token.md)[]\>

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

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:251](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L251)
