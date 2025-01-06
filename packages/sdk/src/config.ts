import type { Config } from './types';

const MONERIUM_CONFIG: Config = {
  environments: {
    production: {
      name: 'production',
      api: 'https://api.monerium.app',
      web: 'https://monerium.app',
      wss: 'wss://api.monerium.app',
    },
    sandbox: {
      name: 'sandbox',
      api: 'https://api.monerium.dev',
      web: 'https://sandbox.monerium.dev',
      wss: 'wss://api.monerium.dev',
    },
  },
};

export { MONERIUM_CONFIG };
