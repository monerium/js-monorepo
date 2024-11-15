# Function: useOrder()

> **useOrder**(`params`: \{`orderId`: `string`;`query`: `{}`; \}): `UseQueryResult`\<[`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md), `Error`\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.orderId` | `string` | The id of the order. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

`UseQueryResult`\<[`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md), `Error`\>

## Example

```ts
const {
   data,
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useOrder();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/order|)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:546](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L546)
