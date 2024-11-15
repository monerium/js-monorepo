import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as Redocusaurus from 'redocusaurus';

const config: Config = {
  title: 'Monerium',
  tagline: 'Onchain fiat',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://monerium.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/js-monorepo/',
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'monerium', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        entryPointStrategy: 'Packages',
        entryPoints: [
          '../../packages/sdk/',
          '../../packages/sdk-react-provider/',
        ],
        out: 'docs/packages',
        publicPath: '/docs/packages',
        watch: process.env.TYPEDOC_WATCH,
        readme: 'none',
        name: 'Packages',
      },
    ],
  ],

  onBrokenLinks: 'throw',
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
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
          // How to use a local instance of OpenAPI spec
          // {
          //   id: 'openapi',
          //   spec: './src/openapi-v2.yaml',
          //   route: '/docs/openapi/',
          // },

          // Let's use the remote instance for now.
          {
            id: 'api',
            spec: 'https://monerium.dev/openapi-v2.yml',
            route: '/docs/api/',
          },
        ],
      },
    ] satisfies Redocusaurus.PresetEntry,
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Monerium',
      logo: {
        alt: 'Monerium Logo',
        src: 'img/logo.png',
      },
      items: [
        { to: '/docs', label: 'Docs', position: 'left' },
        { to: '/docs/api', label: 'API', position: 'left' },
        {
          href: 'https://github.com/monerium/js-monorepo',
          label: 'GitHub',
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
              label: 'API Documentation',
              href: 'https://monerium.dev/api-docs',
            },
            {
              label: 'Developer Portal',
              href: 'https://monerium.dev/',
            },
            {
              label: 'Telegram Group',
              href: 'https://t.me/+W7efXd4p4zQyZjFk',
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
