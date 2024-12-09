# Migration Guide.

## SDK to v3.0.0

- Due to security concerns, the refresh token is no longer automatically kept in localStorage. You must manage it yourself. It can be accessed from `bearerProfile` through the `MoneriumClient` instance. You must then provide it to the `getAccess` method.

- `getAccess` no longer accepts `clientId` nor `redirectUri` as parameters. These are now set in the `MoneriumClient` constructor.

- `getBalances` now only returns the balance for a specified address+chain. Defaults to only 'eur' currency, optional parameter accepts a list of currency codes.

- `getOrders` now returns an `orders` object which contains a list of orders. Preparing for pagination.

- `getAuthContext` removed, use `getProfiles` instead.

- Use `redirectUri` instead of `redirectUrl` for consistency with OAuth 2.0.

- `Network` interface has been completely removed. You will find occasional `network` in responses, but it's in the process of being removed.

- `arbitrum` and `noble` support added.

- `placeOrderMessage` now has a shortened IBAN format.

- `linkAddress` now only creates an account for a single specified chain and has been simplified to:

  ```ts
   {
     profile: "profile-id-that-owns-address", // optional
     address: "0x1234...7890",
     signature: "0x12341234...78907890",
     chain: "ethereum"
   }
  ```

- `skipCreateAccount` added to `authorize` method to skip the account creation step in the auth flow.
- `skipKyc` added to `authorize` method to skip KYC in the auth flow.Ye

- Simplified websockets

Renamed `subscribeToOrderNotifications`to `subscribeOrderNotifications` and `unsubscribeFromOrderNotifications` to `unsubscribeOrderNotifications`.

```ts
const monerium = new MoneriumClient({...});
// Subscribe to all order events
monerium.subscribeOrderNotifications();

// Subscribe to specific order events
monerium.subscribeOrderNotifications({ 
  filter: {
    state: OrderState.pending,
    profile: 'my-profile-id',
  },
  // optional callback functions
  onMessage: (order) => console.log(order)
  onError: (error) => console.error(error)
});

// Unsubscribe from specific order events
monerium.unsubscribeOrderNotifications({ 
  state: OrderState.pending,
  profile: 'my-profile-id'
});
```

-
- Interface `ClientCredentialsRequest` renamed to `ClientCredentialsPayload`
- Interface `AuthCodeRequest` renamed to `AuthCodePayload`
- Interface `RefreshTokenRequest` renamed to `RefreshTokenPayload`
- Interface `Balance` renamed to `CurrencyBalance`.
- Interface `IBAN` renamed to `IBANIdentifier`.
- Interface `SCAN` renamed to `SCANIdentifier`.
- Interface `CrossChain` renamed to `CrossChainIdentifier`.

# New

- getAddresses
- getAddress
- getProfile
- getProfiles
- getIban
- getIbans
- moveIban
- requestIban
- CurrencyCode type

Beta:

- submitProfileDetails

## React Provider to v1.0.0

- Due to security concerns, the refresh token is no longer automatically kept in localStorage. You must manage it yourself. It can be accessed from accessed and provided through the `MoneriumProvider`.

```ts
<MoneriumProvider
    clientId="f99e629b-6dca-11ee-8aa6-5273f65ed03b"
    redirectUri={'http://example.com'}
    environment="sandbox"
    debug={true}
    refreshToken={refreshToken}
    onRefreshTokenUpdate={(token) => storeToken(token)}>
    {children}
</MoneriumProvider>
```

- All query hooks now return the data response as `data`:

```ts
const { data, isLoading, isError } = useProfile();
```

- `useAuthContext` removed, use `useProfile` instead.
- `useBalances` now only returns the balance for a specified address+chain. Defaults to only 'eur' currency, optional parameter accepts a list of currency codes.
- `useLinkAddress` mutation, `linkAddress` now only creates an account for a single specified chain and has been simplified to:

  ```ts
   {
     profile: "profile-id-that-owns-address", // optional
     address: "0x1234...7890",
     signature: "0x12341234...78907890",
     chain: "ethereum"
   }
  ```

New:

- useAddress
- useAddresses
- useIban
- useIbans
- useRequestIban
- useMoveIban
- useSubscribeOrderNotification

Beta:

- useSubmitProfileDetails
