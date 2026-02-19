module.exports = {
  '*.{ts,tsx}': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    // Run ESLint on each file separately to avoid memory/timeout issues
    ...filenames.map((filename) => `eslint --fix --cache '${filename}'`),
  ],
  '*.{js,json,md}': ['prettier --write'],
  '*.{css,scss,sass}': ['pnpm lint:style'],
};
