/// <reference types="cypress" />

describe('📋 TripDetails E2E', () => {
  const apiBase = 'https://wheels-backend-rafaelsavas-projects.vercel.app';

  beforeEach(() => {
    // Ignorar excepciones de la app
    Cypress.on('uncaught:exception', () => false);
    cy.clearLocalStorage();
  });

  it('1) muestra loader inicialmente', () => {
    // Simulamos un GET que tarda para ver el loader
    cy.intercept('GET', `${apiBase}/api/trip/123`, {
      delay: 5000,
      statusCode: 200,
      body: {}
    }).as('getTripDelayed');

    cy.visit('/trip-details/123', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'dummy-token');
      }
    });

    cy.get('.loader').should('exist');
  });

  it('2) sin token redirige a /login', () => {
    cy.visit('/trip-details/123');
    cy.url().should('include', '/login');
  });

  it('3) error HTTP en fetch muestra mensaje', () => {
    cy.intercept('GET', `${apiBase}/api/trip/123`, {
      statusCode: 500,
      body: {}
    }).as('getTripError');

    cy.visit('/trip-details/123', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'dummy-token');
      }
    });

    cy.wait('@getTripError');
    cy.contains('Error: Error HTTP: 500').should('exist');
  });

  it('4) muestra detalles del viaje tras fetch exitoso', () => {
    const tripData = {
      carPicture: 'pic.jpg',
      initialPoint: 'Calle 82',
      finalPoint: 'Calle 100',
      hour: '10:00',
      seatsAvailable: 3,
      price: '$10',
      carPlate: 'abc123',
      route: 'Autonorte'
    };

    cy.intercept('GET', `${apiBase}/api/trip/123`, {
      statusCode: 200,
      body: tripData
    }).as('getTrip');

    cy.visit('/trip-details/123', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'dummy-token');
      }
    });

    cy.wait('@getTrip');
    cy.contains(/Calle 82.*→.*Calle 100/).should('exist');
    cy.contains('Salida: 10:00').should('exist');
    cy.contains('3 cupos disponibles').should('exist');
    cy.contains('$10').should('exist');
    cy.contains(/Placa: ABC123/).should('exist');
    cy.contains('Ruta: Autonorte').should('exist');
  });

  it('5) cambiar número de cupos actualiza selects', () => {
    const tripData = {
      carPicture: 'pic.jpg',
      initialPoint: 'Calle 82',
      finalPoint: 'Calle 100',
      hour: '10:00',
      seatsAvailable: 3,
      price: '$10',
      carPlate: 'abc123',
      route: 'Autonorte'
    };

    cy.intercept('GET', `${apiBase}/api/trip/123`, {
      statusCode: 200,
      body: tripData
    }).as('getTrip');

    cy.visit('/trip-details/123', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'dummy-token');
      }
    });

    cy.wait('@getTrip');
    cy.get('select').should('have.length', 2);
    cy.get('select').first().select('2');
    cy.get('select').should('have.length', 3);
  });

  it('6) reserva exitosa muestra modal y navega a /trip-list', () => {
    const tripData = {
      carPicture: 'pic.jpg',
      initialPoint: 'Calle 82',
      finalPoint: 'Calle 100',
      hour: '10:00',
      seatsAvailable: 3,
      price: '$10',
      carPlate: 'abc123',
      route: 'Autonorte'
    };
    const reservationResult = { message: 'Hecho', seatsRemaining: 2 };

    // Stub GET trip
    cy.intercept('GET', `${apiBase}/api/trip/123`, {
      statusCode: 200,
      body: tripData
    }).as('getTrip');

    // Stub POST reserve at correct path
    cy.intercept('POST', `${apiBase}/api/trip/reserve/123`, {
      statusCode: 200,
      body: reservationResult
    }).as('postReserve');

    cy.visit('/trip-details/123', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'dummy-token');
      }
    });

    cy.wait('@getTrip');
    cy.contains('Reservar Cupo(s)').click();
    cy.wait('@postReserve');

    cy.get('.swal2-popup .swal2-title').should('have.text', 'Reserva exitosa');
    cy.get('.swal2-html-container').should('contain.text', 'Hecho. Cupos restantes: 2');
    cy.get('.swal2-confirm').click();

    cy.url().should('include', '/trip-list');
  });

  it('7) reserva falla muestra mensaje de error inline', () => {
    const tripData = {
      carPicture: 'pic.jpg',
      initialPoint: 'Calle 82',
      finalPoint: 'Calle 100',
      hour: '10:00',
      seatsAvailable: 3,
      price: '$10',
      carPlate: 'abc123',
      route: 'Autonorte'
    };

    // Stub GET trip
    cy.intercept('GET', `${apiBase}/api/trip/123`, {
      statusCode: 200,
      body: tripData
    }).as('getTrip');

    // Stub POST reserve fail
    cy.intercept('POST', `${apiBase}/api/trip/reserve/123`, {
      statusCode: 400,
      body: { error: 'fail' }
    }).as('postReserveFail');

    cy.visit('/trip-details/123', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'dummy-token');
      }
    });

    cy.wait('@getTrip');
    cy.contains('Reservar Cupo(s)').click();
    cy.wait('@postReserveFail');
    cy.contains('Error: fail').should('exist');
    cy.url().should('include', '/trip-details/123');
  });
});