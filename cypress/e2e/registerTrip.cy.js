/// <reference types="cypress" />

describe('🚌 RegisterTrip E2E', () => {
  const postUrl = '**/api/trip'

  beforeEach(() => {
    // Limpia y agrega token
    cy.clearLocalStorage()
    cy.window().then(win => win.localStorage.setItem('token', 'token123'))
  })

  it('redirige a /login si no hay token al cargar', () => {
    cy.clearLocalStorage()
    cy.visit('/register-trip')
    cy.url().should('include', '/login')
  })

  it('renderiza título y botones', () => {
    cy.visit('/register-trip')
    cy.contains('Registrar un viaje').should('be.visible')
    cy.contains('Registrar Viaje').should('be.visible')
    cy.contains('Volver').should('be.visible')
  })

  it('mostrar error y redirige si se intenta registrar sin token', () => {
  cy.clearLocalStorage()
  cy.visit('/register-trip')

  // Esperamos que redirija
  cy.url().should('include', '/login')

  // Y que no aparezca el botón
  cy.contains('Registrar Viaje').should('not.exist')
})


  it('registro exitoso con POST 201', () => {
  const successMsg = 'Viaje creado correctamente'

  cy.intercept('POST', postUrl, {
    statusCode: 201,
    body: { message: successMsg },
  }).as('createTrip')

  cy.visit('/register-trip')

  const fill = (label, value) => {
    cy.contains(label).closest('div').find('input').type('{selectall}').type(value)
  }

  fill('Punto de inicio', 'A')
  fill('Punto Final', 'B')

  // seleccionar en vez de type
  cy.contains('Ruta').closest('div').find('select').select('Boyaca')

  cy.get('input[type="time"]').type('12:34')
  fill('Puestos disponibles', '5')
  fill('Tarifa por pasajero', '9.5')

  cy.contains('Registrar Viaje').click()
  cy.wait('@createTrip')

  cy.get('.swal2-popup').should('be.visible')
  cy.get('.swal2-title').should('have.text', 'Éxito')
  cy.get('.swal2-html-container').should('contain.text', successMsg)

  cy.url().should('include', '/manage-trips')
})

  it('registro fallido (400) muestra mensaje del backend', () => {
    cy.intercept('POST', postUrl, {
      statusCode: 400,
      body: { message: 'Bad Request' },
    }).as('failTrip')

    cy.visit('/register-trip')
    cy.contains('Registrar Viaje').click()

    cy.wait('@failTrip')

    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-title').should('have.text', 'Error')
    cy.get('.swal2-html-container').should('contain.text', 'Bad Request')
  })

  it('error de red muestra alerta genérica', () => {
    cy.intercept('POST', postUrl, req => req.destroy()).as('networkFail')

    cy.visit('/register-trip')
    cy.contains('Registrar Viaje').click()

    cy.wait('@networkFail', { timeout: 10000 })

    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-title').should('have.text', 'Error')
    cy.get('.swal2-html-container')
      .should('contain.text', 'Ocurrió un error al intentar registrar el viaje')
  })
})
