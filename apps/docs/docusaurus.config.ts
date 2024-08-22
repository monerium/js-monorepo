import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import i18n, { locales } from '@generated/i18n';
import sdkReactProviderTypedocs from '../../packages/sdk-react-provider/typedoc.config.js';
import sdkTypedocs from '../../packages/sdk/typedoc.config.js';

const config: Config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
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
        out: 'docs',
        publicPath: '/docs/',
        watch: process.env.TYPEDOC_WATCH,
        readme: 'none',
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
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Tutorial',
        // },
        { to: '/docs', label: 'Docs', position: 'left' },
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
              label: 'Developer Portal',
              href: 'https://monerium.dev/',
            },
            {
              label: 'API Documentation',
              href: 'https://monerium.dev/api-docs',
            },
            {
              label: 'Issues',
              href: 'https://github.com/monerium/js-monorepo/issues',
            },
            {
              label: 'Telegram Group',
              href: 'https://t.me/+W7efXd4p4zQyZjFk',
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
