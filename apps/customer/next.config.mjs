/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Standalone mode needs to be enabled for Docker builds.
 * https://nextjs.org/docs/pages/api-reference/next-config-js/output
 * */
const isStandalone = process.env.STANDALONE === 'true';

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Silencing warnings about missing dependencies in development.
      // https://dev.to/dinhkhai0201/module-not-found-cant-resolve-pino-pretty-g6
      config.resolve.fallback = { fs: false, net: false, tls: false };
      config.externals.push('pino-pretty', 'encoding');
    }
    return config;
  },
  experimental: {
    //https://vercel.com/blog/how-we-optimized-package-imports-in-next-js#what's-the-problem-with-barrel-files
    optimizePackageImports: ['@mui/material'],
  },
};

const standaloneConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
};

const finalConfig = isStandalone
  ? {
      ...nextConfig,
      ...standaloneConfig,
      experimental: {
        ...nextConfig.experimental,
        ...standaloneConfig.experimental,
      },
    }
  : nextConfig;

export default finalConfig;
