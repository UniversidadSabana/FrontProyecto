/// <reference types="cypress" />

describe('🗺️ ManageTrips E2E', () => {
  const tripsUrl = '**/api/my-trips'
  const tripUpdateUrl = '**/api/trip/*' // corregido
  const tripDeleteUrl = '**/api/trip/*' // corregido

  beforeEach(() => {
    // Asegura token en localStorage
    cy.clearLocalStorage()
    cy.window().then(win => win.localStorage.setItem('token', 'token'))

    // Evita que form.submit recargue la página
    cy.on('window:before:load', win => {
      win.HTMLFormElement.prototype.submit = () => {}
    })
  })

  it('redirige a /login si no hay token', () => {
    cy.clearLocalStorage()
    cy.visit('/manage-trips')
    cy.url().should('include', '/login')
  })

  it('muestra loader mientras carga', () => {
    cy.intercept('GET', tripsUrl, req => {}).as('hangTrips')
    cy.visit('/manage-trips')
    cy.get('.loader').should('be.visible')
  })

  it('en 401 y confirma YES navega a /add-vehicle o /login', () => {
    cy.intercept('GET', tripsUrl, { statusCode: 401 }).as('get401')

    cy.visit('/manage-trips')
    cy.wait('@get401')

    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()

    cy.url().should('satisfy', (url) =>
      url.includes('/add-vehicle') || url.includes('/login')
    )
  })

  it('en 403 y cancela navega a /trip-list', () => {
    cy.intercept('GET', tripsUrl, { statusCode: 403 }).as('get403')

    cy.visit('/manage-trips')
    cy.wait('@get403')

    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-cancel').click()

    cy.url().should('include', '/trip-list')
  })

  it('renderiza viajes tras fetch exitoso', () => {
    const sample = [{
      tripId: '1', initialPoint: 'A', finalPoint: 'B',
      route: 'R1', seats: 3, reservations: 1,
      price: 10, hour: '09:00'
    }]

    cy.intercept('GET', tripsUrl, {
      statusCode: 200,
      body: { trips: sample },
    }).as('getOK')

    cy.visit('/manage-trips')
    cy.wait('@getOK')

    cy.contains('Inicio: A').should('be.visible')
    cy.contains('Fin: B').should('be.visible')
    cy.contains('Ruta: R1').should('be.visible')
    cy.contains('Cupos: 3 / Reservados: 1').should('be.visible')
    cy.contains('Tarifa: 10').should('be.visible')
    cy.contains('Editar').should('be.visible')
    cy.contains('Eliminar').should('be.visible')
  })

  it('Volver cierra el modal de edición', () => {
    const sample = [{
      tripId: '3', initialPoint: 'P', finalPoint: 'Q',
      route: 'Autonorte', seats: 2, reservations: 0,
      price: 5, hour: '08:00'
    }]

    cy.intercept('GET', tripsUrl, {
      statusCode: 200,
      body: { trips: sample },
    }).as('getOK')

    cy.visit('/manage-trips')
    cy.wait('@getOK')

    cy.contains('Editar').click()
    cy.contains('Editar Viaje').should('be.visible')
    cy.contains('Volver').click()
    cy.contains('Editar Viaje').should('not.exist')
  })

  it('handleEditSubmit guarda y actualiza la lista', () => {
    const original = {
      tripId: '4', initialPoint: 'M', finalPoint: 'N',
      route: 'Novena', seats: 4, reservations: 0,
      price: 30, hour: '12:00'
    }
    const updated = { ...original, initialPoint: 'Z' }

    cy.intercept('GET', tripsUrl, {
      statusCode: 200,
      body: { trips: [original] },
    }).as('getOrig')

    cy.intercept('PUT', tripUpdateUrl, {
      statusCode: 200,
      body: { updatedTrip: updated },
    }).as('putTrip')

    cy.visit('/manage-trips')
    cy.wait('@getOrig')

    cy.contains('Editar').click()
    cy.get('input[placeholder="Punto de inicio"]')
      .clear().type('Z')
    cy.contains('Guardar Cambios').click()

    cy.wait('@putTrip')
    cy.get('.swal2-icon-success').should('be.visible')
    cy.contains('Inicio: Z').should('be.visible')
  })

  it('handleDelete elimina un viaje de la lista', () => {
    const tripA = {
      tripId: 'A', initialPoint: 'U', finalPoint: 'V',
      route: 'Suba', seats: 1, reservations: 0,
      price: 5, hour: '07:00'
    }

    cy.intercept('GET', tripsUrl, {
      statusCode: 200,
      body: { trips: [tripA] },
    }).as('getOne')

    cy.intercept('DELETE', tripDeleteUrl, {
      statusCode: 200
    }).as('delTrip')

    cy.visit('/manage-trips')
    cy.wait('@getOne')

    cy.contains('Eliminar').click()
    cy.get('.swal2-confirm').click()
    cy.wait('@delTrip')

    cy.get('.swal2-icon-success').should('be.visible')
    cy.contains('Inicio: U').should('not.exist')
  })

  it('toggleDriverMode navega a /trip-list', () => {
   cy.intercept('GET', tripsUrl, {
     statusCode: 200,
     body: { trips: [] },
   }).as('getEmpty')

   // inyecta el token _antes_ de que React monte el componente
   cy.visit('/manage-trips', {
     onBeforeLoad(win) {
       win.localStorage.setItem('token', 'token')
     }
   })
   cy.wait('@getEmpty')

   cy.get('input[type="checkbox"]').click({ force: true })
   cy.url().should('include', '/trip-list')
 })


})
