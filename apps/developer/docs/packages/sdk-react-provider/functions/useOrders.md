# Function: useOrders()

> **useOrders**(`params`?: \{`address`: `string`;`memo`: `string`;`profile`: `string`;`query`: `{}`;`state`: `OrderState`;`txHash`: `string`; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"orders"`, [`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md)[]\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.address`? | `string` | Filter based on the blockchain address associated with the order. |
| `params.memo`? | `string` | Filter by the payment memo/reference.. |
| `params.profile`? | `string` | Filter based on the profile ID associated with the order. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |
| `params.state`? | `OrderState` | Filter based on the state of the order. |
| `params.txHash`? | `string` | Filter based on the blockchain transaction hash. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"orders"`, [`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md)[]\>

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

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:621](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L621)
