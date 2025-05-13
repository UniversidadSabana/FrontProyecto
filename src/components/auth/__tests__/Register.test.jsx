import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Register from '../Register'
import { useUser } from '../UserContext'
import { useNavigate } from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom'

// Mock del hook useUser
jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}))
// Mock de useNavigate, preservando MemoryRouter y demás exports
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: jest.fn(),
  }
})

describe('Register Component Básico', () => {
  const setUserMock = jest.fn()
  const navigateMock = jest.fn()

  beforeEach(() => {
    useUser.mockReturnValue({ user: {}, setUser: setUserMock })
    useNavigate.mockReturnValue(navigateMock)
  })

  test('1) Renderiza inputs y botón', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    expect(screen.getByPlaceholderText('Nombre')).toBeDefined()
    expect(screen.getByPlaceholderText('Apellido')).toBeDefined()
    expect(screen.getByPlaceholderText('Email Institucional')).toBeDefined()
    expect(screen.getByText('Registrarse')).toBeDefined()
  })

  test('2) Muestra error si campos vacíos', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Registrarse'))
    expect(screen.getByText('Todos los campos son obligatorios')).toBeDefined()
  })

  test('3) Muestra error si email inválido', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Nombre'), {
      target: { value: 'John' }
    })
    fireEvent.change(screen.getByPlaceholderText('Apellido'), {
      target: { value: 'Doe' }
    })
    fireEvent.change(screen.getByPlaceholderText('Email Institucional'), {
      target: { value: 'no-es-correo' }
    })
    fireEvent.click(screen.getByText('Registrarse'))

    expect(screen.getByText('Por favor ingrese un correo válido')).toBeDefined()
  })

  test('4) Flujo exitoso llama a setUser y navega', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Nombre'), {
      target: { value: 'John' }
    })
    fireEvent.change(screen.getByPlaceholderText('Apellido'), {
      target: { value: 'Doe' }
    })
    fireEvent.change(screen.getByPlaceholderText('Email Institucional'), {
      target: { value: 'john@example.com' }
    })
    fireEvent.click(screen.getByText('Registrarse'))

    expect(setUserMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John',
        lastName: 'Doe',
        mail: 'john@example.com'
      })
    )
    expect(navigateMock).toHaveBeenCalledWith('/password')
  })
})
