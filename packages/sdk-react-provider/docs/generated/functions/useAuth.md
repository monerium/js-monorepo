[Monerium SDK React Provider](../README.md) / useAuth

# Function: useAuth()

> **useAuth**(): [`UseAuthReturn`](../type-aliases/UseAuthReturn.md)

# Redirect to the Monerium auth flow.

## Returns

[`UseAuthReturn`](../type-aliases/UseAuthReturn.md)

- `authorize` - Redirects to the Monerium auth flow.
- `isAuthorized` - Whether the user is authorized.
- `isLoading` - Whether the auth flow is loading.
- `error` - Error message if the auth flow fails.
- `disconnect` - Disconnect the user.
- `revokeAccess` - Revoke the user's access.

## Example

```ts
const { authorize, isAuthorized, isLoading, error } = useAuth();

authorize(); // Redirects to the Monerium auth flow.

// To opt-in to automated wallet linking, pass the address, signature and chain.
authorize({ address, signature, chain }).
```

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:85](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L85)
