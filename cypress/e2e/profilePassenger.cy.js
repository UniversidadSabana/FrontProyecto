/// <reference types="cypress" />
import 'cypress-file-upload'

describe('🧑‍✈️ ProfilePassenger E2E (stub fetch + onBeforeLoad)', () => {
  const fakeToken = (() => {
    const payload = btoa(JSON.stringify({ id: '123' }))
    return `x.${payload}.x`
  })()

  beforeEach(() => {
    cy.clearLocalStorage()
    Cypress.on('uncaught:exception', () => false)
  })

  it('redirige a /login si no hay token', () => {
    cy.visit('/profile-passenger', {
      onBeforeLoad(win) {
        // No seteamos token en localStorage
      }
    })
    cy.url().should('include', '/login')
  })

  it('redirige a /login si GET devuelve 401', () => {
    cy.visit('/profile-passenger', {
      onBeforeLoad(win) {
        // Ponemos token antes de que React arranque
        win.localStorage.setItem('token', fakeToken)

        const realFetch = win.fetch.bind(win)
        win.fetch = (url, opts) => {
          if (opts.method === 'GET' && url.includes('/api/profile')) {
            return Promise.resolve({
              status: 401,
              ok: false,
              json: () => Promise.resolve({})
            })
          }
          return realFetch(url, opts)
        }
      }
    })
    cy.url().should('include', '/login')
  })

  it('carga y muestra datos tras GET exitoso', () => {
    const profileData = {
      name: 'John',
      lastName: 'Doe',
      contactNumber: '12345',
      image: 'http://img'
    }

    cy.visit('/profile-passenger', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken)
        const realFetch = win.fetch.bind(win)
        win.fetch = (url, opts) => {
          if (opts.method === 'GET' && url.includes('/api/profile')) {
            return Promise.resolve({
              status: 200,
              ok: true,
              json: () => Promise.resolve(profileData)
            })
          }
          return realFetch(url, opts)
        }
      }
    })

    cy.get('input[placeholder="Nombre"]').should('have.value', 'John')
    cy.get('input[placeholder="Apellido"]').should('have.value', 'Doe')
    cy.get('input[placeholder="Número de contacto"]').should('have.value', '12345')
    cy.get('img[alt="Profile"]').should('have.attr', 'src', 'http://img')
  })

  it('valida campos vacíos al guardar', () => {
    cy.visit('/profile-passenger', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken)
        win.fetch = () =>
          Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve({}) })
      }
    })

    cy.get('button').contains('Guardar Cambios').click()
    cy.contains('Todos los campos son obligatorios').should('be.visible')
  })

  it('valida número de contacto no numérico', () => {
    cy.visit('/profile-passenger', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken)
        win.fetch = () =>
          Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve({}) })
      }
    })

    cy.get('input[placeholder="Nombre"]').type('A')
    cy.get('input[placeholder="Apellido"]').type('B')
    cy.get('input[placeholder="Número de contacto"]').type('ABC')
    cy.get('button').contains('Guardar Cambios').click()
    cy.contains('El ID y el número de contacto deben contener solo números').should('be.visible')
  })

  it('valida número de contacto demasiado largo', () => {
    cy.visit('/profile-passenger', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken)
        win.fetch = () =>
          Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve({}) })
      }
    })

    cy.get('input[placeholder="Nombre"]').type('A')
    cy.get('input[placeholder="Apellido"]').type('B')
    cy.get('input[placeholder="Número de contacto"]').type('12345678901')
    cy.get('button').contains('Guardar Cambios').click()
    cy.contains('El número de contacto debe tener hasta 10 dígitos').should('be.visible')
  })

  it('muestra error de SweetAlert si el PUT falla', () => {
    cy.visit('/profile-passenger', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken)
        let call = 0
        win.fetch = (url, opts) => {
          call++
          if (call === 1) {
            return Promise.resolve({
              status: 200,
              ok: true,
              json: () => Promise.resolve({ name: 'X', lastName: 'Y', contactNumber: '1', image: '' })
            })
          }
          // PUT falla
          return Promise.resolve({
            status: 400,
            ok: false,
            json: () => Promise.resolve({ error: 'fail' })
          })
        }
      }
    })

    cy.get('input[placeholder="Nombre"]').clear().type('X')
    cy.get('input[placeholder="Apellido"]').clear().type('Y')
    cy.get('input[placeholder="Número de contacto"]').clear().type('1')
    cy.get('button').contains('Guardar Cambios').click()

    cy.get('.swal2-title').should('have.text', 'Error')
    cy.get('.swal2-html-container').should('contain.text', 'fail')
  })

  it('muestra éxito de SweetAlert si el PUT es ok', () => {
    cy.visit('/profile-passenger', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken)
        let call = 0
        win.fetch = (url, opts) => {
          call++
          if (call === 1) {
            return Promise.resolve({
              status: 200,
              ok: true,
              json: () => Promise.resolve({ name: 'X', lastName: 'Y', contactNumber: '1', image: '' })
            })
          }
          // PUT ok
          return Promise.resolve({
            status: 200,
            ok: true,
            json: () => Promise.resolve({})
          })
        }
      }
    })

    cy.get('input[placeholder="Nombre"]').clear().type('X')
    cy.get('input[placeholder="Apellido"]').clear().type('Y')
    cy.get('input[placeholder="Número de contacto"]').clear().type('1')
    cy.get('button').contains('Guardar Cambios').click()

    cy.get('.swal2-title').should('have.text', 'Perfil actualizado')
  })
})
