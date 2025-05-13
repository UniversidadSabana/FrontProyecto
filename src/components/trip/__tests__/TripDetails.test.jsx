// src/components/trip/__tests__/TripDetails.test.jsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TripDetails from '../TripDetails'
import Swal from 'sweetalert2'
import { MemoryRouter } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'

// Mocks
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve()),
}))
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useParams: jest.fn(),
    useNavigate: jest.fn(),
  }
})

describe('TripDetails Component', () => {
  let navigateMock

  beforeEach(() => {
    navigateMock = jest.fn()
    useParams.mockReturnValue({ tripId: '123' })
    useNavigate.mockReturnValue(navigateMock)
    jest.clearAllMocks()
    jest.useFakeTimers()
    // Por defecto simulamos que hay token
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('1) Muestra el loader inicialmente', () => {
    // Hacemos un fetch que nunca resuelve
    global.fetch = jest.fn(() => new Promise(() => {}))
    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    )
    // Esperamos el elemento con clase "loader"
    expect(document.querySelector('.loader')).toBeDefined()
  })

  test('2) Si no hay token navega a /login', async () => {
    Storage.prototype.getItem.mockReturnValueOnce(null)
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({}) })
    )
    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  test('3) Muestra mensaje de error si fetch inicial falla', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    )
    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/Error: Error HTTP: 500/)).toBeDefined()
    })
  })

  test('4) Muestra detalles del viaje cuando fetch es exitoso', async () => {
    const tripData = {
      carPicture: 'pic.jpg',
      initialPoint: 'Calle 82',
      finalPoint: 'Calle 100',
      hour: '10:00',
      seatsAvailable: 3,
      price: '$10',
      carPlate: 'abc123',
      route: 'Autonorte',
    }
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => tripData })
    )
    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    )
    // Espera a que carguen los detalles
    await waitFor(() => screen.getByText(/Calle 82.*→.*Calle 100/))
    expect(screen.getByText(/Salida: 10:00/)).toBeDefined()
    expect(screen.getByText(/3 cupos disponibles/)).toBeDefined()
    expect(screen.getByText(/\$10/)).toBeDefined()
    expect(screen.getByText(/Placa: ABC123/)).toBeDefined()
    expect(screen.getByText(/Ruta: Autonorte/)).toBeDefined()
  })

  test('5) Cambiar número de cupos actualiza selects de parada', async () => {
    const tripData = {
      carPicture: 'pic.jpg',
      initialPoint: 'Calle 82',
      finalPoint: 'Calle 100',
      hour: '10:00',
      seatsAvailable: 3,
      price: '$10',
      carPlate: 'abc123',
      route: 'Autonorte',
    }
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => tripData })
    )
    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    )
    // Espera a que carguen los selects
    await waitFor(() => screen.getAllByRole('combobox'))
    const combosBefore = screen.getAllByRole('combobox')
    // Inicialmente combo seats + 1 parada = 2
    expect(combosBefore).toHaveLength(2)

    // Cambiamos a 2 cupos
    fireEvent.change(combosBefore[0], { target: { value: '2' } })
    const combosAfter = screen.getAllByRole('combobox')
    // Ahora seats + 2 paradas = 3
    expect(combosAfter).toHaveLength(3)
  })

  test('6) Reserva exitosa llama a Swal.fire y navega a /trip-list', async () => {
    const tripData = {
      carPicture: 'pic.jpg',
      initialPoint: 'Calle 82',
      finalPoint: 'Calle 100',
      hour: '10:00',
      seatsAvailable: 3,
      price: '$10',
      carPlate: 'abc123',
      route: 'Autonorte',
    }
    const reservationResult = { message: 'Hecho', seatsRemaining: 2 }
    global.fetch = jest.fn()
      // primer fetch: datos del viaje
      .mockResolvedValueOnce({ ok: true, json: async () => tripData })
      // segundo fetch: reserva
      .mockResolvedValueOnce({ ok: true, json: async () => reservationResult })

    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    )
    // Espera a que cargue el formulario
    await waitFor(() => screen.getByText('Reservar Cupo(s)'))

    // Disparamos la reserva
    fireEvent.click(screen.getByText('Reservar Cupo(s)'))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Reserva exitosa',
        text: `Hecho. Cupos restantes: 2`,
        confirmButtonText: 'OK',
      })
    })
    expect(navigateMock).toHaveBeenCalledWith('/trip-list')
  })

  test('7) Reserva falla muestra mensaje de error', async () => {
    const tripData = {
      carPicture: 'pic.jpg',
      initialPoint: 'Calle 82',
      finalPoint: 'Calle 100',
      hour: '10:00',
      seatsAvailable: 3,
      price: '$10',
      carPlate: 'abc123',
      route: 'Autonorte',
    }
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => tripData })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'fail' }) })

    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    )
    await waitFor(() => screen.getByText('Reservar Cupo(s)'))
    fireEvent.click(screen.getByText('Reservar Cupo(s)'))

    await waitFor(() => {
      expect(screen.getByText(/Error: fail/)).toBeDefined()
    })
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
