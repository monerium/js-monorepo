import type { Config } from './types';

const MONERIUM_CONFIG: Config = {
  environments: {
    production: {
      api: 'https://api.monerium.app',
      web: 'https://monerium.app',
      wss: 'wss://api.monerium.app',
    },
    sandbox: {
      api: 'https://api.monerium.dev',
      web: 'https://sandbox.monerium.dev',
      wss: 'wss://api.monerium.dev',
    },
    staging: {
      api: 'https://api-staging.monerium.dev',
      web: 'https://staging.monerium.dev',
      wss: 'wss://api-staging.monerium.dev',
    },
    development: {
      api: 'http://localhost:4000/external-api',
      web: 'http://localhost:3000',
      wss: 'ws://localhost:4000/external-api',
    },
  },
};

export { MONERIUM_CONFIG };
