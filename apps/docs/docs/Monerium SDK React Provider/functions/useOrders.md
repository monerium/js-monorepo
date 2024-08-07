[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / useOrders

# Function: useOrders()

> **useOrders**(`params`?): [`QueryResult`](../type-aliases/QueryResult.md)\<`"orders"`, [`Order`](../interfaces/Order.md)[]\>

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

• **params.query?**: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Order`](../interfaces/Order.md)[]\> = `{}`

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

• **params.state?**: [`OrderState`](../enumerations/OrderState.md)

Filter based on the state of the order.

• **params.txHash?**: `string`

Filter based on the blockchain transaction hash.

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

[sdk-react-provider/src/lib/hooks.tsx:449](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/hooks.tsx#L449)
