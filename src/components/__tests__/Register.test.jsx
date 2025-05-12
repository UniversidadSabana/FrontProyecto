import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Register from '../auth/Register'
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

describe('Register.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useUser.mockReturnValue({ user: {}, setUser })
  })

  const setup = () =>
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

  test('muestra error si los campos están vacíos', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))
    expect(screen.getByText(/Todos los campos son obligatorios/i)).toBeInTheDocument()
  })

  test('muestra error si el email es inválido', () => {
    setup()
    fireEvent.change(screen.getByPlaceholderText(/Nombre/i), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByPlaceholderText(/Apellido/i), { target: { value: 'Pérez' } })
    fireEvent.change(screen.getByPlaceholderText(/Email Institucional/i), {
      target: { value: 'correo@invalido' },
    })
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))
    expect(screen.getByText(/Por favor ingrese un correo válido/i)).toBeInTheDocument()
  })

  test('llama setUser y navega si los datos son válidos', () => {
    setup()
    fireEvent.change(screen.getByPlaceholderText(/Nombre/i), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByPlaceholderText(/Apellido/i), { target: { value: 'Pérez' } })
    fireEvent.change(screen.getByPlaceholderText(/Email Institucional/i), {
      target: { value: 'ana@universidad.edu' },
    })
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))
    expect(setUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ana',
        lastName: 'Pérez',
        mail: 'ana@universidad.edu',
      })
    )
    expect(mockedNavigate).toHaveBeenCalledWith('/password')
  })
})
