// cypress.config.cjs
const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',
    supportFile: 'cypress/support/e2e.js',

    setupNodeEvents(on, config) {
      // registra el plugin Allure antes de retornar config
      allureWriter(on, config);
      return config;
    },

    // habilita Allure en tiempo de ejecución
    env: {
      allure: true,
      allureResultsPath: 'allure-results'
    }
  },
});
