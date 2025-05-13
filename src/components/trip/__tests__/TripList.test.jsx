// src/components/trip/__tests__/TripList.test.jsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TripList from '../TripList'
import { useUser } from '../../auth/UserContext'
import { useNavigate } from 'react-router-dom'

// Stubs de componentes reutilizables y TripCard
jest.mock('../../reusable/NavigationBar', () => () => <div data-testid="nav" />)
jest.mock('../../reusable/Sidebar', () => ({ onClose }) => (
  <div data-testid="sidebar"><button onClick={onClose}>Close</button></div>
))
jest.mock('../TripCard', () => ({ trip }) => (
  <div data-testid="trip-card">{trip.tripId}</div>
))

// Mocks de hooks
jest.mock('../../auth/UserContext', () => ({ useUser: jest.fn() }))
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: jest.fn(),
  }
})

describe('TripList Component', () => {
  let navigateMock

  beforeEach(() => {
    navigateMock = jest.fn()
    useNavigate.mockReturnValue(navigateMock)
    jest.clearAllMocks()
  })

  test('1) redirige a /login si no hay token', async () => {
    useUser.mockReturnValue({ user: { id: 'u1' }, setUser: jest.fn() })
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)

    render(<TripList />)
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  test('2) muestra loader mientras carga', () => {
    useUser.mockReturnValue({ user: { id: 'u1' }, setUser: jest.fn() })
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    global.fetch = jest.fn(() => new Promise(() => {}))

    render(<TripList />)
    expect(document.querySelector('.loader')).toBeDefined()
  })

  test('3) redirige a /login si fetch devuelve 401', async () => {
    useUser.mockReturnValue({ user: { id: 'u1' }, setUser: jest.fn() })
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    global.fetch = jest.fn().mockResolvedValue({ status: 401 })

    render(<TripList />)
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  test('4) muestra solo t3 y t1 tras fetch exitoso (se descarta t2 sin cupos)', async () => {
    useUser.mockReturnValue({ user: { id: 'u1' }, setUser: jest.fn() })
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')

    const trips = [
      { tripId: 't1', seatsAvailable: 3, route: 'Autonorte' },
      { tripId: 't2', seatsAvailable: 0, route: 'Suba' }, // sin cupos
      { tripId: 't3', seatsAvailable: 5, route: 'Boyaca' },
    ]
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ trips }),
    })

    render(<TripList />)

    // Esperamos a que el filtrado descarte la card 't2'
    await waitFor(() =>
      expect(screen.getAllByTestId('trip-card')).toHaveLength(2)
    )

    const cards = screen.getAllByTestId('trip-card').map(el => el.textContent)
    // El orden invertido por el reverse(): [t3, t1]
    expect(cards).toEqual(['t3', 't1'])
  })

  // Test 5 (filtro) omitido

  test('6) al activar modo conductor navega a /manage-trips', async () => {
    useUser.mockReturnValue({ user: { id: 'u1' }, setUser: jest.fn() })
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ trips: [] }),
    })

    render(<TripList />)
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    fireEvent.click(screen.getByRole('checkbox'))
    expect(navigateMock).toHaveBeenCalledWith('/manage-trips')
  })
})
