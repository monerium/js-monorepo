| [Monerium.com](https://monerium.com/) | [Monerium.app](https://monerium.app/) | [Monerium.dev](https://monerium.dev/) |
| ------------------------------------- | ------------------------------------- | ------------------------------------- |

# Monerium SDK React Provider

  <a href="https://monerium.dev/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Developer_portal-2c6ca7">
      <img src="https://img.shields.io/badge/Developer_portal-2c6ca7" alt="Static Badge">
    </picture>
  </a>
  <a href="https://monerium.dev/api-docs">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/API_documentation-2c6ca7">
      <img src="https://img.shields.io/badge/API_documentation-2c6ca7" alt="Static Badge">
    </picture>
  </a>
  </br>
    <a href="https://www.npmjs.com/package/@monerium/sdk-react-provider">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40monerium%2Fsdk-react-provider?colorA=2c6ca7&colorB=21262d">
      <img src="https://img.shields.io/npm/v/%40monerium%2Fsdk-react-provider?colorA=f6f8fa&colorB=f6f8fa" alt="Version">
    </picture>
  </a>
  <a href="https://github.com/monerium/js-monorepo/issues>
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/issues/monerium/js-monorepo?colorA=2c6ca7&colorB=21262d">
      <img src="https://img.shields.io/github/issues/monerium/js-monorepo?colorA=2c6ca7&colorB=21262d" alt="Version">
    </picture>
  </a>

## Installation

```
pnpm add @monerium/sdk-react-provider @tanstack/react-query
```

- [TanStack Query](https://tanstack.com/query/v5) is an async state manager that handles requests, caching, and more.

### Wrap App in Context Provider

Wrap your app in the `QueryClientProvider` React Context Provider and pass a new `QueryClient` instance to the `client` property

Inside the `QueryClientProvider`, wrap your app in the `MoneriumProvider` React Context Provider and pass the auth flow's `clientId`, `redirectUrl`, and `environment` configuration.

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MoneriumProvider } from '@monerium/sdk-react-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MoneriumProvider
        clientId="f99e629b-6dca-11ee-8aa6-5273f65ed05b"
        redirectUrl="https://pntvgs.csb.app/"
        environment="sandbox"
      >
        <App />
      </MoneriumProvider>
    </QueryClientProvider>
  </StrictMode>
);
```

## Hooks

The following hooks are now available within your application:

[useAuth](./docs/generated/functions/useAuth.md)</br>
[useAuthContext](./docs/generated/functions/useAuthContext.md)</br>
[useBalances](./docs/generated/functions/useBalances.md)</br>
[useLinkAddress](./docs/generated/functions/useLinkAddress.md)</br>
[useOrder](./docs/generated/functions/useOrder.md)</br>
[useOrders](./docs/generated/functions/useOrders.md)</br>
[usePlaceOrder](./docs/generated/functions/usePlaceOrder.md)</br>
[useProfile](./docs/generated/functions/useProfile.md)</br>
[useProfiles](./docs/generated/functions/useProfiles.md)</br>
[useTokens](./docs/generated/functions/useTokens.md)</br>

### Example

```tsx
import { useAuth, useProfile } from '@monerium/sdk-react-provider';

export default function App() {
  const { authorize, isAuthorized } = useAuth();
  const { profile } = useProfile();

  return (
    <div className="App">
      {!isAuthorized && <button onClick={authorize}>Authorize</button>}
      {profile ? <h1>{profile?.email}</h1> : <h1>No profile</h1>}
    </div>
  );
}
```

## Demo

https://pntvgs.csb.app/

Hook used to access the SDK: https://codesandbox.io/s/monerium-sdk-react-provider-pntvgs?file=/src/App.js

The application is wrapped with MoneriumProvider
https://codesandbox.io/s/monerium-sdk-react-provider-pntvgs?file=/src/index.js

# Development

## Running unit tests

Run `turbo --filter @monerium/sdk-react-provider test` to execute the unit tests

## Documentation

We use [TypeDoc](https://typedoc.org/) to generate the documentation.

There are a few caveats to keep in mind when documenting the code:

- Use `@group` to group functions in the entry file. E.g. `@group Hooks`.
- To specifically mark `@param` as optional, use square brackets, e.g. `[param]`. Useful for optional destructed parameters.
- For optional destructed parameters, use inline typing to improve readability.

  ```diff
  + @param {Object} [param] - Optional parameter.
  + @param {MyQueryType} [param.query] - Description.
  +
  + function useMyHook(
  +   { query }:
  +   { query?: MyQueryType } = {}
  + ) {}
  ```

  Document output:

  ```ts
  param?: Object
  param?.query MyQueryType
  ```

  Instead of:

  ```diff
  - type UseMyHookParams = {
  -   query?: MyQueryType
  - }
  - function useMyHook(params?: UseHookParams) {}
  ```

  Document output:

  ```ts
  params?: UseMyHookParams
  ```

  > This would require the viewer to navigate into the `UseMyHookParams` type to see the optional `query` property.
