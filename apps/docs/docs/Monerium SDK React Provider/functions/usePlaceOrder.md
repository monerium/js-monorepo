[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / usePlaceOrder

# Function: usePlaceOrder()

> **usePlaceOrder**(`param`): [`MutationResult`](../type-aliases/MutationResult.md)\<`"placeOrder"`, [`Order`](../interfaces/Order.md), `Error`, `NewOrder`\>

# Place an order.
When the order has been placed, the orders query will be invalidated and re-fetched.

If the order amount is above 15000, a supporting document is required.

## Parameters

• **param** = `{}`

• **param.mutation?**: [`MutationOptions`](../type-aliases/MutationOptions.md)\<[`Order`](../interfaces/Order.md), `Error`, `NewOrder`\>

See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options.

• **param.supportingDocument?**: `File`

Supporting document file.

## Returns

[`MutationResult`](../type-aliases/MutationResult.md)\<`"placeOrder"`, [`Order`](../interfaces/Order.md), `Error`, `NewOrder`\>

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

[NewOrder type](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/type-aliases/NewOrder.md)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:510](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/hooks.tsx#L510)
