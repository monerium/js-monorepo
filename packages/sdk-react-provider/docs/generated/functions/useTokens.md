[Monerium SDK React Provider](../README.md) / useTokens

# Function: useTokens()

> **useTokens**(`params`?: \{`query`: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Token`](../interfaces/Token.md)[]\>; \}): [`QueryResult`](../type-aliases/QueryResult.md)\<`"tokens"`, [`Token`](../interfaces/Token.md)[]\>

# Get tokens

## Parameters

| Parameter       | Type                                                                                     | Description                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `params`?       | `object`                                                                                 | No required parameters.                                                                                             |
| `params.query`? | [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Token`](../interfaces/Token.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

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

[sdk-react-provider/src/lib/hooks.tsx:259](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/hooks.tsx#L259)
