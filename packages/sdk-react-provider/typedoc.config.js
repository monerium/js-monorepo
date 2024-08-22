// typedoc.config.js

// @ts-check
/**
 * @type {import('typedoc').TypeDocOptions}
 * @see https://typedoc-plugin-markdown.org/schema.json
 */
module.exports = {
  $schema: 'https://typedoc-plugin-markdown.org/schema.json',

  // See: apps/docs/docusaurus.config.js
  out: '../../apps/docs/docs/SDK React Provider',

  /**
   * # Debugging
   * When running `turbo generate-docs` the entryPointStrategy:'Packages' is used,
   * which does not support watch. If you need instant feedback while
   * writing documentation, run `pnpm typedoc --watch` in that packages directory.
   * This will create a `docs` folder in that packages directory that you can view.
   */

  gitRevision: 'main',
  plugin: ['typedoc-plugin-markdown'],

  name: 'SDK React Provider',
  entryFileName: 'index',
  entryPoints: ['src/index.ts'],
  tsconfig: 'tsconfig.json',

  excludePrivate: true,

  readme: 'none',

  cleanOutputDir: true,

  kindSortOrder: [
    'Class',
    'Property',
    'Function',
    'Variable',
    'Interface',
    'TypeAlias',
    'Enum',
    'EnumMember',
    'Document',
  ],
  groupOrder: [
    'Provider',
    'Hooks',
    'Constructors',
    'Properties',
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
  categorizeByGroup: true,
  categoryOrder: [
    'Provider',
    'Constructors',
    'Properties',
    'Classes',
    'Variables',
    'Functions',
    'Methods',
    'Interfaces',
    'Type Aliases',
    'Hooks',
    'Documents',
    '*',
    'Other',
  ],
  expandObjects: true,
  hideParameterTypesInTitle: true,
  expandParameters: true,

  // indexFormat: 'table',
  parametersFormat: 'table',
  typeDeclarationFormat: 'table',
  interfacePropertiesFormat: 'table',
  classPropertiesFormat: 'table',
  enumMembersFormat: 'table',
  propertyMembersFormat: 'table',

  hidePageHeader: true,
};
