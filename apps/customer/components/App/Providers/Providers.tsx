'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

import { MoneriumProvider } from '@monerium/sdk-react-provider';

import config from 'src/config/wagmi.config';
import StyleProviders from './Style/StyleProviders';

const queryClient = new QueryClient();

const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

function Providers({ children }: { children: React.ReactNode }) {
  const [refreshToken, setRefreshToken] = React.useState<string | undefined>(
    undefined
  );
  React.useEffect(() => {
    let rToken = window.localStorage.getItem(
      'monerium.insecurely_store_refresh_token'
    );
    if (rToken) {
      setRefreshToken(rToken);
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MoneriumProvider
            clientId="9ee602d1-cc19-11ef-92b5-aae55502171d"
            redirectUri={`${baseUrl}/dashboard`}
            environment="sandbox"
            debug={true}
            refreshToken={refreshToken}
            onRefreshTokenUpdate={(token) => {
              if (token) {
                window.localStorage.setItem(
                  'monerium.insecurely_store_refresh_token',
                  token
                );
                setRefreshToken(token);
              }
            }}
          >
            <StyleProviders>{children}</StyleProviders>
          </MoneriumProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
export default Providers;
