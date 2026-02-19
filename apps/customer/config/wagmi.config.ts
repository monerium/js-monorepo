import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';

// Lazy load connectors to prevent SSR errors with IndexedDB
// See: https://github.com/scaffold-eth/scaffold-eth-2/pull/1163
const getConnectors = () => {
  // Only create connectors on client-side to avoid SSR issues
  // TODO: update when https://github.com/rainbow-me/rainbowkit/issues/2476 is resolved
  if (typeof window === 'undefined') {
    return [];
  }

  return connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [
          metaMaskWallet,
          walletConnectWallet,
          coinbaseWallet,
          rainbowWallet,
        ],
      },
    ],
    {
      appName: 'Monerium',
      projectId: 'YOUR_PROJECT_ID', // TODO: Add your WalletConnect project ID
    }
  );
};

export const config = createConfig({
  chains: [sepolia],
  connectors: getConnectors(),
  ssr: true,
  transports: {
    [sepolia.id]: http(),
  },
});

export default config;
