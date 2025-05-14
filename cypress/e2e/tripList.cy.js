/// <reference types="cypress" />

describe('🚌 TripList E2E', () => {
  const apiBase = 'https://wheels-backend-rafaelsavas-projects.vercel.app';

  beforeEach(() => {
    // Prevenir que errores de la app rompan el test
    Cypress.on('uncaught:exception', () => false);
    cy.clearLocalStorage();
  });

  it('1) Redirige a /login si no hay token', () => {
    cy.visit('/trip-list');
    cy.url().should('include', '/login');
  });

  it('2) Muestra loader mientras carga los viajes', () => {
    cy.intercept('GET', `${apiBase}/api/trips`, {
      delay: 1000,
      statusCode: 200,
      body: { trips: [] }
    }).as('getTripsDelayed');

    cy.visit('/trip-list', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
      }
    });

    cy.get('.loader').should('exist');
    cy.wait('@getTripsDelayed');
    cy.get('.loader').should('not.exist');
    cy.contains('No hay viajes disponibles').should('exist');
  });

  it('3) Redirige a /login si la API de trips devuelve 401', () => {
    cy.intercept('GET', `${apiBase}/api/trips`, {
      statusCode: 401,
      body: {}
    }).as('getTrips401');

    cy.visit('/trip-list', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
      }
    });

    cy.wait('@getTrips401');
    cy.url().should('include', '/login');
  });

  it('6) Al activar “Modo Conductor” navega a /manage-trips', () => {
    cy.intercept('GET', `${apiBase}/api/trips`, {
      statusCode: 200,
      body: { trips: [] }
    }).as('getTrips');

    cy.visit('/trip-list', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
      }
    });

    cy.wait('@getTrips');
    cy.get('.loader').should('not.exist');

    // Activar modo conductor haciendo click en el label
    cy.contains('Modo Conductor').click();
    cy.url().should('include', '/manage-trips');
  });
});
