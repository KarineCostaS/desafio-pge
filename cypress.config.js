const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      baseUrl: 'http://testeqa.pge.ce.gov.br',
      cpf: '02942069490',
      cpf_protestado: '12345678900',
      token: ''
    }
  },
  screenshotOnRunFailure: true, // padrão true
  screenshotsFolder: 'cypress/screenshots',
  video: true, // padrão true
  videosFolder: 'cypress/videos',
  
});
