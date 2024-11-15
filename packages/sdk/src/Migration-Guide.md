Migration Guide.

# SDK

- `getBalances` now only returns the balance for a specified address+chain. Defaults to only 'eur' currency, optional parameter accepts a list of currency codes.

Preparing for pagination.

- `getOrders` now returns an `orders` object which contains a list of orders.

- `getAuthContext` removed, use `getProfiles` instead.

- Use `redirectUri` instead of `redirectUrl` for consistency with OAuth 2.0.

- `Network` interface has been completely removed. You will find occasional `network` in responses, but it's in the process of being removed.

- `Balance` interface renamed to `CurrencyBalance`.

- `IBAN`, `SCAN` and `CrossChain` interfaces renamed to `IBANIdentifier`, `SCANIdentifier` and `CrossChainIdentifier`.

- `linkAddress` has been simplified to:

  ```ts
   {
     profile: "profile-id-that-owns-address", // optional
     address: "0x1234...7890",
     signature: "0x12341234...78907890",
     chain: "ethereum"
   }
  ```

- `skipCreateAccount` added to `authorize` method to skip the account creation step in the auth flow.
- `skipKyc` added to `authorize` method to skip KYC in the auth flow.

- Simplified websockets

```ts
const monerium = new MoneriumClient({...});
// Subscribe to all order events
monerium.connectOrderNotifications();

// Subscribe to specific order events
monerium.connectOrderNotifications({ 
  filter: {
    state: OrderState.pending,
    profile: 'my-profile-id',
  },
  // optional callback functions
  onMessage: (order) => console.log(order)
  onError: (error) => console.error(error)
});

// Unsubscribe from specific order events
monerium.disconnectOrderNotifications({ 
  state: OrderState.pending,
  profile: 'my-profile-id'
});
```

- Interface `ClientCredentialsRequest` renamed to `ClientCredentialsPayload`
- Interface `AuthCodeRequest` renamed to `AuthCodePayload`
- Interface `RefreshTokenRequest` renamed to `RefreshTokenPayload`

# New

getAddresses
getAddress
getProfile
getProfiles
getIban
getIbans

CurrencyCode type

### TODO?

- should connectOrderNotifications be renamed to subscribeOrderNotifications?
- should disconnectOrderNotifications be renamed to unsubscribeOrderNotifications?
