import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  setupFiles: [],
  moduleDirectories: ['utils', __dirname, 'node_modules'],
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  collectCoverageFrom: ['<rootDir>/src/pages/**/*.ts?(x)'],
  coverageDirectory: 'reports',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^test-utils$': ['<rootDir>/src/utils/test-utils.tsx'],
    '^@pages(.*)$': ['<rootDir>/src/pages$1'],
    '^@hooks(.*)$': ['<rootDir>/src/hooks$1'],
    '^@global(.*)$': ['<rootDir>/src/global$1'],
    '^@blockchain(.*)$': ['<rootDir>/src/blockchain$1'],
    '^@utils(.*)$': ['<rootDir>/src/utils$1'],
    '^@assets(.*)$': ['<rootDir>/src/assets$1']
  }
};

export default config;
