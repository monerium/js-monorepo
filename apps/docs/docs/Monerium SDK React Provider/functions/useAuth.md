[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / useAuth

# Function: useAuth()

> **useAuth**(): [`UseAuthReturn`](../type-aliases/UseAuthReturn.md)

# Redirect to the Monerium auth flow.

## Returns

[`UseAuthReturn`](../type-aliases/UseAuthReturn.md)

- `authorize`  - Redirects to the Monerium auth flow.
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

[sdk-react-provider/src/lib/hooks.tsx:85](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/hooks.tsx#L85)
