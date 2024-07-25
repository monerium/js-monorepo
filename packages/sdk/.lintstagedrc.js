module.exports = {
  '*.{ts,tsx}': ['prettier --write', 'pnpm lint'],
  '*.{js,json}': ['prettier --write'],
  '*.{css,scss,sass}': ['pnpm lint:style'],
};
