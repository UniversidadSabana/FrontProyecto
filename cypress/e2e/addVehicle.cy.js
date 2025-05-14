/// <reference types="cypress" />

import 'cypress-file-upload'

describe('🚗 AddVehicle E2E', () => {
  const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dfcprvapn/image/upload'
  const postVehicleUrl = '**/api/vehicle'
  const fakeToken = (() => {
    const payload = btoa(JSON.stringify({ id: '123' }))
    return `x.${payload}.x`
  })()

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.window().then(win => win.localStorage.setItem('token', fakeToken))
  })

  it('flujo exitoso: sube imágenes, envía y redirige', () => {
    let uploadCount = 0

    // Stub dinámico de Cloudinary
    cy.intercept('POST', cloudinaryUrl, req => {
      uploadCount++
      if (uploadCount === 1) {
        // primera llamada → foto vehículo
        req.reply({ statusCode: 200, body: { secure_url: 'url-veh' } })
      } else {
        // segunda llamada → foto SOAT
        req.reply({ statusCode: 200, body: { secure_url: 'url-soat' } })
      }
    }).as('uploadImage')

    // Stub del POST final
    cy.intercept('POST', postVehicleUrl, { statusCode: 200, body: {} }).as('createVeh')

    cy.visit('/add-vehicle')

    // Rellenar campos
    cy.get('input[placeholder="Placa"]').type('ABC123')
    cy.get('input[placeholder="Marca"]').type('Brand')
    cy.get('input[placeholder="Modelo"]').type('Model')
    cy.get('input[placeholder="Color"]').type('Blue')
    cy.get('input#capacity').clear().type('4')

    // Subir foto de vehículo
    cy.get('input[type="file"]#vehicleImage').attachFile('veh.png')
    cy.wait('@uploadImage')
    cy.get('img[alt="Vehicle"]').should('have.attr', 'src', 'url-veh')

    // Subir foto de SOAT
    cy.get('input[type="file"]#soatImage').attachFile('soat.png')
    cy.wait('@uploadImage')
    cy.get('img[alt="SOAT"]').should('have.attr', 'src', 'url-soat')

    // Enviar formulario
    cy.contains('Guardar Vehículo').click()
    cy.wait('@createVeh')

    // Verificar SweetAlert2 de éxito
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-title').should('have.text', 'Vehículo agregado exitosamente')

    // Esperar cierre automático y redirección
    cy.wait(2100)
    cy.url().should('include', '/trip-list')
  })

  it('error del servidor al POST muestra alerta de error', () => {
    let uploadCount = 0

    // Mismo stub para Cloudinary
    cy.intercept('POST', cloudinaryUrl, req => {
      uploadCount++
      req.reply({ statusCode: 200, body: { secure_url: uploadCount === 1 ? 'url-veh' : 'url-soat' } })
    }).as('uploadImage')

    // Stub del POST que falla
    cy.intercept('POST', postVehicleUrl, {
      statusCode: 400,
      body: { error: 'fail' },
    }).as('failVeh')

    cy.visit('/add-vehicle')

    // Subir fotos
    cy.get('input[type="file"]#vehicleImage').attachFile('veh.png')
    cy.wait('@uploadImage')
    cy.get('img[alt="Vehicle"]').should('exist')

    cy.get('input[type="file"]#soatImage').attachFile('soat.png')
    cy.wait('@uploadImage')
    cy.get('img[alt="SOAT"]').should('exist')

    // Rellenar campos
    cy.get('input[placeholder="Placa"]').type('ABC123')
    cy.get('input[placeholder="Marca"]').type('Brand')
    cy.get('input[placeholder="Modelo"]').type('Model')
    cy.get('input[placeholder="Color"]').type('Blue')
    cy.get('input#capacity').clear().type('4')

    // Enviar formulario
    cy.contains('Guardar Vehículo').click()
    cy.wait('@failVeh')

    // Verificar SweetAlert2 de error
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-title').should('have.text', 'Error')
    cy.get('.swal2-html-container').should('contain.text', 'fail')
  })
})
