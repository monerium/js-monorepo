// Prettier configuration
// https://prettier.io/docs/en/configuration.html
module.exports = {
  printWidth: 80,
  singleQuote: true,
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  singleAttributePerLine: false,
  bracketSameLine: false,
  jsxSingleQuote: false,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  embeddedLanguageFormatting: 'auto',
  overrides: [
    {
      files: ['*.yaml', '*.yml'],
      options: {
        singleQuote: true,
      },
    },
    {
      files: ['*.mdx'],
      options: {
        proseWrap: 'preserve',
        embeddedLanguageFormatting: 'off',
      },
    },
  ],
};
