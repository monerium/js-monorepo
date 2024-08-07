// typedoc.config.js

// @ts-check
/**
 * @type {import('typedoc').TypeDocOptions}
 * @see https://typedoc-plugin-markdown.org/schema.json
 */
module.exports = {
  $schema: 'https://typedoc-plugin-markdown.org/schema.json',
  gitRevision: 'main',
  plugin: ['typedoc-plugin-markdown'],

  // See: apps/docs/docusaurus.config.js

  entryPoints: ['src/index.ts'],

  tsconfig: 'tsconfig.json',
  entryFileName: 'index',
  name: 'SDK React Provider',
  // sortEntryPoints: true,
  // mergeReadme: true,
  readme: 'none',

  cleanOutputDir: true,
  excludePrivate: true,

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
<<<<<<< HEAD
=======

>>>>>>> 02f7ec5 (chore: decent condition)
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
