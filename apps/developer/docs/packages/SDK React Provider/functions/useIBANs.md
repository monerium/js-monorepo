# Function: useIBANs()

> **useIBANs**(`params`?): [`QueryResult`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"ibans"`, `IBAN`[]\>

# Get IBANs

## Parameters

• **params?** = `{}`

No required parameters.

• **params.chain?**: `number` \| `Chain`

Fetch IBANs for a specific chain.

• **params.profile?**: `string`

Fetch IBANs for a specific profile.

• **params.query?**: [`QueryOptions`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`IBAN`[]\> = `{}`

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"ibans"`, `IBAN`[]\>

## Example

```ts
const {
   ibans, // useQuery's `data` property
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useIBANs();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans)

[IBAN interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/IBAN.md)

## Defined in

[hooks.tsx:538](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L538)
