/// <reference types="cypress" />

describe('📅 MyReservations E2E', () => {
  const reservationsUrl = '**/api/my-reservations'
  const deleteUrl       = '**/api/trip/reserve/*'
  const updateUrl       = '**/api/trip/reserve/*'

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.window().then(win => win.localStorage.setItem('token', 'fake-token'))
  })

  it('1) muestra mensaje si no hay reservas', () => {
    cy.intercept('GET', reservationsUrl, {
      statusCode: 200,
      body: { reservations: [] },
    }).as('getEmpty')

    cy.visit('/my-reservations')
    cy.wait('@getEmpty')
    cy.contains('No tienes reservas').should('be.visible')
  })

  it('2) renderiza reservas tras fetch', () => {
    const mock = [{
      tripId: 'abc',
      initialPoint: 'Origen',
      finalPoint: 'Destino',
      route: 'Autonorte',
      seatsReserved: 2,
      price: 50,
    }]

    cy.intercept('GET', reservationsUrl, {
      statusCode: 200,
      body: { reservations: mock },
    }).as('getReservations')

    cy.visit('/my-reservations')
    cy.wait('@getReservations')

    cy.contains('Inicio:').should('exist')
    cy.contains('Origen').should('exist')
    cy.contains('Destino').should('exist')
    cy.contains('Autonorte').should('exist')
    cy.contains('Cupos: 2').should('exist')
    cy.contains('Tarifa: 50').should('exist')
  })

  it('3) handleModify abre modal con datos correctos', () => {
    const reservation = {
      tripId: 'xyz',
      initialPoint: 'A',
      finalPoint: 'B',
      route: 'Novena',
      seatsReserved: 3,
      price: 75,
      stops: ['s1', 's2', 's3'],
    }

    cy.intercept('GET', reservationsUrl, {
      statusCode: 200,
      body: { reservations: [reservation] },
    }).as('getOne')

    cy.visit('/my-reservations')
    cy.wait('@getOne')

    cy.contains('Editar').click()
    cy.contains('Editar Viaje').should('be.visible')
    cy.get('input[type="number"]').should('have.value', '3')
    cy.get('select').should('have.length', 3)
  })

  it('4) handleCloseModal cierra el modal', () => {
    const reservation = {
      tripId: 'xyz',
      initialPoint: 'A',
      finalPoint: 'B',
      route: 'Novena',
      seatsReserved: 2,
      price: 75,
      stops: ['s1', 's2'],
    }

    cy.intercept('GET', reservationsUrl, {
      statusCode: 200,
      body: { reservations: [reservation] },
    }).as('getOne')

    cy.visit('/my-reservations')
    cy.wait('@getOne')

    cy.contains('Editar').click()
    cy.contains('Volver').click()
    cy.contains('Editar Viaje').should('not.exist')
  })

  it('5) handleSaveChanges edita y cierra modal correctamente', () => {
    const reservation = {
      tripId: '123',
      initialPoint: 'A',
      finalPoint: 'B',
      route: 'Novena',
      seatsReserved: 2,
      price: 75,
      stops: ['s1', 's2'],
    }

    cy.intercept('GET', reservationsUrl, {
      statusCode: 200,
      body: { reservations: [reservation] },
    }).as('getOne')

    cy.intercept('PUT', updateUrl, {
      statusCode: 200,
      body: { message: 'Actualizado', seatsRemaining: 5 },
    }).as('putReservation')

    cy.visit('/my-reservations')
    cy.wait('@getOne')

    cy.contains('Editar').click()
    cy.get('input[type="number"]').clear().type('4')
    cy.contains('Guardar Cambios').click()
    cy.wait('@putReservation')

    cy.contains('Editar Viaje').should('not.exist')
  })

  it('6) handleDelete cancela reserva y la elimina de la lista', () => {
    const reservation = {
      tripId: 'del1',
      initialPoint: 'X',
      finalPoint: 'Y',
      route: 'Suba',
      seatsReserved: 1,
      price: 20,
    }

    cy.intercept('GET', reservationsUrl, {
      statusCode: 200,
      body: { reservations: [reservation] },
    }).as('getDelete')

    cy.intercept('DELETE', deleteUrl, {
      statusCode: 200,
      body: { seatsRemaining: 10 },
    }).as('deleteReservation')

    cy.visit('/my-reservations')
    cy.wait('@getDelete')

    // Abrir confirm dialog
    cy.contains('Eliminar').click()
    // Confirmar en SweetAlert2
    cy.get('.swal2-confirm').should('be.visible').click()

    cy.wait('@deleteReservation')
    cy.contains('No tienes reservas').should('be.visible')
  })
})
