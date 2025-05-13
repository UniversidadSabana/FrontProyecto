import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Login from '../Login'
import { useUser } from '../UserContext'
import { useNavigate } from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom'

// Mock sólo useUser y useNavigate, preservando los demás exports de react-router-dom
jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}))
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: jest.fn(),
  }
})

describe('Login Component Básico', () => {
  beforeEach(() => {
    // Cada test devuelve un contexto limpio
    useUser.mockReturnValue({ user: null, setUser: jest.fn() })
    useNavigate.mockReturnValue(() => {})  // no-op
  })

  test('renders email, password y botón de envío', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText(/Correo Institucional/i)
    const passInput  = screen.getByPlaceholderText(/Contraseña/i)
    const submitBtn  = screen.getByText('Iniciar Sesión')

    expect(emailInput).toBeDefined()
    expect(passInput).toBeDefined()
    expect(submitBtn).toBeDefined()
  })

  test('muestra mensaje de error si envío vacío', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const submitBtn = screen.getByText('Iniciar Sesión')
    fireEvent.click(submitBtn)

    const errMsg = screen.getByText(/Por favor completa ambos campos/i)
    expect(errMsg).toBeDefined()
  })
})
