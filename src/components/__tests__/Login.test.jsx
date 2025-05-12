import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../auth/Login'
import { useUser } from '../auth/UserContext'

// Mockea useNavigate (no lo usamos aquí, pero evita errores)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

// Mockea tu hook de usuario
jest.mock('../auth/UserContext', () => ({
  useUser: jest.fn(),
}))

describe('Login básico', () => {
  beforeEach(() => {
    // Solo nos interesa evitar que useUser devuelva undefined
    useUser.mockReturnValue({ user: {}, setUser: jest.fn() })
  })

  test('muestra error si los campos están vacíos', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    expect(screen.getByText(/Por favor completa ambos campos/i)).toBeInTheDocument()
  })

  test('toggle de contraseña cambia el type del input', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    const pwdInput = screen.getByPlaceholderText('Contraseña')
    const toggleBtn = screen.getByRole('button', { name: '' })
    expect(pwdInput).toHaveAttribute('type', 'password')
    fireEvent.click(toggleBtn)
    expect(pwdInput).toHaveAttribute('type', 'text')
    fireEvent.click(toggleBtn)
    expect(pwdInput).toHaveAttribute('type', 'password')
  })
})
