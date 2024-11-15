# @monerium/sdk

A library to interact with Monerium API.

## Installation

```bash
pnpm add @monerium/sdk
```

## Example

```tsx
import { MoneriumClient } from '@monerium/sdk';

const monerium = new MoneriumClient({
 clientId: '...',
 redirectUri: '...',
 environment: 'sandbox',
})

// Will redirect the user to Monerium's authentication code flow.
await monerium.getAccess();

// Retrieve profiles the client has access to.
await monerium.getProfiles();
```

## References

### default

Renames and re-exports [MoneriumClient](/docs/packages/sdk/classes/MoneriumClient.md)

## Classes

- [MoneriumClient](/docs/packages/sdk/classes/MoneriumClient.md)

## Functions

- [getChain](/docs/packages/sdk/functions/getChain.md)
- [parseChain](/docs/packages/sdk/functions/parseChain.md)
- [placeOrderMessage](/docs/packages/sdk/functions/placeOrderMessage.md)
- [rfc3339](/docs/packages/sdk/functions/rfc3339.md)

## Variables

- [constants](/docs/packages/sdk/variables/constants.md)

## Interfaces

- [Address](/docs/packages/sdk/interfaces/Address.md)
- [AddressesQueryParams](/docs/packages/sdk/interfaces/AddressesQueryParams.md)
- [AddressesResponse](/docs/packages/sdk/interfaces/AddressesResponse.md)
- [AuthCodePayload](/docs/packages/sdk/interfaces/AuthCodePayload.md)
- [AuthFlowOptions](/docs/packages/sdk/interfaces/AuthFlowOptions.md)
- [AuthorizationCodeCredentials](/docs/packages/sdk/interfaces/AuthorizationCodeCredentials.md)
- [Balances](/docs/packages/sdk/interfaces/Balances.md)
- [BearerProfile](/docs/packages/sdk/interfaces/BearerProfile.md)
- [ClientCredentials](/docs/packages/sdk/interfaces/ClientCredentials.md)
- [ClientCredentialsPayload](/docs/packages/sdk/interfaces/ClientCredentialsPayload.md)
- [CorporateProfileDetails](/docs/packages/sdk/interfaces/CorporateProfileDetails.md)
- [CorporateProfileDetailsRequest](/docs/packages/sdk/interfaces/CorporateProfileDetailsRequest.md)
- [Corporation](/docs/packages/sdk/interfaces/Corporation.md)
- [Counterpart](/docs/packages/sdk/interfaces/Counterpart.md)
- [CrossChainIdentifier](/docs/packages/sdk/interfaces/CrossChainIdentifier.md)
- [CurrencyBalance](/docs/packages/sdk/interfaces/CurrencyBalance.md)
- [Fee](/docs/packages/sdk/interfaces/Fee.md)
- [IBAN](/docs/packages/sdk/interfaces/IBAN.md)
- [IBANIdentifier](/docs/packages/sdk/interfaces/IBANIdentifier.md)
- [IBANsResponse](/docs/packages/sdk/interfaces/IBANsResponse.md)
- [IbansQueryParams](/docs/packages/sdk/interfaces/IbansQueryParams.md)
- [Identifier](/docs/packages/sdk/interfaces/Identifier.md)
- [Individual](/docs/packages/sdk/interfaces/Individual.md)
- [KYC](/docs/packages/sdk/interfaces/KYC.md)
- [LinkAddress](/docs/packages/sdk/interfaces/LinkAddress.md)
- [LinkedAddress](/docs/packages/sdk/interfaces/LinkedAddress.md)
- [MoveIbanPayload](/docs/packages/sdk/interfaces/MoveIbanPayload.md)
- [NewOrderByAccountId](/docs/packages/sdk/interfaces/NewOrderByAccountId.md)
- [NewOrderByAddress](/docs/packages/sdk/interfaces/NewOrderByAddress.md)
- [NewOrderCommon](/docs/packages/sdk/interfaces/NewOrderCommon.md)
- [Order](/docs/packages/sdk/interfaces/Order.md)
- [OrderFilter](/docs/packages/sdk/interfaces/OrderFilter.md)
- [OrderMetadata](/docs/packages/sdk/interfaces/OrderMetadata.md)
- [OrderNotificationQueryParams](/docs/packages/sdk/interfaces/OrderNotificationQueryParams.md)
- [OrdersResponse](/docs/packages/sdk/interfaces/OrdersResponse.md)
- [PersonalProfileDetails](/docs/packages/sdk/interfaces/PersonalProfileDetails.md)
- [PersonalProfileDetailsRequest](/docs/packages/sdk/interfaces/PersonalProfileDetailsRequest.md)
- [Profile](/docs/packages/sdk/interfaces/Profile.md)
- [ProfilePermissions](/docs/packages/sdk/interfaces/ProfilePermissions.md)
- [ProfilesQueryParams](/docs/packages/sdk/interfaces/ProfilesQueryParams.md)
- [ProfilesResponse](/docs/packages/sdk/interfaces/ProfilesResponse.md)
- [RefreshTokenPayload](/docs/packages/sdk/interfaces/RefreshTokenPayload.md)
- [RequestIbanPayload](/docs/packages/sdk/interfaces/RequestIbanPayload.md)
- [SCANIdentifier](/docs/packages/sdk/interfaces/SCANIdentifier.md)
- [SignUpPayload](/docs/packages/sdk/interfaces/SignUpPayload.md)
- [SignUpResponse](/docs/packages/sdk/interfaces/SignUpResponse.md)
- [SupportingDoc](/docs/packages/sdk/interfaces/SupportingDoc.md)
- [SupportingDocMetadata](/docs/packages/sdk/interfaces/SupportingDocMetadata.md)
- [Token](/docs/packages/sdk/interfaces/Token.md)

