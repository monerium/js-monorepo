# Function: usePlaceOrder()

> **usePlaceOrder**(`param`): [`MutationResult`](/docs/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"placeOrder"`, `Order`, `Error`, `NewOrder`\>

# Place an order.
When the order has been placed, the orders query will be invalidated and re-fetched.

If the order amount is above 15000, a supporting document is required.

## Parameters

• **param** = `{}`

• **param.mutation?**: [`MutationOptions`](/docs/SDK%20React%20Provider/type-aliases/MutationOptions.md)\<`Order`, `Error`, `NewOrder`\>

See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options.

• **param.supportingDocument?**: `File`

Supporting document file.

## Returns

[`MutationResult`](/docs/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"placeOrder"`, `Order`, `Error`, `NewOrder`\>

## Example

```ts
const {
   placeOrder, // useMutation's `mutateAsync` property
   isPending,
   isError,
   error,
   status,
   ...moreUseMutationResults
} = usePlaceOrder();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/post-orders)

[NewOrder type](/docs/SDK/type-aliases/NewOrder.md)

## Defined in

[hooks.tsx:510](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L510)
