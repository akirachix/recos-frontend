const nextJest = require('next/jest');
const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  preset: 'ts-jest', 
  testEnvironment: 'jest-environment-jsdom', 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg|mp4)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.+)': '<rootDir>/src/$1', 
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      tsconfig: 'tsconfig.test.json',
      transpileOnly: true, 
    }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@testing-library/react)/)"
  ],
  testTimeout: 10000,
  globals: {
    IS_REACT_ACT_ENVIRONMENT: true,
  },
};

module.exports = createJestConfig(customJestConfig);
