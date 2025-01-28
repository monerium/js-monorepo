import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { TypeDocOptions } from 'typedoc';
import { PluginOptions } from 'typedoc-plugin-markdown';
import type * as Redocusaurus from 'redocusaurus';

// https://typedoc-plugin-markdown.org/schema.json
const typedocConfig: PluginOptions | Partial<TypeDocOptions> = {
  // not working properly when cross-referencing between packages
  disableSources: true,

  cleanOutputDir: true,
  entryPointStrategy: 'Expand',
  gitRevision: 'main',

  readme: 'none',

  // skipErrorChecking: true,
  expandObjects: true,
  expandParameters: true,

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
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Monerium',
      logo: {
        alt: 'Monerium Logo',
        src: 'img/logo.png',
      },
      items: [
        { to: '/docs/api', label: 'API', position: 'left' },
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
              label: 'Developer Portal',
              href: 'https://monerium.dev/',
            },
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
