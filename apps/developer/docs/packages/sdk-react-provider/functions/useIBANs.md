# Function: useIBANs()

> **useIBANs**(`params`?: \{`chain`: `ChainId` \| `Chain`;`profile`: `string`;`query`: `{}`; \}): `UseQueryResult`\<`IBANsResponse`, `Error`\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.chain`? | `ChainId` \| `Chain` | Fetch IBANs for a specific chain. |
| `params.profile`? | `string` | Fetch IBANs for a specific profile. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`IBANsResponse`\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

`UseQueryResult`\<`IBANsResponse`, `Error`\>

## Example

```ts
const {
   data,
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useIBANs();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:497](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L497)
