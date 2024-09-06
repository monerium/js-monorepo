# Function: usePlaceOrder()

> **usePlaceOrder**(`param`: \{`mutation`: [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<[`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md), `Error`, [`NewOrder`](/docs/packages/sdk-react-provider/type-aliases/NewOrder.md)\>;`supportingDocument`: `File`; \}): [`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"placeOrder"`, [`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md), `Error`, [`NewOrder`](/docs/packages/sdk-react-provider/type-aliases/NewOrder.md)\>

When the order has been placed, the orders query will be invalidated and re-fetched.

If the order amount is above 15000, a supporting document is required.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `param` | `object` |  |
| `param.mutation`? | [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<[`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md), `Error`, [`NewOrder`](/docs/packages/sdk-react-provider/type-aliases/NewOrder.md)\> | See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options. |
| `param.supportingDocument`? | `File` | Supporting document file. |

## Returns

[`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"placeOrder"`, [`Order`](/docs/packages/sdk-react-provider/interfaces/Order.md), `Error`, [`NewOrder`](/docs/packages/sdk-react-provider/type-aliases/NewOrder.md)\>

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

[API Documentation](https://monerium.dev/api-docs#operation/post-orders|)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:953](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L953)
