# Function: useOrders()

> **useOrders**(`params`?): [`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"orders"`, `Order`[]\>

# Get orders

## Parameters

• **params?** = `{}`

No required parameters.

• **params.address?**: `string`

Filter based on the blockchain address associated with the order.

• **params.memo?**: `string`

Filter by the payment memo/reference..

• **params.profile?**: `string`

Filter based on the profile ID associated with the order.

• **params.query?**: [`QueryOptions`](/docs/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`Order`[]\> = `{}`

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

• **params.state?**: `OrderState`

Filter based on the state of the order.

• **params.txHash?**: `string`

Filter based on the blockchain transaction hash.

## Returns

[`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"orders"`, `Order`[]\>

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

[Order interface](/docs/SDK/interfaces/Order.md)

## Defined in

[hooks.tsx:449](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L449)
