/// <reference types="cypress" />

describe('🔧 EditVehicle E2E', () => {
  const backendUrl = '**/api/vehicle'

  beforeEach(() => {
    // limpia y mockea token
    cy.clearLocalStorage()
    cy.window().then(win => win.localStorage.setItem('token', 'token'))

    // array con las dos respuestas de Cloudinary
    const cloudResponses = [
      { secure_url: 'url-veh' },
      { secure_url: 'url-soat' }
    ]
    cy.intercept('POST', '**/image/upload', (req) => {
      req.reply({ statusCode: 200, body: cloudResponses.shift() })
    }).as('uploadImage')
  })

  it('1) GET falla → redirige a /manage-trips', () => {
    cy.intercept('GET', backendUrl, { statusCode: 401 }).as('getFail')

    cy.visit('/edit-vehicle')
    cy.wait('@getFail')
    cy.url().should('include', '/manage-trips')
  })

  it('2) GET OK → inputs rellenados', () => {
    cy.intercept('GET', backendUrl, {
      statusCode: 200,
      body: {
        vehicle: {
          carPlate: 'XYZ123',
          capacity: 4,
          brand: 'TestBrand',
          model: 'TestModel',
          color: 'Rojo'
        }
      }
    }).as('getOK')

    cy.visit('/edit-vehicle')
    cy.wait('@getOK')

    cy.get('input[placeholder="Placa"]').should('have.value', 'XYZ123')
    cy.get('input[placeholder="Marca"]').should('have.value', 'TestBrand')
    cy.get('input[placeholder="Modelo"]').should('have.value', 'TestModel')
    cy.get('input[placeholder="Color"]').should('have.value', 'Rojo')

    // selector corregido para capacidad
    // 🎯 busca el input que tiene id="capacity"
    cy.get('input#capacity').should('have.value', '4')

  })

  it('3) Campos vacíos → alerta de error', () => {
    cy.intercept('GET', backendUrl, {
      statusCode: 200,
      body: { vehicle: { carPlate:'', capacity:1, brand:'', model:'', color:'' } }
    }).as('getEmpty')

    cy.visit('/edit-vehicle')
    cy.wait('@getEmpty')

    cy.contains('Guardar Vehículo').click()

    // comprobación en el DOM de SweetAlert2
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-title').should('have.text', 'Error')
    cy.get('.swal2-html-container')
      .should('contain.text', 'Todos los campos son obligatorios.')
  })

  it('4) PUT falla tras imágenes → alerta dinámica', () => {
    cy.intercept('GET', backendUrl, {
      statusCode: 200,
      body: { vehicle:{ carPlate:'AAA111', capacity:2, brand:'B', model:'M', color:'C' } }
    }).as('getOK')

    cy.intercept('PUT', backendUrl, {
      statusCode: 400,
      body:{ message:'update fail' }
    }).as('putFail')

    cy.visit('/edit-vehicle')
    cy.wait('@getOK')

    // 1ª subida  → url-veh
    cy.get('input[type="file"]').first().attachFile('veh.png')
    cy.wait('@uploadImage')
    cy.get('img[alt="Vehicle"]').should('have.attr','src','url-veh')

    // 2ª subida  → url-soat
    cy.get('input[type="file"]').eq(1).attachFile('soat.png')
    cy.wait('@uploadImage')
    cy.get('img[alt="SOAT"]').should('have.attr','src','url-soat')

    cy.contains('Guardar Vehículo').click()
    cy.wait('@putFail')

    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-title').should('have.text', 'Error')
    cy.get('.swal2-html-container')
      .should('contain.text', 'No se pudo actualizar el vehículo. update fail')
  })
})
