Migration Guide.

- `getAuthContext` removed, use `getProfiles` instead.

- Use `redirectUri` instead of `redirectUrl` for consistency with OAuth 2.0.

- `Network` has been completely removed.

- `Balance` renamed to `CurrencyBalance`.

- `IBAN`, `SCAN` and `CrossChain` interfaces renamed to `IBANIdentifier`, `SCANIdentifier` and `CrossChainIdentifier`.

- `linkAddress` now only accepts one argument, the profile id has been added to the body.

  ```ts
   {
     profile: "profile-id-that-owns-address",
     address: "0x1234...7890",
     message: "I hereby declare that I am the address     owner",
     signature: "0x12341234...78907890",
     chain: "ethereum"
   }
  ```

- `getBalances` now has a required `profile` id argument.

- `skipCreateAccount` added to `authorize` method to skip the account creation step in the auth flow.

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

### TODO?

- should connectOrderNotifications be renamed to subscribeOrderNotifications?
- should disconnectOrderNotifications be renamed to unsubscribeOrderNotifications?
- should functions be consistent in accepting an object as params, even though we are just expecting one argument?

---

---

---

---

---

TODO: when there is only one arg, should it be an object??

like:

getAddress({ address }: AddressFilters)
OR
getAddress(address: AddressFilters)
