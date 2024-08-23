# Function: useOrder()

> **useOrder**(`params`: \{`orderId`: `string`;`query`: `{}`; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"order"`, `Order`\>

# Get single order

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.orderId` | `string` | The id of the order. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`Order`\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"order"`, `Order`\>

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

[API Documentation](https://monerium.dev/api-docs#operation/order)

[Order interface](/docs/packages/sdk/interfaces/Order.md)

## Defined in

[hooks.tsx:596](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L596)
