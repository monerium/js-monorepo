[Monerium SDK React Provider](../README.md) / useOrder

# Function: useOrder()

> **useOrder**(`params`: \{`orderId`: `string`;`query`: `{}`; \}): [`QueryResult`](../type-aliases/QueryResult.md)\<`"order"`, [`Order`](../interfaces/Order.md)\>

# Get single order

## Parameters

| Parameter        | Type                                                                                   | Description                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `params`         | `object`                                                                               |                                                                                                                     |
| `params.orderId` | `string`                                                                               | The id of the order.                                                                                                |
| `params.query`?  | [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Order`](../interfaces/Order.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](../type-aliases/QueryResult.md)\<`"order"`, [`Order`](../interfaces/Order.md)\>

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

[Order interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Order.md)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:389](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L389)
