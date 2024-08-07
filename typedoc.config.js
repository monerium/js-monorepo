/** @type {import('typedoc').TypeDocOptions} */

// https://typedoc.org/options/

module.exports = {
  $schema: 'https://typedoc-plugin-markdown.org/schema.json',
  entryPoints: ['packages/sdk', 'packages/sdk-react-provider'],
  plugin: ['typedoc-plugin-markdown'],
  name: 'Monerium Packages',
  out: 'apps/docs/docs',
  entryPointStrategy: 'packages',
  readme: 'none',
  entryFileName: 'Packages',
  includeVersion: false,
  packageOptions: {
    includeVersion: true,
  },
};
