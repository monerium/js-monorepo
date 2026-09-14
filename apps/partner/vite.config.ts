import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { loadPartnerEnv } from './server/load-env.ts';

const partnerEnv = loadPartnerEnv();

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_REOWN_PROJECT_ID': JSON.stringify(partnerEnv.VITE_REOWN_PROJECT_ID ?? ''),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
