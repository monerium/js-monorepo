'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { WagmiProvider } from 'wagmi';

import config from 'src/config/wagmi.config';
import StyleProviders from './Style/StyleProviders';

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RainbowKitProvider>
          <StyleProviders>{children}</StyleProviders>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
export default Providers;
