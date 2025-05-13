// src/components/driver/__tests__/ManageTrips.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ManageTrips from '../ManageTrips'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

// Stub para evitar errores de submit en los botones dentro del <form>
beforeAll(() => {
  window.HTMLFormElement.prototype.submit = jest.fn()
})

// Stubs para componentes externos
jest.mock('../../reusable/CustomButton', () => ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
))
jest.mock('../../reusable/NavigationBar', () => ({ onMenuClick }) => (
  <div data-testid="nav" onClick={onMenuClick} />
))
jest.mock('../../reusable/Sidebar', () => ({ onClose, isDriver }) => (
  <div data-testid="sidebar">
    <button onClick={onClose}>Close Sidebar</button>
  </div>
))

// Mocks de sweetalert2 y useNavigate
jest.mock('sweetalert2', () => ({ fire: jest.fn() }))
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

describe('ManageTrips Component', () => {
  let navigateMock

  beforeEach(() => {
    jest.clearAllMocks()
    navigateMock = jest.fn()
    useNavigate.mockReturnValue(navigateMock)
  })

  test('redirige a /login si no hay token', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    render(<ManageTrips />)
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  test('muestra loader mientras carga', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    global.fetch = jest.fn(() => new Promise(() => {}))
    render(<ManageTrips />)
    expect(document.querySelector('.loader')).toBeInTheDocument()
  })

  test('en 401 y confirma yes navega a /add-vehicle', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    global.fetch = jest.fn().mockResolvedValue({ status: 401 })
    Swal.fire.mockResolvedValue({ isConfirmed: true })

    render(<ManageTrips />)
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled())
    expect(navigateMock).toHaveBeenCalledWith('/add-vehicle')
  })

  test('en 403 y cancela navega a /trip-list', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    global.fetch = jest.fn().mockResolvedValue({ status: 403 })
    Swal.fire.mockResolvedValue({ isConfirmed: false })

    render(<ManageTrips />)
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled())
    expect(navigateMock).toHaveBeenCalledWith('/trip-list')
  })

  test('renderiza viajes tras fetch exitoso', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    const sampleTrips = [
      {
        tripId: '1',
        initialPoint: 'A',
        finalPoint: 'B',
        route: 'R1',
        seats: 3,
        reservations: 1,
        price: 10,
        hour: '09:00',
      },
    ]
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ trips: sampleTrips }),
    })

    render(<ManageTrips />)

    expect(await screen.findByText('Inicio: A')).toBeInTheDocument()
    expect(screen.getByText('Fin: B')).toBeInTheDocument()
    expect(screen.getByText('Ruta: R1')).toBeInTheDocument()
    expect(screen.getByText('Cupos: 3 / Reservados: 1')).toBeInTheDocument()
    expect(screen.getByText('Tarifa: 10')).toBeInTheDocument()
    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
  })

  test('Volver cierra el modal', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    const sampleTrips = [
      {
        tripId: '3',
        initialPoint: 'P',
        finalPoint: 'Q',
        route: 'Autonorte',
        seats: 2,
        reservations: 0,
        price: 5,
        hour: '08:00',
      },
    ]
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ trips: sampleTrips }),
    })

    render(<ManageTrips />)
    fireEvent.click(await screen.findByText('Editar'))
    fireEvent.click(screen.getByText('Volver'))

    await waitFor(() =>
      expect(screen.queryByText('Editar Viaje')).not.toBeInTheDocument()
    )
  })

  test('handleEditSubmit guarda y actualiza la lista', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    const original = {
      tripId: '4',
      initialPoint: 'M',
      finalPoint: 'N',
      route: 'Novena',
      seats: 4,
      reservations: 0,
      price: 30,
      hour: '12:00',
    }
    const updated = { ...original, initialPoint: 'Z' }
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ status: 200, json: async () => ({ trips: [original] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ updatedTrip: updated }) })
    Swal.fire.mockResolvedValue({})

    render(<ManageTrips />)
    fireEvent.click(await screen.findByText('Editar'))
    fireEvent.change(screen.getByPlaceholderText('Punto de inicio'), {
      target: { value: 'Z' },
    })
    fireEvent.click(screen.getByText('Guardar Cambios'))

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'success' })
      )
    )
    expect(screen.getByText('Inicio: Z')).toBeInTheDocument()
  })

  test('handleDelete elimina un viaje de la lista', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    const tripA = {
      tripId: 'A',
      initialPoint: 'U',
      finalPoint: 'V',
      route: 'Suba',
      seats: 1,
      reservations: 0,
      price: 5,
      hour: '07:00',
    }
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ status: 200, json: async () => ({ trips: [tripA] }) })
      .mockResolvedValueOnce({ ok: true })
    Swal.fire.mockResolvedValue({ isConfirmed: true })

    render(<ManageTrips />)
    fireEvent.click(await screen.findByText('Eliminar'))

    await waitFor(() =>
      expect(screen.queryByText('Inicio: U')).not.toBeInTheDocument()
    )
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'success' })
    )
  })

  test('toggleDriverMode navega a /trip-list', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    global.fetch = jest.fn().mockResolvedValue({ status: 200, json: async () => ({ trips: [] }) })

    render(<ManageTrips />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(navigateMock).toHaveBeenCalledWith('/trip-list')
  })

  test('abre y cierra el sidebar', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    global.fetch = jest.fn().mockResolvedValue({ status: 200, json: async () => ({ trips: [] }) })

    render(<ManageTrips />)
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('nav'))
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Close Sidebar'))
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
  })
})
