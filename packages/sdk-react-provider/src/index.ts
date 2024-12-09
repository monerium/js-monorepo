/**
 * @packageDocumentation
 * A library to interact with Monerium API with React hooks.
 *
 * The MoneriumProvider context provider utilizes React Query for async data fetching and caching.
 *
 * ## Installation
 *
 * ```bash
 * pnpm add @monerium/sdk-react-provider @tanstack/react-query
 * ```
 *
 * ### Wrap App in Context Provider
 *
 * Wrap your app in the `QueryClientProvider` React Context Provider and pass a new `QueryClient` instance to the `client` property
 *
 * Inside the `QueryClientProvider`, wrap your app in the `MoneriumProvider` React Context Provider and pass the auth flow's `clientId`, `redirectUri`, and `environment` configuration.
 *
 * Hooks are now accessible in your app.
 *
 * @example
 * ```tsx
 * import { createRoot } from 'react-dom/client';
 * import { MoneriumProvider } from '@monerium/sdk-react-provider';
 * import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 *
 * import App from './App';
 * const rootElement = document.getElementById('root');
 * const root = createRoot(rootElement);
 *
 * const queryClient = new QueryClient();
 *
 * root.render(
 *   <QueryClientProvider client={queryClient}>
 *      <MoneriumProvider
 *          clientId="..."
 *          redirectUri="..."
 *          environment="sandbox"
 *       >
 *          <App />
 *      </MoneriumProvider>
 *    </QueryClientProvider>
 * );
 * ```
 *
 */

export * from './lib/provider';
export * from './lib/context';
export * from './lib/hooks';
export * from './lib/types';
