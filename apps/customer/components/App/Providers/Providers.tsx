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

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MoneriumProvider
            clientId="f2cd22fa-2406-11ef-8cfc-fe34ee86fd51"
            redirectUrl="http://localhost:3000/dashboard"
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
