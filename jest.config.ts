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
  }
};

export default config;
