/// <reference types="cypress" />

describe('🚗 ViewVehicle E2E', () => {
  const vehicleUrl = '**/api/vehicle'

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.window().then(win => win.localStorage.setItem('token', 'token123'))
  })

  it('muestra loader inicialmente', () => {
  cy.intercept('GET', vehicleUrl, {
    statusCode: 200,
    body: { vehicle: null },       // lo que quieras devolver luego
    delayMs: 2000                  // 2 segundos de retraso
  }).as('delayedRequest');

  cy.visit('/view-vehicle');

  // Ahora el loader se renderiza antes de la respuesta
  cy.contains('Cargando la información del vehículo...')
    .should('be.visible');
  })

  it('redirige a /trip-list si fetch lanza error', () => {
    cy.intercept('GET', vehicleUrl, { forceNetworkError: true }).as('errorReq')
    cy.visit('/view-vehicle')

    cy.url({ timeout: 5000 }).should('include', '/trip-list')
  })

  it('redirige a /trip-list si response.ok es false', () => {
    cy.intercept('GET', vehicleUrl, {
      statusCode: 500,
      body: 'Server error',
    }).as('badResponse')

    cy.visit('/view-vehicle')
    cy.url({ timeout: 5000 }).should('include', '/trip-list')
  })

  it('muestra mensaje si no hay vehículo en data', () => {
    cy.intercept('GET', vehicleUrl, {
      statusCode: 200,
      body: { vehicle: null },
    }).as('noVehicle')

    cy.visit('/view-vehicle')
    cy.contains('No se encontró información del vehículo.').should('be.visible')
  })

  it('renderiza datos del vehículo y permite navegación', () => {
    const vehicle = {
      picture: 'http://img/veh.png',
      carPlate: 'XYZ123',
      capacity: 4,
      brand: 'BrandX',
      model: 'ModelY',
      soat: 'http://img/soat.png'
    }

    cy.intercept('GET', vehicleUrl, {
      statusCode: 200,
      body: { vehicle },
    }).as('getVehicle')

    cy.visit('/view-vehicle')
    cy.wait('@getVehicle')

    // Verifica contenido
    cy.contains('Vehículo Registrado').should('be.visible')
    cy.get('img[alt="Vehículo"]').should('have.attr', 'src', vehicle.picture)
    cy.get('img[alt="SOAT"]').should('have.attr', 'src', vehicle.soat)

    // Verifica inputs
    cy.get('input').eq(0).should('have.value', 'XYZ123') // Placa
    cy.get('input').eq(1).should('have.value', '4')      // Capacidad
    cy.get('input').eq(2).should('have.value', 'BrandX') // Marca
    cy.get('input').eq(3).should('have.value', 'ModelY') // Modelo



    // Botones
    cy.contains('Volver').click()
    cy.url().should('include', '/manage-trips')

    // Regresamos para probar botón "Editar"
    cy.visit('/view-vehicle')
    cy.wait('@getVehicle')
    cy.contains('Editar Vehículo').click()
    cy.url().should('include', '/edit-vehicle')
  })
})
