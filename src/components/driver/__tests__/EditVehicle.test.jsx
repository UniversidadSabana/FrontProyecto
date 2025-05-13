// src/components/driver/__tests__/EditVehicle.test.jsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditVehicle from '../EditVehicle'
import Swal from 'sweetalert2'
import { MemoryRouter, useNavigate } from 'react-router-dom'

// Mocks
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}))
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: jest.fn(),
  }
})

describe('EditVehicle Component', () => {
  let navigateMock

  beforeEach(() => {
    navigateMock = jest.fn()
    useNavigate.mockReturnValue(navigateMock)
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('1) Si GET falla, redirige a /manage-trips', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false })

    render(
      <MemoryRouter>
        <EditVehicle />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/manage-trips')
    })
  })

  test('2) Si GET es exitoso, rellena los inputs', async () => {
    const vehicleData = {
      vehicle: {
        carPlate: 'XYZ123',
        capacity: 4,
        brand: 'TestBrand',
        model: 'TestModel',
        color: 'Rojo',
      }
    }
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => vehicleData,
    })

    render(
      <MemoryRouter>
        <EditVehicle />
      </MemoryRouter>
    )

    await waitFor(() => {
      const placaInput = screen.getByPlaceholderText('Placa')
      expect(placaInput.value).toBe('XYZ123')
    })

    expect(screen.getByPlaceholderText('Marca').value).toBe('TestBrand')
    expect(screen.getByPlaceholderText('Modelo').value).toBe('TestModel')
    expect(screen.getByPlaceholderText('Color').value).toBe('Rojo')
    expect(screen.getByLabelText('Capacidad').value).toBe('4')
  })

  test('3) Submit con campos faltantes muestra alerta de error', async () => {
    const vehicleData = {
      vehicle: {
        carPlate: '',
        capacity: 1,
        brand: '',
        model: '',
        color: '',
      }
    }
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => vehicleData,
    })

    render(
      <MemoryRouter>
        <EditVehicle />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Placa').value).toBe('')
    })

    fireEvent.click(screen.getByText('Guardar Vehículo'))

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Todos los campos son obligatorios.',
    })
  })

  test('4) PUT fallido tras cargar imágenes muestra alerta de error', async () => {
    const vehicleData = {
      vehicle: {
        carPlate: 'AAA111',
        capacity: 2,
        brand: 'B',
        model: 'M',
        color: 'C',
      }
    }
    const cloud1 = { secure_url: 'url-veh' }
    const cloud2 = { secure_url: 'url-soat' }
    const putFail = { message: 'update fail' }

    global.fetch = jest.fn()
      // 1) GET datos
      .mockResolvedValueOnce({ ok: true, json: async () => vehicleData })
      // 2) subida vehicleImage
      .mockResolvedValueOnce({ json: async () => cloud1 })
      // 3) subida soatImage
      .mockResolvedValueOnce({ json: async () => cloud2 })
      // 4) PUT update
      .mockResolvedValueOnce({ ok: false, json: async () => putFail })

    render(
      <MemoryRouter>
        <EditVehicle />
      </MemoryRouter>
    )

    // Esperamos que los datos iniciales hayan poblado los inputs
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Placa').value).toBe('AAA111')
    })

    // Simulamos carga de vehicleImage y esperamos el resultado
    const vehInput = screen.getByLabelText('Foto del vehículo')
      .parentNode.querySelector('input[type="file"]')
    fireEvent.change(vehInput, {
      target: { files: [new File(['veh'], 'veh.png', { type: 'image/png' })] },
    })
    await waitFor(() => {
      // Ahora debe haberse renderizado la etiqueta <img alt="Vehicle" ...>
      expect(screen.getByAltText('Vehicle').getAttribute('src')).toBe('url-veh')
    })

    // Simulamos carga de soatImage y esperamos el resultado
    const soatInput = screen.getByLabelText('Foto del SOAT')
      .parentNode.querySelector('input[type="file"]')
    fireEvent.change(soatInput, {
      target: { files: [new File(['soat'], 'soat.png', { type: 'image/png' })] },
    })
    await waitFor(() => {
      expect(screen.getByAltText('SOAT').getAttribute('src')).toBe('url-soat')
    })

    // Finalmente, clic en guardar ya con todo listo
    fireEvent.click(screen.getByText('Guardar Vehículo'))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error',
        text: `No se pudo actualizar el vehículo. ${putFail.message}`,
      })
    })
  })
})
