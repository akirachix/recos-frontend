module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      tsconfig: 'tsconfig.test.json',
      transpilation: true, 
    }],
  },
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
  globals: {
    IS_REACT_ACT_ENVIRONMENT: true,
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@testing-library/react)/)"
  ],
};