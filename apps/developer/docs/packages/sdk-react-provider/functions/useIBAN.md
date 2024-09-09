# Function: useIBAN()

> **useIBAN**(`params`: \{`iban`: `string`;`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md)\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"iban"`, [`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md)\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.iban` | `string` | Fetch a specific IBAN |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"iban"`, [`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md)\>

## Example

```ts
const {
   iban, // useQuery's `data` property
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

[sdk-react-provider/src/lib/hooks.tsx:459](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L459)
