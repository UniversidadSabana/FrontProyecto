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
    coverageDirectory: 'coverage',
    reporters: [
    'default',
    'jest-allure'
  ], 

  // Opciones para Allure: carpeta de salida de resultados
  reporterOptions: {
    allureResults: './allure-results'
  } 
}
  