module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'json'],
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest'
    },
    setupFilesAfterEnv: [
      '<rootDir>/jest.setup.js'
    ],
    moduleNameMapper: {
      // si usas alias en vite.config.js, refléjalo aquí
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverage: true,
    coverageDirectory: 'coverage'
  }
  