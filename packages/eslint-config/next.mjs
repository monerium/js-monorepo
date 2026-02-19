import nextConfig from 'eslint-config-next';
import tseslint from 'typescript-eslint';

export default [
  ...nextConfig,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Customize rules here
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/no-anonymous-default-export': 'warn',
      'react/display-name': 'error',
    },
  },
  {
    ignores: [
      '.next/',
      'node_modules/',
      '.turbo/',
      'dist/',
      '*.config.js',
      '*.config.mjs',
      '.postcssrc.js',
      '.lintstagedrc.js',
      'jest.*.js',
      'test/**/*.test.{ts,tsx,mjs,js}',
      '**/*.test.{ts,tsx,mjs,js}',
      'coverage/',
    ],
  },
];
