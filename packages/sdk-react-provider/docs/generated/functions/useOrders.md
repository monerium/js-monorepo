[Monerium SDK React Provider](../README.md) / useOrders

# Function: useOrders()

> **useOrders**(`params`?: \{`address`: `string`;`memo`: `string`;`profile`: `string`;`query`: `{}`;`state`: [`OrderState`](../enumerations/OrderState.md);`txHash`: `string`; \}): [`QueryResult`](../type-aliases/QueryResult.md)\<`"orders"`, [`Order`](../interfaces/Order.md)[]\>

# Get orders

## Parameters

| Parameter         | Type                                                                                     | Description                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `params`?         | `object`                                                                                 | No required parameters.                                                                                             |
| `params.address`? | `string`                                                                                 | Filter based on the blockchain address associated with the order.                                                   |
| `params.memo`?    | `string`                                                                                 | Filter by the payment memo/reference..                                                                              |
| `params.profile`? | `string`                                                                                 | Filter based on the profile ID associated with the order.                                                           |
| `params.query`?   | [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Order`](../interfaces/Order.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |
| `params.state`?   | [`OrderState`](../enumerations/OrderState.md)                                            | Filter based on the state of the order.                                                                             |
| `params.txHash`?  | `string`                                                                                 | Filter based on the blockchain transaction hash.                                                                    |

## Returns

[`QueryResult`](../type-aliases/QueryResult.md)\<`"orders"`, [`Order`](../interfaces/Order.md)[]\>

## Example

```ts
const {
  orders, // useQuery's `data` property
  isLoading,
  isError,
  error,
  refetch,
  ...moreUseQueryResults
} = useOrders();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/orders)

[Order interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Order.md)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:416](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/hooks.tsx#L416)
