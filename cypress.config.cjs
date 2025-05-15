// cypress.config.cjs
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // URL donde arranca tu app en CI
    baseUrl: 'http://localhost:5173',

    // Busca todos los *.cy.js y *.cy.jsx en cypress/e2e
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',

    // Soporte y fixtures
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',

    // Dónde dejar capturas y vídeos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    // Reporter JUnit para GitLab
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'cypress/results/junit-[hash].xml'
    },

    setupNodeEvents(on, config) {
      // aquí puedes enganchar listeners de cobertura,
      // plugin de imagenes, etc.
      return config
    },
  },
})
