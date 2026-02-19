export interface ChainConfig {
  chainId: number;
  name: string;
  logo: string;
  color: string;
  explorerUrl: string;
  explorerName: string;
}

const chainConfigs: ChainConfig[] = [
  {
    chainId: 1,
    name: 'Ethereum',
    explorerUrl: 'https://etherscan.io/token/',
    explorerName: 'Etherscan',
    logo: 'https://monerium.app/assets/chains/ethereum.svg',
    color: '#E6EEF7',
  },
  {
    chainId: 11155111,
    name: 'Sepolia',
    explorerUrl: 'https://sepolia.etherscan.io/token/',
    explorerName: 'Etherscan',
    logo: 'https://monerium.app/assets/chains/ethereum.svg',
    color: '#E6EEF7',
  },
  {
    chainId: 100,
    name: 'Gnosis',
    explorerUrl: 'https://gnosisscan.io/token/',
    explorerName: 'Gnosisscan',
    logo: 'https://monerium.app/assets/chains/gnosis.svg',
    color: '#E5EAE7',
  },
  {
    chainId: 10200,
    name: 'Chiado',
    explorerUrl: 'https://gnosis-chiado.blockscout.com/address/',
    explorerName: 'Blockscout',
    logo: 'https://monerium.app/assets/chains/gnosis.svg',
    color: '#E5EAE7',
  },
  {
    chainId: 137,
    name: 'Polygon',
    explorerUrl: 'https://polygonscan.com/token/',
    explorerName: 'Polyscan',
    logo: 'https://monerium.app/assets/chains/polygon.svg',
    color: '#ECE6F7',
  },
  {
    chainId: 80002,
    name: 'Amoy',
    explorerUrl: 'https://amoy.polygonscan.com/token/',
    explorerName: 'Polyscan',
    logo: 'https://monerium.app/assets/chains/polygon.svg',
    color: '#ECE6F7',
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    explorerUrl: 'https://arbiscan.io/token/',
    explorerName: 'Arbiscan',
    logo: 'https://monerium.app/assets/chains/arbitrum.svg',
    color: '#BCCCFF',
  },
  {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    explorerUrl: 'https://sepolia.arbiscan.io/token/',
    explorerName: 'Arbiscan',
    logo: 'https://monerium.app/assets/chains/arbitrum.svg',
    color: '#BCCCFF',
  },
  {
    chainId: 59144,
    name: 'Linea',
    explorerUrl: 'https://lineascan.build/token/',
    explorerName: 'Lineascan',
    logo: 'https://monerium.app/assets/chains/linea.svg',
    color: '#e1f1f5',
  },
  {
    chainId: 59141,
    name: 'Linea Sepolia',
    explorerUrl: 'https://sepolia.lineascan.build/token/',
    explorerName: 'Lineascan',
    logo: 'https://monerium.app/assets/chains/linea.svg',
    color: '#e1f1f5',
  },
  {
    chainId: 534352,
    name: 'Scroll',
    explorerUrl: 'https://scrollscan.com/token/',
    explorerName: 'ScrollScan',
    logo: 'https://monerium.app/assets/chains/scroll.svg',
    color: '#f5ebe1',
  },
  {
    chainId: 534351,
    name: 'Scroll Sepolia',
    explorerUrl: 'https://sepolia.scrollscan.com/token/',
    explorerName: 'ScrollScan',
    logo: 'https://monerium.app/assets/chains/scroll.svg',
    color: '#f5ebe1',
  },
  {
    chainId: 8453,
    name: 'Base',
    explorerUrl: 'https://basescan.org/token/',
    explorerName: 'BaseScan',
    logo: 'https://monerium.app/assets/chains/base.svg',
    color: '#d6e7ff',
  },
  {
    chainId: 84532,
    name: 'Base Sepolia',
    explorerUrl: 'https://sepolia.basescan.org/token/',
    explorerName: 'BaseScan',
    logo: 'https://monerium.app/assets/chains/base.svg',
    color: '#d6e7ff',
  },
];

/**
 * Maps SDK chain name strings (e.g. 'ethereum', 'amoy') to chain config.
 * Sandbox chains share logos/colors with their mainnet counterpart.
 */
