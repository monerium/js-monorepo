# Function: useOrders()

> **useOrders**(`params`?: \{`address`: `string`;`memo`: `string`;`profile`: `string`;`query`: `{}`;`state`: `OrderState`;`txHash`: `string`; \}): `UseQueryResult`\<`OrdersResponse`, `Error`\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.address`? | `string` | Filter based on the blockchain address associated with the order. |
| `params.memo`? | `string` | Filter by the payment memo/reference.. |
| `params.profile`? | `string` | Filter based on the profile ID associated with the order. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`OrdersResponse`\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |
| `params.state`? | `OrderState` | Filter based on the state of the order. |
| `params.txHash`? | `string` | Filter based on the blockchain transaction hash. |

## Returns

`UseQueryResult`\<`OrdersResponse`, `Error`\>

## Example

```ts
const {
   data,
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

[sdk-react-provider/src/lib/hooks.tsx:600](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L600)
