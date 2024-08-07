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
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MoneriumProvider
            clientId="f99e629b-6dca-11ee-8aa6-5273f65ed05b"
            redirectUri={`${baseUrl}/dashboard`}
            environment="sandbox"
          >
            <StyleProviders>{children}</StyleProviders>
          </MoneriumProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
export default Providers;
