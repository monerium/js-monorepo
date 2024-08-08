// typedoc.config.js

// @ts-check
/**
 * @type {import('typedoc').TypeDocOptions}
 * @see https://typedoc-plugin-markdown.org/schema.json
 */
module.exports = {
  $schema: 'https://typedoc-plugin-markdown.org/schema.json',
  plugin: ['typedoc-plugin-markdown'],
  entryPointStrategy: 'Packages',
  entryPoints: ['../../packages/sdk/', '../../packages/sdk-react-provider/'],
  gitRevision: 'main',
  fileExtension: '.mdx',
  entryFileName: 'index',
  entryModule: 'index',
  modulesFileName: 'packages',
  out: 'docs/pages/packages',
  cleanOutputDir: true,
  packageOptions: {
    entryFileName: 'README',
  },
  // mergeReadme: true,
  // publicPath: '/docs/',
  // watch: process.env.TYPEDOC_WATCH,
  readme: 'none',
};
