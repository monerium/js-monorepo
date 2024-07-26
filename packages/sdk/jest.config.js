/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {},
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs', 'ts'],
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/*.test.ts', '**/*.test.mjs'],
};
