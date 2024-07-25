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
```

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:82](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/hooks.tsx#L82)
