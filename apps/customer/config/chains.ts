export interface ChainConfig {
  /** SDK chain id string, e.g. 'ethereum', 'amoy', 'grand' */
  id: string;
  /** Display label, e.g. 'Ethereum Sepolia' */
  name: string;
  /** Chain family, determines logo, e.g. 'ethereum', 'noble', 'camino' */
  family: string;
  /** Logo URL (SVG from monerium.app) */
  logo: string;
  /** Background/badge color */
  color: string;
  /** Numeric EVM chainId (undefined for Cosmos chains) */
  chainId?: number;
  explorerUrl: string;
  explorerName: string;
}

const BASE_LOGO_URL = 'https://monerium.app/assets/chains';

const logo = (family: string) => `${BASE_LOGO_URL}/${family}.svg`;

const chains: ChainConfig[] = [
  // ── Ethereum ──────────────────────────────────────────────────────────
  {
    id: 'ethereum',
    family: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    logo: logo('ethereum'),
    color: '#E6EEF7',
    explorerUrl: 'https://etherscan.io',
    explorerName: 'Etherscan',
  },
  {
    id: 'sepolia',
    family: 'ethereum',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    logo: logo('ethereum'),
    color: '#E6EEF7',
    explorerUrl: 'https://sepolia.etherscan.io',
    explorerName: 'Etherscan',
  },

  // ── Polygon ───────────────────────────────────────────────────────────
  {
    id: 'polygon',
    family: 'polygon',
    name: 'Polygon',
    chainId: 137,
    logo: logo('polygon'),
    color: '#ECE6F7',
    explorerUrl: 'https://polygonscan.com',
    explorerName: 'Polygonscan',
  },
  {
    id: 'amoy',
    family: 'polygon',
    name: 'Polygon Amoy',
    chainId: 80002,
    logo: logo('polygon'),
    color: '#ECE6F7',
    explorerUrl: 'https://amoy.polygonscan.com',
    explorerName: 'Polygonscan',
  },

  // ── Gnosis ────────────────────────────────────────────────────────────
  {
    id: 'gnosis',
    family: 'gnosis',
    name: 'Gnosis',
    chainId: 100,
    logo: logo('gnosis'),
    color: '#E5EAE7',
    explorerUrl: 'https://gnosisscan.io',
    explorerName: 'Gnosisscan',
  },
  {
    id: 'chiado',
    family: 'gnosis',
    name: 'Gnosis Chiado',
    chainId: 10200,
    logo: logo('gnosis'),
    color: '#E5EAE7',
    explorerUrl: 'https://gnosis-chiado.blockscout.com',
    explorerName: 'Blockscout',
  },

  // ── Arbitrum ──────────────────────────────────────────────────────────
  {
    id: 'arbitrum',
    family: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    logo: logo('arbitrum'),
    color: '#BCCCFF',
    explorerUrl: 'https://arbiscan.io',
    explorerName: 'Arbiscan',
  },
  {
    id: 'arbitrumsepolia',
    family: 'arbitrum',
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    logo: logo('arbitrum'),
    color: '#BCCCFF',
    explorerUrl: 'https://sepolia.arbiscan.io',
    explorerName: 'Arbiscan',
  },

  // ── Linea ─────────────────────────────────────────────────────────────
  {
    id: 'linea',
    family: 'linea',
    name: 'Linea',
    chainId: 59144,
    logo: logo('linea'),
    color: '#e1f1f5',
    explorerUrl: 'https://lineascan.build',
    explorerName: 'Lineascan',
  },
  {
    id: 'lineasepolia',
    family: 'linea',
    name: 'Linea Sepolia',
    chainId: 59141,
    logo: logo('linea'),
    color: '#e1f1f5',
    explorerUrl: 'https://sepolia.lineascan.build',
    explorerName: 'Lineascan',
  },

  // ── Scroll ────────────────────────────────────────────────────────────
  {
    id: 'scroll',
    family: 'scroll',
    name: 'Scroll',
    chainId: 534352,
    logo: logo('scroll'),
    color: '#f5ebe1',
    explorerUrl: 'https://scrollscan.com',
    explorerName: 'Scrollscan',
  },
  {
    id: 'scrollsepolia',
    family: 'scroll',
    name: 'Scroll Sepolia',
    chainId: 534351,
    logo: logo('scroll'),
    color: '#f5ebe1',
    explorerUrl: 'https://sepolia.scrollscan.com',
    explorerName: 'Scrollscan',
  },

  // ── Base ──────────────────────────────────────────────────────────────
  {
    id: 'base',
    family: 'base',
    name: 'Base',
    chainId: 8453,
    logo: logo('base'),
    color: '#d6e7ff',
    explorerUrl: 'https://basescan.org',
    explorerName: 'Basescan',
  },
  {
    id: 'basesepolia',
    family: 'base',
    name: 'Base Sepolia',
    chainId: 84532,
    logo: logo('base'),
    color: '#d6e7ff',
    explorerUrl: 'https://sepolia.basescan.org',
    explorerName: 'Basescan',
  },

  // ── Camino ────────────────────────────────────────────────────────────
  {
    id: 'camino',
    family: 'camino',
    name: 'Camino',
    chainId: 500,
    logo: logo('camino'),
    color: '#fde8c8',
    explorerUrl: 'https://suite.camino.network/explorer/camino/c-chain',
    explorerName: 'Camino Explorer',
  },
  {
    id: 'columbus',
    family: 'camino',
    name: 'Camino Columbus',
    chainId: 501,
    logo: logo('camino'),
    color: '#fde8c8',
    explorerUrl: 'https://suite.camino.network/explorer/columbus/c-chain',
    explorerName: 'Camino Explorer',
  },

  // ── Noble (Cosmos) ────────────────────────────────────────────────────
  {
    id: 'noble',
    family: 'noble',
    name: 'Noble',
    // Cosmos chainId is not a number; omit chainId for cosmos chains
    logo: logo('noble'),
    color: '#e8e4f7',
    explorerUrl: 'https://www.mintscan.io/noble',
    explorerName: 'Mintscan',
  },
  {
    id: 'grand',
    family: 'noble',
    name: 'Noble Grand',
    logo: logo('noble'),
    color: '#e8e4f7',
    explorerUrl: 'https://www.mintscan.io/noble-testnet',
    explorerName: 'Mintscan',
  },
  {
    id: 'florin',
    family: 'noble',
    name: 'Noble Florin',
    logo: logo('noble'),
    color: '#e8e4f7',
    explorerUrl: 'https://explorer.florin.noble.xyz/florin',
    explorerName: 'Noble Explorer',
  },
];

// ── Lookup maps ───────────────────────────────────────────────────────────────

/** Keyed by SDK chain id string (e.g. 'ethereum', 'amoy', 'grand'). */
const chainNameMap: Record<string, ChainConfig> = Object.fromEntries(
  chains.map((c) => [c.id, c])
);

/** Keyed by numeric EVM chainId. Cosmos chains are excluded. */
const chainIdMap: Record<number, ChainConfig> = Object.fromEntries(
  chains
    .filter(
      (c): c is ChainConfig & { chainId: number } => c.chainId !== undefined
    )
    .map((c) => [c.chainId, c])
);

/**
 * Look up chain config by SDK chain id string (e.g. 'ethereum', 'amoy', 'grand').
 * Case-insensitive.
 */
export function getChainConfig(chain: string): ChainConfig | undefined {
  return chainNameMap[chain.toLowerCase()];
}

/**
 * Look up chain config by numeric EVM chainId.
 * Returns undefined for Cosmos chains.
 */
export function getChainConfigById(chainId: number): ChainConfig | undefined {
  return chainIdMap[chainId];
}

export default chains;
