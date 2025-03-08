const chains = [
  {
    chainId: 1,
    name: 'Ethereum',
    explorerUrl: 'https://etherscan.io/token/',
    explorerName: 'Etherscan',
    logo: 'https://monerium.app/assets/emoney/chains/ethereum-icon-lg.svg',
    color: '#E6EEF7',
  },
  {
    chainId: 11155111,
    name: 'Sepolia',
    explorerUrl: 'https://sepolia.etherscan.io/token/',
    explorerName: 'Etherscan',
    logo: 'https://monerium.app/assets/emoney/chains/ethereum-icon-lg.svg',
    color: '#E6EEF7',
    testnet: true,
  },

  {
    chainId: 100,
    name: 'Gnosis',
    explorerUrl: 'https://gnosisscan.io/token/',
    explorerName: 'Gnosisscan',
    logo: 'https://monerium.app/assets/emoney/chains/gnosis-icon-lg.svg',
    color: '#E5EAE7',
  },
  {
    chainId: 10200,
    name: 'Chiado',
    explorerUrl: 'https://blockscout.chiadochain.net/address/',
    explorerName: 'Blockscout',
    logo: 'https://monerium.app/assets/emoney/chains/gnosis-icon-lg.svg',
    color: '#E5EAE7',
    testnet: true,
  },

  {
    chainId: 137,
    name: 'Polygon',
    explorerUrl: 'https://polygonscan.com/token/',
    explorerName: 'Polyscan',
    logo: 'https://monerium.app/assets/emoney/chains/polygon-icon-lg.svg',
    color: '#ECE6F7',
  },
  {
    chainId: 80002,
    name: 'Amoy',
    explorerUrl: 'https://amoy.polygonscan.com/token/',
    explorerName: 'Polyscan',
    logo: 'https://monerium.app/assets/emoney/chains/polygon-icon-lg.svg',
    color: '#ECE6F7',
    testnet: true,
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    explorerUrl: 'https://arbiscan.io/token/',
    explorerName: 'Arbiscan',
    logo: 'https://monerium.app/assets/emoney/chains/arbitrum-icon-lg.svg',
    color: '#BCCCFF',
  },
  {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    explorerUrl: 'https://sepolia.arbiscan.io/token/',
    explorerName: 'Arbiscan',
    logo: 'https://monerium.app/assets/emoney/chains/arbitrum-icon-lg.svg',
    color: '#BCCCFF',
    testnet: true,
  },
];

export default chains;
