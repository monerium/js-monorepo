'use client';

import * as React from 'react';

import { MoneriumProvider } from '@monerium/sdk-react-provider';

import StyleProviders from './Style/StyleProviders';
import WalletProviders from './Wallet/WalletProviders';
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProviders>
      <MoneriumProvider
        clientId="f2cd22fa-2406-11ef-8cfc-fe34ee86fd51"
        redirectUrl="http://localhost:3000/dashboard"
        environment="sandbox"
      >
        <StyleProviders>{children}</StyleProviders>
      </MoneriumProvider>
    </WalletProviders>
  );
}
export default Providers;
