/// <reference types="cypress" />

describe('🔐 Login E2E', () => {
  beforeEach(() => {
    cy.visit('/login') // Asegúrate de que tu ruta sea /login
  })

  it('renderiza campos y botón de envío', () => {
    cy.get('input[placeholder*="Correo"]').should('exist')
    cy.get('input[placeholder*="Contraseña"]').should('exist')
    cy.contains('Iniciar Sesión').should('exist')
  })

  it('muestra mensaje de error si se envía vacío', () => {
    cy.contains('Iniciar Sesión').click()

    cy.contains(/Por favor completa ambos campos/i)
      .should('be.visible')
  })
})
