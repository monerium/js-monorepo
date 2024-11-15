# Function: useIBAN()

> **useIBAN**(`params`: \{`iban`: `string`;`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md)\>; \}): `UseQueryResult`\<[`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md), `Error`\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.iban` | `string` | Fetch a specific IBAN |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

`UseQueryResult`\<[`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md), `Error`\>

## Example

```ts
const {
   data,
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useIBAN();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/iban)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:452](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L452)
