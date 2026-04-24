module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'app/index.jsx',
    'app/(tabs)/Home.jsx'
  ],
  coverageReporters: ['lcov', 'html', 'text']
};
