import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { TypeDocOptions } from 'typedoc';
import { PluginOptions } from 'typedoc-plugin-markdown';

// https://typedoc-plugin-markdown.org/schema.json
const typedocConfig: PluginOptions | Partial<TypeDocOptions> = {
  cleanOutputDir: true,
  entryPointStrategy: 'Expand',
  gitRevision: 'main',

  readme: 'none',

  // skipErrorChecking: true,
  expandObjects: true,
  expandParameters: true,

  hideParameterTypesInTitle: true,
  hidePageHeader: true,
  hideGenerator: true,

  categorizeByGroup: true,

  navigationModel: {
    excludeFolders: true,
    excludeGroups: false,
    excludeCategories: false,
  },

  parametersFormat: 'table',
  interfacePropertiesFormat: 'table',
  enumMembersFormat: 'table',
  classPropertiesFormat: 'table',
  typeDeclarationFormat: 'table',
  propertyMembersFormat: 'table',

  kindSortOrder: [
    'Class',
    'Property',
    'Function',
    'Variable',
    'Interface',
    'TypeAlias',
    'Enum',
    'EnumMember',
  ],
  groupOrder: [
    'Provider',
    'Hooks',
    'Constructors',
    'Properties',
    'Authentication',
    'Addresses',
    'Profiles',
    'IBANs',
    'Orders',
    'Tokens',
    'Classes',
    'Constants',
    'Functions',
    'Variables',
    'Methods',
    'Utils',
    'Interfaces',
    'Type Aliases',
    'Documents',
    '*',
  ],

  categoryOrder: [
    'Provider',
    'Constructors',
    'Properties',
    'Classes',
    'Functions',
    'Variables',
    'Methods',
    'Interfaces',
    'Type Aliases',
    'Hooks',
    'Documents',
    '*',
    'Authorize',
    'Accounts',
    'Profiles',
    'Orders',
    'Tokens',
    'Other',
  ],
};
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
  projectName: 'js-monerium', // Usually your repo name.
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        ...typedocConfig,
        id: '@monerium/sdk',
        entryPoints: ['../../packages/sdk/src/index.ts'],
        tsconfig: '../../packages/sdk/tsconfig.json',
        out: 'docs/packages/sdk',
        publicPath: '/docs/packages/sdk',
        watch: process.env.TYPEDOC_WATCH,
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
        publicPath: '/docs/packages/sdk-react-provider',
        watch: process.env.TYPEDOC_WATCH,
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
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
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
