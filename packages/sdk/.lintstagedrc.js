export default {
  '*.{ts,tsx}': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    `eslint --fix --cache ${filenames.join(' ')}`,
  ],
  '*.{js,json}': ['prettier --write'],
  '*.{css,scss,sass}': ['pnpm lint:style'],
};
