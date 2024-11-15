# Function: useTokens()

> **useTokens**(`params`?: \{`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Token`](/docs/packages/sdk-react-provider/interfaces/Token.md)[]\>; \}): `UseQueryResult`\<[`Token`](/docs/packages/sdk-react-provider/interfaces/Token.md)[], `Error`\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Token`](/docs/packages/sdk-react-provider/interfaces/Token.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

`UseQueryResult`\<[`Token`](/docs/packages/sdk-react-provider/interfaces/Token.md)[], `Error`\>

## Example

```ts
const {
   data,
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

[sdk-react-provider/src/lib/hooks.tsx:254](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L254)
