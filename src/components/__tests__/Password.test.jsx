import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Password from '../auth/Password'
import { useUser } from '../auth/UserContext'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../auth/UserContext')
const mockedNavigate = jest.fn()
const setUser = jest.fn()

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  }
})

describe('Password.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderWithUser = (user) => {
    useUser.mockReturnValue({ user, setUser })
    return render(
      <MemoryRouter>
        <Password />
      </MemoryRouter>
    )
  }

  test('redirige a /login si no hay user.name', () => {
    renderWithUser({})
    expect(mockedNavigate).toHaveBeenCalledWith('/login')
  })

  test('error si campos vacíos', () => {
    renderWithUser({ name: 'Ana' })
    fireEvent.click(screen.getByRole('button', { name: /registrarte/i }))
    expect(screen.getByText(/Todos los campos son obligatorios/i)).toBeInTheDocument()
  })

  test('error si contraseña no cumple requisitos', () => {
    renderWithUser({ name: 'Ana' })
    fireEvent.change(screen.getByPlaceholderText(/Ingresa contraseña/i), {
      target: { value: '123' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirmar contraseña/i), {
      target: { value: '123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /registrarte/i }))
    expect(
      screen.getByText(/La contraseña debe tener al menos 8 caracteres/i)
    ).toBeInTheDocument()
  })

  test('error si las contraseñas no coinciden', () => {
    renderWithUser({ name: 'Ana' })
    fireEvent.change(screen.getByPlaceholderText(/Ingresa contraseña/i), {
      target: { value: 'Password1!' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirmar contraseña/i), {
      target: { value: 'Password2!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /registrarte/i }))
    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument()
  })

  test('llama setUser y navega si password válido', () => {
    renderWithUser({ name: 'Ana' })
    fireEvent.change(screen.getByPlaceholderText(/Ingresa contraseña/i), {
      target: { value: 'Password1!' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirmar contraseña/i), {
      target: { value: 'Password1!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /registrarte/i }))
    expect(setUser).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'Password1!' })
    )
    expect(mockedNavigate).toHaveBeenCalledWith('/profile-setup')
  })
})
