import path from 'path';
import React from 'react';
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import type * as Redocusaurus from 'redocusaurus';
import typedocConfig from './typedoc.config';

// redoc.lib.js is a UMD bundle that assumes React is available as a global.
// jiti (used by Docusaurus to load plugins server-side) doesn't provide one,
// so we set it here before any plugin is loaded.
(global as any).React = React;

// https://typedoc-plugin-markdown.org/schema.json

const config: Config = {
  title: 'Monerium',
  tagline: 'Onchain fiat',
  favicon: 'img/favicon.ico',

  baseUrl: '/',
  url: 'https://docs.monerium.com',
  organizationName: 'monerium',
  projectName: 'js-monerium',
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        ...typedocConfig,
        id: '@monerium/sdk',
        entryPoints: ['../../packages/sdk/src/index.ts'],
        tsconfig: '../../packages/sdk/tsconfig.json',
        out: 'docs/packages/sdk',
        publicPath: '/packages/sdk',
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        ...typedocConfig,
        id: '@monerium/sdk-react-provider',
        entryPoints: ['../../packages/sdk-react-provider/src/index.ts'],
        tsconfig: '../../packages/sdk-react-provider/tsconfig.json',
        out: 'docs/packages/sdk-react-provider',
        publicPath: '/packages/sdk-react-provider',
      },
    ],
  ],
  // The TypeDoc (sdk and sdk-react-provider) publicPath is hardcoded and creates broken links when baseUrl changes.
  // Docusaurus leaves pathname protocol links as is, so for example when linking to API docs,
  // you can silence the warnings by doing: `[Authorization](pathname:///api#tag/auth/operation/auth)`
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // set /docs/ as the root path
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        // https://redocusaurus.vercel.app/docs/getting-started/plugin-options
        specs: [
          {
            id: 'api',
            spec: require.resolve('@monerium/openapi'),
            route: '/api/',
          },
        ],
      },
    ] satisfies Redocusaurus.PresetEntry,
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Monerium',
      logo: {
        alt: 'Monerium Logo',
        src: 'img/logo.png',
      },
      items: [
        { to: '/', label: 'Docs', position: 'left' },
        { to: '/api', label: 'API', position: 'left' },
        { to: '/packages/sdk', label: 'SDK', position: 'left' },
        {
          to: '/packages/sdk-react-provider',
          label: 'React',
          position: 'left',
        },
        {
          'aria-label': 'Discord Invite',
          className: 'navbar--discord-link',
          href: 'https://monerium.com/invite/discord',
          position: 'right',
        },
        {
          'aria-label': 'GitHub Repository',
          className: 'navbar--github-link',
          href: 'https://github.com/monerium/js-monorepo',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Development',
          items: [
            {
              label: 'Discord',
              href: 'https://monerium.com/invite/discord',
            },
            {
              label: 'Report an Issue',
              href: 'https://github.com/monerium/js-monorepo/issues',
            },
          ],
        },
        {
          title: 'Monerium',
          items: [
            {
              label: 'Monerium.com',
              href: 'https://monerium.com/',
            },
            {
              label: 'Monerium.app',
              href: 'https://monerium.app/',
            },
          ],
        },
        {
          title: 'NPM Packages',
          items: [
            {
              label: '@monerium/sdk',
              href: 'https://www.npmjs.com/package/@monerium/sdk',
            },
            {
              label: '@monerium/sdk-react-provider',
              href: 'https://www.npmjs.com/package/@monerium/sdk-react-provider',
            },
          ],
        },
      ],
      copyright: `${new Date().getFullYear()} Monerium.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
