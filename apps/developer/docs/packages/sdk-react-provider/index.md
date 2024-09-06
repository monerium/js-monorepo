# @monerium/sdk-react-provider

A library to interact with Monerium API with React hooks.

The MoneriumProvider context provider utilizes React Query for async data fetching and caching.

## Installation

```bash
pnpm add @monerium/sdk-react-provider @tanstack/react-query
```

### Wrap App in Context Provider

Wrap your app in the `QueryClientProvider` React Context Provider and pass a new `QueryClient` instance to the `client` property

Inside the `QueryClientProvider`, wrap your app in the `MoneriumProvider` React Context Provider and pass the auth flow's `clientId`, `redirectUri`, and `environment` configuration.

Hooks are now accessible in your app.

## Example

```tsx
import { createRoot } from 'react-dom/client';
import { MoneriumProvider } from '@monerium/sdk-react-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
     <MoneriumProvider
         clientId="..."
         redirectUri="..."
         environment="sandbox"
      >
         <App />
     </MoneriumProvider>
   </QueryClientProvider>
);
```

## Provider

- [MoneriumProvider](/docs/packages/sdk-react-provider/functions/MoneriumProvider.md)

## Hooks

### Addresses

- [useAddress](/docs/packages/sdk-react-provider/functions/useAddress.md)
- [useAddresses](/docs/packages/sdk-react-provider/functions/useAddresses.md)
- [useBalances](/docs/packages/sdk-react-provider/functions/useBalances.md)

### Authentication

- [useAuth](/docs/packages/sdk-react-provider/functions/useAuth.md)

### IBANs

- [useIBAN](/docs/packages/sdk-react-provider/functions/useIBAN.md)
- [useIBANs](/docs/packages/sdk-react-provider/functions/useIBANs.md)
- [useMoveIban](/docs/packages/sdk-react-provider/functions/useMoveIban.md)
- [useRequestIban](/docs/packages/sdk-react-provider/functions/useRequestIban.md)

### Profiles

- [useLinkAddress](/docs/packages/sdk-react-provider/functions/useLinkAddress.md)
- [useProfile](/docs/packages/sdk-react-provider/functions/useProfile.md)
- [useProfiles](/docs/packages/sdk-react-provider/functions/useProfiles.md)
- [useSubmitProfileDetails](/docs/packages/sdk-react-provider/functions/useSubmitProfileDetails.md)

### Orders

- [useOrder](/docs/packages/sdk-react-provider/functions/useOrder.md)
- [useOrders](/docs/packages/sdk-react-provider/functions/useOrders.md)
- [usePlaceOrder](/docs/packages/sdk-react-provider/functions/usePlaceOrder.md)

### Other

- [useBalance](/docs/packages/sdk-react-provider/functions/useBalance.md)
- [useTokens](/docs/packages/sdk-react-provider/functions/useTokens.md)

## Variables

- [MoneriumContext](/docs/packages/sdk-react-provider/variables/MoneriumContext.md)
- [keys](/docs/packages/sdk-react-provider/variables/keys.md)

## Interfaces

- [Address](/docs/packages/sdk-react-provider/interfaces/Address.md)
- [Balances](/docs/packages/sdk-react-provider/interfaces/Balances.md)
- [IBAN](/docs/packages/sdk-react-provider/interfaces/IBAN.md)
- [LinkAddress](/docs/packages/sdk-react-provider/interfaces/LinkAddress.md)
- [MoveIbanPayload](/docs/packages/sdk-react-provider/interfaces/MoveIbanPayload.md)
- [Order](/docs/packages/sdk-react-provider/interfaces/Order.md)
- [Profile](/docs/packages/sdk-react-provider/interfaces/Profile.md)
- [ProfilePermissions](/docs/packages/sdk-react-provider/interfaces/ProfilePermissions.md)
- [Token](/docs/packages/sdk-react-provider/interfaces/Token.md)

## Type Aliases

- [AuthorizeParams](/docs/packages/sdk-react-provider/type-aliases/AuthorizeParams.md)
- [MutationOptions](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)
- [MutationResult](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)
- [NewOrder](/docs/packages/sdk-react-provider/type-aliases/NewOrder.md)
- [QueryOptions](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)
- [QueryResult](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)
- [ResponseStatus](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md)
- [SdkInstance](/docs/packages/sdk-react-provider/type-aliases/SdkInstance.md)
- [SubmitProfileDetailsPayload](/docs/packages/sdk-react-provider/type-aliases/SubmitProfileDetailsPayload.md)
- [UseAuthReturn](/docs/packages/sdk-react-provider/type-aliases/UseAuthReturn.md)
