// src/components/__tests__/ViewVehicle.test.jsx
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import ViewVehicle from '../driver/ViewVehicle'
import { MemoryRouter } from 'react-router-dom'

const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))

describe('ViewVehicle', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch')
    localStorage.setItem('token', 'fake-token')
  })
  afterEach(() => {
    global.fetch.mockRestore()
    localStorage.clear()
    mockedNavigate.mockReset()
  })

  it('muestra loader inicialmente', () => {
    fetch.mockImplementation(() => new Promise(() => {}))
    render(<ViewVehicle />, { wrapper: MemoryRouter })
    expect(screen.getByText(/Cargando la información del vehículo/i)).toBeInTheDocument()
  })

  it('renderiza datos cuando el fetch responde OK', async () => {
    const vehicle = {
      carPlate: 'XYZ123',
      capacity: 5,
      brand: 'TestBrand',
      model: 'T1',
      picture: null,
      soat: null
    }
    fetch.mockResolvedValue({ ok: true, json: async () => ({ vehicle }) })
    render(<ViewVehicle />, { wrapper: MemoryRouter })
    await waitFor(() => expect(screen.getByDisplayValue('XYZ123')).toBeInTheDocument())
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
    expect(screen.getByDisplayValue('TestBrand')).toBeInTheDocument()
    expect(screen.getByDisplayValue('T1')).toBeInTheDocument()
  })

  it('redirige al listado si el fetch falla', async () => {
    fetch.mockRejectedValue(new Error('fail'))
    render(<ViewVehicle />, { wrapper: MemoryRouter })
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/trip-list'))
  })
})
