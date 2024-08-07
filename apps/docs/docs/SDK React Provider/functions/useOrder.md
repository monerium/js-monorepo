# Function: useOrder()

> **useOrder**(`params`): [`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"order"`, `Order`\>

# Get single order

## Parameters

• **params**

• **params.orderId**: `string`

The id of the order.

• **params.query?**: [`QueryOptions`](/docs/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`Order`\> = `{}`

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"order"`, `Order`\>

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

[Order interface](/docs/SDK/interfaces/Order.md)

## Defined in

[hooks.tsx:389](https://github.com/monerium/js-monorepo/blob/bdb556f177407a98459f8edb039e31cf37d07d7a/packages/sdk-react-provider/src/lib/hooks.tsx#L389)
