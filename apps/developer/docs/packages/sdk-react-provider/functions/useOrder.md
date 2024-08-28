# Function: useOrder()

> **useOrder**(`params`: \{`orderId`: `string`;`query`: `{}`; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"order"`, [`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md)\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.orderId` | `string` | The id of the order. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"order"`, [`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md)\>

## Example

```ts
const {
   order, // useQuery's `data` property
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

[sdk-react-provider/src/lib/hooks.tsx:558](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L558)
