[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / useOrder

# Function: useOrder()

> **useOrder**(`params`): [`QueryResult`](../type-aliases/QueryResult.md)\<`"order"`, [`Order`](../interfaces/Order.md)\>

# Get single order

## Parameters

• **params**

• **params.orderId**: `string`

The id of the order.

• **params.query?**: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Order`](../interfaces/Order.md)\> = `{}`

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

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

[sdk-react-provider/src/lib/hooks.tsx:389](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/hooks.tsx#L389)
