import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      jest,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      globals: {
        node: true,
        jest: true,
        process: true,
        console: true,
        Buffer: true,
        __dirname: true,
        __filename: true,
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^path',
              '^react$',
              '^react-dom$',
              '^next',
              '^viem',
              '^wagmi',
              '^@rainbowkit',
              '^classnames$',
              '^\\u0000',
              '^@?\\w',
              '^@mui',
            ],
            ['^@monerium'],
            [
              '^(app|src|components|utils|services|hooks|config|types)(/.*|$)',
              '^\\.',
            ],
            ['^.+\\.(png|svg)$', '^.+\\.css$', '^.+\\.scss$'],
          ],
        },
      ],
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.turbo/',
      '*.config.js',
      '*.config.mjs',
      'coverage/',
    ],
  },
];