## Type Aliases

- [AuthArgs](/docs/packages/sdk/type-aliases/AuthArgs.md)
- [BearerTokenCredentials](/docs/packages/sdk/type-aliases/BearerTokenCredentials.md)
- [Beneficiary](/docs/packages/sdk/type-aliases/Beneficiary.md)
- [Chain](/docs/packages/sdk/type-aliases/Chain.md)
- [ChainId](/docs/packages/sdk/type-aliases/ChainId.md)
- [ClassOptions](/docs/packages/sdk/type-aliases/ClassOptions.md)
- [Config](/docs/packages/sdk/type-aliases/Config.md)
- [CosmosChainId](/docs/packages/sdk/type-aliases/CosmosChainId.md)
- [CurrencyCode](/docs/packages/sdk/type-aliases/CurrencyCode.md)
- [Director](/docs/packages/sdk/type-aliases/Director.md)
- [ENV](/docs/packages/sdk/type-aliases/ENV.md)
- [Environment](/docs/packages/sdk/type-aliases/Environment.md)
- [EvmChainId](/docs/packages/sdk/type-aliases/EvmChainId.md)
- [NewOrder](/docs/packages/sdk/type-aliases/NewOrder.md)
- [OpenArgs](/docs/packages/sdk/type-aliases/OpenArgs.md)
- [PKCERequest](/docs/packages/sdk/type-aliases/PKCERequest.md)
- [PKCERequestArgs](/docs/packages/sdk/type-aliases/PKCERequestArgs.md)
- [Representative](/docs/packages/sdk/type-aliases/Representative.md)
- [ResponseStatus](/docs/packages/sdk/type-aliases/ResponseStatus.md)
- [SubmitProfileDetailsPayload](/docs/packages/sdk/type-aliases/SubmitProfileDetailsPayload.md)
- [Ticker](/docs/packages/sdk/type-aliases/Ticker.md)
- [TokenSymbol](/docs/packages/sdk/type-aliases/TokenSymbol.md)

## Enumerations

- [AccountState](/docs/packages/sdk/enumerations/AccountState.md)
- [Currency](/docs/packages/sdk/enumerations/Currency.md)
- [IdDocumentKind](/docs/packages/sdk/enumerations/IdDocumentKind.md)
- [KYCOutcome](/docs/packages/sdk/enumerations/KYCOutcome.md)
- [KYCState](/docs/packages/sdk/enumerations/KYCState.md)
- [Method](/docs/packages/sdk/enumerations/Method.md)
- [OrderKind](/docs/packages/sdk/enumerations/OrderKind.md)
- [OrderState](/docs/packages/sdk/enumerations/OrderState.md)
- [PaymentStandard](/docs/packages/sdk/enumerations/PaymentStandard.md)
- [Permission](/docs/packages/sdk/enumerations/Permission.md)
- [ProfileState](/docs/packages/sdk/enumerations/ProfileState.md)
- [ProfileType](/docs/packages/sdk/enumerations/ProfileType.md)
