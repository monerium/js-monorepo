// typedoc.config.js

// @ts-check
/**
 * @type {import('typedoc').TypeDocOptions}
 * @see https://typedoc-plugin-markdown.org/schema.json
 */
module.exports = {
  $schema: 'https://typedoc-plugin-markdown.org/schema.json',

  // See: apps/docs/docusaurus.config.js
  out: '../../apps/docs/docs/SDK',

  /**
   * # Debugging
   * When running `turbo generate-docs` the entryPointStrategy is used,
   * which does not support watch. If you need instant feedback while
   * writing documentation, run `pnpm typedoc --watch` in that packages directory.
   * This will create a `docs` folder in that packages directory that you can view.
   */

  gitRevision: 'main',
  plugin: ['typedoc-plugin-markdown'],

  name: 'SDK',
  entryFileName: 'index',
  entryPoints: ['src/index.ts'],
  tsconfig: 'tsconfig.json',

  excludePrivate: true,

  readme: 'none',

  cleanOutputDir: true,

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
};
