/** @type {import('jest').Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.jest.json' },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/generated/**',
    '!src/main/server.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
  coverageThreshold: {
    global: {
      statements: 20,
      branches: 15,
      functions: 20,
      lines: 20,
    },
  },
  cacheDirectory: '<rootDir>/.jest-cache',
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'html', 'lcov'],
};
