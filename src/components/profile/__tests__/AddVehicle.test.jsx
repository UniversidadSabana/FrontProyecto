// src/components/profile/__tests__/AddVehicle.test.jsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddVehicle from '../AddVehicle'
import Swal from 'sweetalert2'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { useUser } from '../../auth/UserContext'

// — Mocks —
jest.mock('../../auth/UserContext', () => ({
  useUser: jest.fn(),
}))
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

describe('AddVehicle Component', () => {
  let navigateMock

  beforeEach(() => {
    navigateMock = jest.fn()
    useNavigate.mockReturnValue(navigateMock)

    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('redirige a /login si no hay token válido', async () => {
    // user sin id y token ausente
    useUser.mockReturnValue({ user: {} })
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)

    render(
      <MemoryRouter>
        <AddVehicle />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  test('renderiza inputs y botones básicos', () => {
    useUser.mockReturnValue({ user: { id: '123' } })
    // restaurar token para no redirigir
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('foo')

    render(
      <MemoryRouter>
        <AddVehicle />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('Placa')).toBeDefined()
    expect(screen.getByPlaceholderText('Marca')).toBeDefined()
    expect(screen.getByPlaceholderText('Modelo')).toBeDefined()
    expect(screen.getByPlaceholderText('Color')).toBeDefined()
    expect(screen.getByLabelText('Capacidad')).toBeDefined()
    expect(screen.getByText('Guardar Vehículo')).toBeDefined()
  })

  test('muestra error si falta cualquier campo al enviar', async () => {
    useUser.mockReturnValue({ user: { id: '123' } })
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('foo')

    render(
      <MemoryRouter>
        <AddVehicle />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Guardar Vehículo'))
    expect(await screen.findByText('Todos los campos son obligatorios')).toBeDefined()
  })

  test('flujo exitoso: sube imágenes, envía y redirige', async () => {
    useUser.mockReturnValue({ user: { id: '123' } })
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('foo')

    // mock Cloudinary y POST vehicle
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: async () => ({ secure_url: 'url-veh' }) })
      .mockResolvedValueOnce({ json: async () => ({ secure_url: 'url-soat' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })

    render(
      <MemoryRouter>
        <AddVehicle />
      </MemoryRouter>
    )

    // llenar campos
    fireEvent.change(screen.getByPlaceholderText('Placa'),  { target: { value: 'ABC123' } })
    fireEvent.change(screen.getByPlaceholderText('Marca'),  { target: { value: 'Brand' } })
    fireEvent.change(screen.getByPlaceholderText('Modelo'), { target: { value: 'Model' } })
    fireEvent.change(screen.getByPlaceholderText('Color'),  { target: { value: 'Blue' } })
    fireEvent.change(screen.getByLabelText('Capacidad'),   { target: { value: '4' } })

    // subir vehicleImage
    const vehInput = screen
      .getByLabelText('Foto del vehículo')
      .parentNode.querySelector('input[type="file"]')
    fireEvent.change(vehInput, { target: { files: [new File(['v'], 'v.png', { type: 'image/png' })] } })
    // esperamos la aparición del <img alt="Vehicle" />
    const vehImg = await screen.findByAltText('Vehicle')
    expect(vehImg.getAttribute('src')).toBe('url-veh')

    // subir soatImage
    const soatInput = screen
      .getByLabelText('Foto del SOAT')
      .parentNode.querySelector('input[type="file"]')
    fireEvent.change(soatInput, { target: { files: [new File(['s'], 's.png', { type: 'image/png' })] } })
    const soatImg = await screen.findByAltText('SOAT')
    expect(soatImg.getAttribute('src')).toBe('url-soat')

    // enviar
    fireEvent.click(screen.getByText('Guardar Vehículo'))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Vehículo agregado exitosamente',
        text: 'Redirigiendo...',
        timer: 2000,
        showConfirmButton: false,
        willClose: expect.any(Function),
      })
    })

    // simulamos cierre de la alerta para disparar navigate
    const options = Swal.fire.mock.calls[0][0]
    options.willClose()
    expect(navigateMock).toHaveBeenCalledWith('/trip-list')
  })

  test('error del servidor al POST muestra alerta de error', async () => {
    useUser.mockReturnValue({ user: { id: '123' } })
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('foo')

    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: async () => ({ secure_url: 'url-veh' }) })
      .mockResolvedValueOnce({ json: async () => ({ secure_url: 'url-soat' }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'fail' }) })

    render(
      <MemoryRouter>
        <AddVehicle />
      </MemoryRouter>
    )

    // subir imágenes
    const vehInput2 = screen.getByLabelText('Foto del vehículo').parentNode.querySelector('input[type="file"]')
    fireEvent.change(vehInput2, { target: { files: [new File(['v'],'v.png',{type:'image/png'})] } })
    await screen.findByAltText('Vehicle')
    const soatInput2 = screen.getByLabelText('Foto del SOAT').parentNode.querySelector('input[type="file"]')
    fireEvent.change(soatInput2, { target: { files: [new File(['s'],'s.png',{type:'image/png'})] } })
    await screen.findByAltText('SOAT')

    // llenar campos posteriores al alt tests
    fireEvent.change(screen.getByPlaceholderText('Placa'),  { target: { value: 'ABC123' } })
    fireEvent.change(screen.getByPlaceholderText('Marca'),  { target: { value: 'Brand' } })
    fireEvent.change(screen.getByPlaceholderText('Modelo'), { target: { value: 'Model' } })
    fireEvent.change(screen.getByPlaceholderText('Color'),  { target: { value: 'Blue' } })
    fireEvent.change(screen.getByLabelText('Capacidad'),   { target: { value: '4' } })

    fireEvent.click(screen.getByText('Guardar Vehículo'))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar el vehículo. fail',
      })
    })
  })
})
