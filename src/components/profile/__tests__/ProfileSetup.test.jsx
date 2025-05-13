// src/components/profile/__tests__/ProfileSetup.test.jsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileSetup from '../ProfileSetup'
import { useUser } from '../../auth/UserContext'
import Swal from 'sweetalert2'
import { MemoryRouter, useNavigate } from 'react-router-dom'

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

describe('ProfileSetup Component', () => {
  let setUserMock
  let navigateMock

  beforeEach(() => {
    setUserMock = jest.fn()
    navigateMock = jest.fn()
    useUser.mockReturnValue({
      user: {
        name: 'John',
        lastName: 'Doe',
        mail: 'john@example.com',
        password: 'secret',
      },
      setUser: setUserMock,
    })
    useNavigate.mockReturnValue(navigateMock)
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('1) Renderiza todos los inputs y el botón', () => {
    render(
      <MemoryRouter>
        <ProfileSetup />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('Nombre')).toBeDefined()
    expect(screen.getByPlaceholderText('Apellido')).toBeDefined()
    expect(screen.getByPlaceholderText('Id Universidad')).toBeDefined()
    expect(screen.getByPlaceholderText('Correo institucional')).toBeDefined()
    expect(screen.getByPlaceholderText('Número de contacto')).toBeDefined()
    expect(screen.getByText('Guardar Perfil')).toBeDefined()
  })

  test('2) Si faltan campos, muestra alerta de error', () => {
    render(
      <MemoryRouter>
        <ProfileSetup />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Guardar Perfil'))
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Todos los campos son obligatorios',
    })
  })

  test('3) Email inválido muestra alerta adecuada', () => {
    render(
      <MemoryRouter>
        <ProfileSetup />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText('Correo institucional'), {
      target: { value: 'no-valido' },
    })
    fireEvent.change(screen.getByPlaceholderText('Id Universidad'), {
      target: { value: '1234' },
    })
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), {
      target: { value: '5678' },
    })
    fireEvent.click(screen.getByText('Guardar Perfil'))
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Por favor ingrese un correo válido',
    })
  })

  test('4) Letras en ID o contacto muestra alerta de error', () => {
    render(
      <MemoryRouter>
        <ProfileSetup />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText('Correo institucional'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Id Universidad'), {
      target: { value: 'ABC123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), {
      target: { value: '9876' },
    })
    fireEvent.click(screen.getByText('Guardar Perfil'))
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'El ID y el número de contacto deben contener solo números',
    })
  })

  test('5) Contacto de más de 10 dígitos muestra alerta adecuada', () => {
    render(
      <MemoryRouter>
        <ProfileSetup />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText('Correo institucional'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Id Universidad'), {
      target: { value: '1234' },
    })
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), {
      target: { value: '12345678901' },
    })
    fireEvent.click(screen.getByText('Guardar Perfil'))
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'El número de contacto debe tener hasta 10 dígitos',
    })
  })

  test('6) Flujo exitoso: registra, alerta y navega a /trip-list', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(
      <MemoryRouter>
        <ProfileSetup />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText('Id Universidad'), {
      target: { value: '1234' },
    })
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), {
      target: { value: '5551234' },
    })
    fireEvent.click(screen.getByText('Guardar Perfil'))

    await waitFor(() => {
      expect(setUserMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1234',
          contactNumber: '5551234',
          image: expect.any(String),
        })
      )
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Éxito',
        text: 'El perfil se ha registrado correctamente',
        timer: 2000,
        showConfirmButton: false,
      })
    })

    jest.advanceTimersByTime(2000)
    expect(navigateMock).toHaveBeenCalledWith('/trip-list')
  })

  test('7) Si “Quiero ser conductor”, navega a /add-vehicle', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(
      <MemoryRouter>
        <ProfileSetup />
      </MemoryRouter>
    )

    // Selecciona el checkbox (sin labelfor, usamos role)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    fireEvent.change(screen.getByPlaceholderText('Id Universidad'), {
      target: { value: '9999' },
    })
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), {
      target: { value: '1234567' },
    })
    fireEvent.click(screen.getByText('Guardar Perfil'))

    await waitFor(() => {
      expect(setUserMock).toHaveBeenCalled()
      expect(Swal.fire).toHaveBeenCalled()
    })

    jest.advanceTimersByTime(2000)
    expect(navigateMock).toHaveBeenCalledWith('/add-vehicle')
  })
})
