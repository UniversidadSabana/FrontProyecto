// src/components/driver/__tests__/ViewVehicle.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import ViewVehicle from '../ViewVehicle'
import { useNavigate } from 'react-router-dom'

// Stub para CustomButton
jest.mock('../../reusable/CustomButton', () => ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
))
// Mock de react-router
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

// Evitar error JSDOM “Not implemented: HTMLFormElement.prototype.submit”
beforeAll(() => {
  window.HTMLFormElement.prototype.submit = jest.fn()
})

describe('ViewVehicle component', () => {
  let navigateMock

  beforeEach(() => {
    jest.clearAllMocks()
    navigateMock = jest.fn()
    useNavigate.mockReturnValue(navigateMock)
  })

  test('muestra loader inicialmente', () => {
    render(<ViewVehicle />)
    expect(screen.getByText('Cargando la información del vehículo...')).toBeInTheDocument()
  })

  test('redirige a /trip-list si fetch lanza error', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token123')
    global.fetch = jest.fn().mockRejectedValue(new Error('fail'))
    render(<ViewVehicle />)
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/trip-list')
    })
  })

  test('redirige a /trip-list si response.ok es false', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token123')
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: async () => 'Server error'
    })
    render(<ViewVehicle />)
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/trip-list')
    })
  })

  test('muestra mensaje si no hay vehículo en data', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token123')
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ vehicle: null })
    })
    render(<ViewVehicle />)
    expect(await screen.findByText('No se encontró información del vehículo.')).toBeInTheDocument()
  })

  test('renderiza datos del vehículo y botones de navegación', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token123')
    const fakeVehicle = {
      picture: 'http://img/veh.png',
      carPlate: 'XYZ123',
      capacity: 4,
      brand: 'BrandX',
      model: 'ModelY',
      soat: 'http://img/soat.png'
    }
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ vehicle: fakeVehicle })
    })
    render(<ViewVehicle />)

    // Esperamos a que desaparezca el loader
    await waitFor(() => 
      expect(screen.queryByText('Cargando la información del vehículo...')).not.toBeInTheDocument()
    )

    // Título
    expect(screen.getByText('Vehículo Registrado')).toBeInTheDocument()
    // Imágenes
    expect(screen.getByAltText('Vehículo')).toHaveAttribute('src', fakeVehicle.picture)
    expect(screen.getByAltText('SOAT')).toHaveAttribute('src', fakeVehicle.soat)
    // Campos readOnly
    expect(screen.getByDisplayValue('XYZ123')).toBeInTheDocument()
    expect(screen.getByDisplayValue('4')).toBeInTheDocument()
    expect(screen.getByDisplayValue('BrandX')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ModelY')).toBeInTheDocument()

    // Botones de navegación
    fireEvent.click(screen.getByText('Volver'))
    expect(navigateMock).toHaveBeenCalledWith('/manage-trips')

    fireEvent.click(screen.getByText('Editar Vehículo'))
    expect(navigateMock).toHaveBeenCalledWith('/edit-vehicle')
  })
})
