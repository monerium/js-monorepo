// typedoc.config.js

// @ts-check
/**
 * @type {import('typedoc').TypeDocOptions}
 * @see https://typedoc-plugin-markdown.org/schema.json
 */
module.exports = {
  $schema: 'https://typedoc.org/schema.json',
  gitRevision: 'main',
  plugin: ['typedoc-plugin-markdown'],

  tsconfig: 'tsconfig.json',
  entryFileName: 'index',
  excludePrivate: true,
  name: 'SDK',
  out: '../../apps/docs/docs/SDK',
  readme: 'none',
  // githubPages: true,
  // includeVersion: true,
  cleanOutputDir: true,
  // searchInComments: true,
  // entryPoints: [
  //   'src/client.ts',
  //   'src/types.ts',
  //   'src/utils.ts',
  //   'src/constants.ts',
  // ],
  entryPoints: ['src/index.ts'],
  kindSortOrder: [
    'Class',
    'Property',
    'Variable',
    'Function',
    'Interface',
    'TypeAlias',
    'Enum',
    'EnumMember',
  ],
  groupOrder: [
    'Constructors',
    'Properties',
    'Classes',
    'Constants',
    'Variables',
    'Functions',
    'Methods',
    'Utils',
    'Interfaces',
    'Type Aliases',
    '*',
  ],
  categorizeByGroup: true,
  categoryOrder: [
    'Constructors',
    'Properties',
    'Classes',
    'Variables',
    'Functions',
    'Methods',
    'Interfaces',
    'Type Aliases',
    '*',
    'Authorize',
    'Accounts',
    'Profiles',
    'Orders',
    'Tokens',
    'Other',
  ],
  // titleLink: 'https://www.npmjs.com/package/@monerium/sdk',

  // navigationLinks: {
  //   'monerium.com': 'https://monerium.com/',
  //   'monerium.app': 'https://monerium.app/',
  // },
  // sidebarLinks: {
  //   NPM: 'https://www.npmjs.com/package/@monerium/sdk',
  //   Issues: 'https://github.com/monerium/js-monorepo/issues',
  //   'Source code':
  //     'https://github.com/monerium/js-monorepo/tree/main/packages/sdk',
  //   'Developer portal': 'https://monerium.dev/',
  //   'API documentation': 'https://monerium.dev/api-docs',
  //   '': '',
  // },
  // entryPointStrategy: 'expand',
};
