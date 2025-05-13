// src/components/profile/__tests__/ProfilePassenger.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfilePassenger from '../ProfilePassenger'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../auth/UserContext'

// Mocks
jest.mock('../../auth/UserContext', () => ({ useUser: jest.fn() }))
jest.mock('sweetalert2', () => ({ fire: jest.fn() }))
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

// Stub para evitar el error de JSDOM: HTMLFormElement.submit
beforeAll(() => {
  window.HTMLFormElement.prototype.submit = jest.fn()
})

describe('ProfilePassenger', () => {
  let navigateMock, setUserMock

  beforeEach(() => {
    jest.clearAllMocks()
    navigateMock = jest.fn()
    useNavigate.mockReturnValue(navigateMock)
    setUserMock = jest.fn()
    useUser.mockReturnValue({ user: {}, setUser: setUserMock })
  })

  test('redirige a /login si no hay token', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    render(<ProfilePassenger />)
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  test('redirige a /login si GET perfil devuelve 401', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('tkn')
    global.fetch = jest.fn().mockResolvedValue({ status: 401 })
    render(<ProfilePassenger />)
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  test('carga y muestra datos tras GET exitoso', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('tkn')
    const profileData = {
      name: 'John',
      lastName: 'Doe',
      contactNumber: '12345',
      image: 'http://img'
    }
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => profileData
    })

    render(<ProfilePassenger />)

    // Esperamos a que setUser sea llamado con los datos
    await waitFor(() => expect(setUserMock).toHaveBeenCalledWith(profileData))

    // Inputs reflejan los valores
    expect(screen.getByPlaceholderText('Nombre')).toHaveValue('John')
    expect(screen.getByPlaceholderText('Apellido')).toHaveValue('Doe')
    expect(screen.getByPlaceholderText('Número de contacto')).toHaveValue('12345')
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'http://img')
  })

  test('valida campos vacíos al guardar', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('tkn')
    global.fetch = jest.fn().mockResolvedValue({ status: 200, ok: true, json: async () => ({}) })

    render(<ProfilePassenger />)
    fireEvent.click(screen.getByText('Guardar Cambios'))
    expect(await screen.findByText('Todos los campos son obligatorios')).toBeInTheDocument()
  })

  test('valida número de contacto no numérico', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('tkn')
    global.fetch = jest.fn().mockResolvedValue({ status: 200, ok: true, json: async () => ({}) })

    render(<ProfilePassenger />)
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'A' } })
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'B' } })
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), { target: { value: 'ABC' } })
    fireEvent.click(screen.getByText('Guardar Cambios'))
    expect(await screen.findByText('El ID y el número de contacto deben contener solo números')).toBeInTheDocument()
  })

  test('valida número de contacto demasiado largo', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('tkn')
    global.fetch = jest.fn().mockResolvedValue({ status: 200, ok: true, json: async () => ({}) })

    render(<ProfilePassenger />)
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'A' } })
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'B' } })
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), { target: { value: '12345678901' } })
    fireEvent.click(screen.getByText('Guardar Cambios'))
    expect(await screen.findByText('El número de contacto debe tener hasta 10 dígitos')).toBeInTheDocument()
  })

  test('muestra error de Swal si PUT falla', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('tkn')
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ status: 200, ok: true, json: async () => ({ name: 'X', lastName: 'Y', contactNumber: '1', image: '' }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'fail' }) })

    render(<ProfilePassenger />)
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'X' } })
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Y' } })
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), { target: { value: '1' } })
    fireEvent.click(screen.getByText('Guardar Cambios'))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Error',
          text: expect.stringContaining('fail')
        })
      )
    })
  })

  test('muestra éxito de Swal si PUT ok', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('tkn')
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ status: 200, ok: true, json: async () => ({ name: 'X', lastName: 'Y', contactNumber: '1', image: '' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })

    render(<ProfilePassenger />)
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'X' } })
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Y' } })
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), { target: { value: '1' } })
    fireEvent.click(screen.getByText('Guardar Cambios'))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Perfil actualizado'
        })
      )
    })
  })
})
