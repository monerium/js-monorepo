# Function: useRequestIban()

> **useRequestIban**(`params`?: \{`mutation`: `{}`; \}): [`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"requestIban"`, [`ResponseStatus`](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md), `Error`, `RequestIbanPayload`\>

Create an IBAN for a specified address and chain.
All incoming EUR payments will automatically be routed to the linked address on that chain.
Any linked address can use this IBAN for outgoing payments.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.mutation`? | [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<[`ResponseStatus`](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md), `Error`, `RequestIbanPayload`\> | See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options. |

## Returns

[`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"requestIban"`, [`ResponseStatus`](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md), `Error`, `RequestIbanPayload`\>

## Example

```ts
const {
   requestIban, // useMutation's `mutateAsync` property
   isPending,
   isError,
   error,
   status,
   ...moreUseMutationResults
} = useRequestIban();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban)}

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:749](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L749)
