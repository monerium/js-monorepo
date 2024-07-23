/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  moduleNameMapper: {
    '^@monerium/sdk$': '<rootDir>/../sdk/dist',
  },
  setupFiles: ['./jest.polyfills.js'],
};