const chainNameMap: Record<string, ChainConfig> = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    logo: 'https://monerium.app/assets/chains/ethereum.svg',
    color: '#E6EEF7',
    explorerUrl: 'https://etherscan.io/token/',
    explorerName: 'Etherscan',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    logo: 'https://monerium.app/assets/chains/ethereum.svg',
    color: '#E6EEF7',
    explorerUrl: 'https://sepolia.etherscan.io/token/',
    explorerName: 'Etherscan',
  },
  gnosis: {
    chainId: 100,
    name: 'Gnosis',
    logo: 'https://monerium.app/assets/chains/gnosis.svg',
    color: '#E5EAE7',
    explorerUrl: 'https://gnosisscan.io/token/',
    explorerName: 'Gnosisscan',
  },
  chiado: {
    chainId: 10200,
    name: 'Chiado',
    logo: 'https://monerium.app/assets/chains/gnosis.svg',
    color: '#E5EAE7',
    explorerUrl: 'https://gnosis-chiado.blockscout.com/address/',
    explorerName: 'Blockscout',
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    logo: 'https://monerium.app/assets/chains/polygon.svg',
    color: '#ECE6F7',
    explorerUrl: 'https://polygonscan.com/token/',
    explorerName: 'Polyscan',
  },
  amoy: {
    chainId: 80002,
    name: 'Amoy',
    logo: 'https://monerium.app/assets/chains/polygon.svg',
    color: '#ECE6F7',
    explorerUrl: 'https://amoy.polygonscan.com/token/',
    explorerName: 'Polyscan',
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum',
    logo: 'https://monerium.app/assets/chains/arbitrum.svg',
    color: '#BCCCFF',
    explorerUrl: 'https://arbiscan.io/token/',
    explorerName: 'Arbiscan',
  },
  arbitrumsepolia: {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    logo: 'https://monerium.app/assets/chains/arbitrum.svg',
    color: '#BCCCFF',
    explorerUrl: 'https://sepolia.arbiscan.io/token/',
    explorerName: 'Arbiscan',
  },
  linea: {
    chainId: 59144,
    name: 'Linea',
    logo: 'https://monerium.app/assets/chains/linea.svg',
    color: '#e1f1f5',
    explorerUrl: 'https://lineascan.build/token/',
    explorerName: 'Lineascan',
  },
  lineasepolia: {
    chainId: 59141,
    name: 'Linea Sepolia',
    logo: 'https://monerium.app/assets/chains/linea.svg',
    color: '#e1f1f5',
    explorerUrl: 'https://sepolia.lineascan.build/token/',
    explorerName: 'Lineascan',
  },
  scroll: {
    chainId: 534352,
    name: 'Scroll',
    logo: 'https://monerium.app/assets/chains/scroll.svg',
    color: '#f5ebe1',
    explorerUrl: 'https://scrollscan.com/token/',
    explorerName: 'ScrollScan',
  },
  scrollsepolia: {
    chainId: 534351,
    name: 'Scroll Sepolia',
    logo: 'https://monerium.app/assets/chains/scroll.svg',
    color: '#f5ebe1',
    explorerUrl: 'https://sepolia.scrollscan.com/token/',
    explorerName: 'ScrollScan',
  },
  base: {
    chainId: 8453,
    name: 'Base',
    logo: 'https://monerium.app/assets/chains/base.svg',
    color: '#d6e7ff',
    explorerUrl: 'https://basescan.org/token/',
    explorerName: 'BaseScan',
  },
  basesepolia: {
    chainId: 84532,
    name: 'Base Sepolia',
    logo: 'https://monerium.app/assets/chains/base.svg',
    color: '#d6e7ff',
    explorerUrl: 'https://sepolia.basescan.org/token/',
    explorerName: 'BaseScan',
  },
};

const chainIdMap: Record<number, ChainConfig> = Object.fromEntries(
  chainConfigs.map((c) => [c.chainId, c])
);

/** Look up chain config by SDK chain name string (e.g. 'ethereum', 'amoy'). */
export function getChainConfig(chain: string): ChainConfig | undefined {
  return chainNameMap[chain.toLowerCase()];
}

/** Look up chain config by numeric chainId. */
export function getChainConfigById(chainId: number): ChainConfig | undefined {
  return chainIdMap[chainId];
}

export default chainConfigs;
