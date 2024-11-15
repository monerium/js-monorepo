# Function: useAddresses()

> **useAddresses**(`params`?: \{`chain`: `ChainId` \| `Chain`;`profile`: `string`;`query`: `{}`; \}): `UseQueryResult`\<`AddressesResponse`, `Error`\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.chain`? | `ChainId` \| `Chain` | Filter based on chain - CURRENTLY RETURNS AN ERROR. |
| `params.profile`? | `string` | Filter based on profile id. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`AddressesResponse`\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

`UseQueryResult`\<`AddressesResponse`, `Error`\>

## Example

```ts
const {
   data,
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useAddresses();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:349](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L349)
