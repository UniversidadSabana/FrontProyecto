// src/components/driver/__tests__/RegisterTrip.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterTrip from '../RegisterTrip'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

// 1) Stub para evitar "Not implemented: HTMLFormElement.prototype.submit"
beforeAll(() => {
  window.HTMLFormElement.prototype.submit = jest.fn()
})

// 2) Mocks
jest.mock('../../reusable/CustomButton', () => ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
))
jest.mock('sweetalert2', () => ({ fire: jest.fn() }))
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

describe('RegisterTrip component', () => {
  let navigateMock

  beforeEach(() => {
    jest.clearAllMocks()
    navigateMock = jest.fn()
    useNavigate.mockReturnValue(navigateMock)
  })

  test('smoke: renderiza título y botones', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    render(<RegisterTrip />)
    expect(screen.getByText('Registrar un viaje')).toBeInTheDocument()
    expect(screen.getByText('Registrar Viaje')).toBeInTheDocument()
    expect(screen.getByText('Volver')).toBeInTheDocument()
  })

  test('redirige a /login si no hay token al montar', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    render(<RegisterTrip />)
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  test('al pulsar "Registrar Viaje" sin token muestra error y navega a login', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    render(<RegisterTrip />)
    fireEvent.click(screen.getByText('Registrar Viaje'))
    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'No estás autenticado. Por favor inicia sesión.',
      'error'
    )
    expect(navigateMock).toHaveBeenCalledWith('/login')
  })

  test('registro exitoso llama a fetch, muestra éxito y va a /manage-trips', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('my-token')

    // 3) Mock exitoso de POST
    const successMessage = 'Viaje creado correctamente'
    global.fetch = jest.fn().mockResolvedValue({
      status: 201,
      json: async () => ({ message: successMessage })
    })

    render(<RegisterTrip />)

    // 4) Localizar inputs junto a su label  
    const getInput = (labelText) => {
      const labelDiv = screen.getByText(labelText).closest('div')
      return labelDiv.querySelector('input, select')
    }

    fireEvent.change(getInput('Punto de inicio'),         { target: { value: 'A' } })
    fireEvent.change(getInput('Punto Final'),            { target: { value: 'B' } })
    fireEvent.change(getInput('Ruta'),                   { target: { value: 'Boyaca' } })
    fireEvent.change(getInput('Hora de salida'),         { target: { value: '12:34' } })
    fireEvent.change(getInput('Puestos disponibles'),    { target: { value: '5' } })
    fireEvent.change(getInput('Tarifa por pasajero'),    { target: { value: '9.5' } })

    fireEvent.click(screen.getByText('Registrar Viaje'))

    await waitFor(() => {
      // Comprueba que fetch se llamó con el body correcto
      expect(global.fetch).toHaveBeenCalledWith(
        'https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer my-token'
          }),
          body: JSON.stringify({
            initialPoint: 'A',
            finalPoint: 'B',
            route: 'Boyaca',
            hour: '12:34',
            seats: 5,
            price: 9.5
          })
        })
      )
      // Mensaje de éxito y navegación
      expect(Swal.fire).toHaveBeenCalledWith('Éxito', successMessage, 'success')
      expect(navigateMock).toHaveBeenCalledWith('/manage-trips')
    })
  })

  test('fallo al registrar muestra alerta de error con mensaje del backend', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token123')

    // Mock de POST que retorna 400
    global.fetch = jest.fn().mockResolvedValue({
      status: 400,
      json: async () => ({ message: 'Bad Request' })
    })

    render(<RegisterTrip />)
    fireEvent.click(screen.getByText('Registrar Viaje'))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        'Error',
        'Bad Request',
        'error'
      )
      expect(navigateMock).not.toHaveBeenCalledWith('/manage-trips')
    })
  })

  test('error de red muestra alerta genérica', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token123')

    // Mock de POST que lanza excepción
    global.fetch = jest.fn().mockRejectedValue(new Error('network'))

    render(<RegisterTrip />)
    fireEvent.click(screen.getByText('Registrar Viaje'))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        'Error',
        'Ocurrió un error al intentar registrar el viaje',
        'error'
      )
    })
  })
})