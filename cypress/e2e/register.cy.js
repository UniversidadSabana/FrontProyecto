/// <reference types="cypress" />

describe('📝 Register E2E', () => {
  beforeEach(() => {
    cy.visit('/register') // Asegúrate que esta sea tu ruta real
  })

  it('1) Renderiza inputs y botón', () => {
    cy.get('input[placeholder="Nombre"]').should('exist')
    cy.get('input[placeholder="Apellido"]').should('exist')
    cy.get('input[placeholder="Email Institucional"]').should('exist')
    cy.contains('Registrarse').should('exist')
  })

  it('2) Muestra error si campos vacíos', () => {
    cy.contains('Registrarse').click()
    cy.contains('Todos los campos son obligatorios').should('be.visible')
  })

    it('3) Muestra error si email inválido', () => {
    cy.get('input[placeholder="Nombre"]').type('John')
    cy.get('input[placeholder="Apellido"]').type('Doe')
    cy.get('input[placeholder="Email Institucional"]').type('no-es-correo')

    // Forzar envío porque HTML5 bloquea submit si email es inválido
    cy.get('form').then($form => $form[0].dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })))

    cy.contains('Por favor ingrese un correo válido').should('be.visible')
    })



  it('4) Flujo exitoso navega a /password', () => {
    cy.get('input[placeholder="Nombre"]').type('John')
    cy.get('input[placeholder="Apellido"]').type('Doe')
    cy.get('input[placeholder="Email Institucional"]').type('john@example.com')

    cy.contains('Registrarse').click()
    cy.url().should('include', '/password')
  })
})
