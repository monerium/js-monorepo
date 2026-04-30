import { TypeDocOptions } from 'typedoc';
import { PluginOptions } from 'typedoc-plugin-markdown';

const typedocConfig: PluginOptions | Partial<TypeDocOptions> = {
  // not working properly when cross-referencing between packages
  disableSources: true,

  cleanOutputDir: true,
  entryPointStrategy: 'Expand',
  gitRevision: 'main',

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
    'Classes',
    'Provider',
    'Hooks',
    'Constructors',
    'Properties',
    'Client',
    'Authentication',
    'Auth',
    'Profiles',
    'Addresses',
    'IBANs',
    'Orders',
    'Tokens',
    'Signatures',
    'Files',
    'Utilities',
    'Primitives',
    'Helpers',
    'Errors',
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
export default typedocConfig;
