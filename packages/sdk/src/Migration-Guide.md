Migration Guide.

- Use `redirectUri` instead of `redirectUrl` for consistency with OAuth 2.0.

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

- Interface `ClientCredentialsRequest` renamed to `ClientCredentialsPayload`
- Interface `AuthCodeRequest` renamed to `AuthCodePayload`
- Interface `RefreshTokenRequest` renamed to `RefreshTokenPayload`

TODO: when there is only one arg, should it be an object??

like:

getAddress({ address }: AddressFilters)
OR
getAddress(address: AddressFilters)
