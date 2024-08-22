[Monerium SDK React Provider](../README.md) / useRequestIban

# Function: useRequestIban()

> **useRequestIban**(`params`?: \{`mutation`: `{}`; \}): [`MutationResult`](../type-aliases/MutationResult.md)\<`"requestIban"`, `ResponseStatus`, `Error`, `RequestIbanPayload`\>

# Request Iban

Create an IBAN for a specified address and chain.
All incoming EUR payments will automatically be routed to the linked address on that chain.
Any linked address can use this IBAN for outgoing payments.

## Parameters

| Parameter          | Type                                                                                                       | Description             |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------- |
| `params`?          | `object`                                                                                                   | No required parameters. |
| `params.mutation`? | [`MutationOptions`](../type-aliases/MutationOptions.md)\<`ResponseStatus`, `Error`, `RequestIbanPayload`\> | -                       |

## Returns

[`MutationResult`](../type-aliases/MutationResult.md)\<`"requestIban"`, `ResponseStatus`, `Error`, `RequestIbanPayload`\>

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

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban)

[RequestIbanPayload type](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/RequestIbanPayload.md)

## Defined in

[hooks.tsx:798](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L798)
