// src/components/__tests__/RegisterTrip.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RegisterTrip from '../driver/RegisterTrip.jsx'
import Swal from 'sweetalert2'

// Mock de sweetalert2.fire
jest.mock('sweetalert2', () => ({ fire: jest.fn(() => Promise.resolve()) }))

// Mock de useNavigate
const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))

// Mock global fetch
global.fetch = jest.fn()

describe('RegisterTrip.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('al montar sin token redirige a /login (sin Swal)', () => {
    render(
      <MemoryRouter>
        <RegisterTrip />
      </MemoryRouter>
    )
    expect(mockedNavigate).toHaveBeenCalledWith('/login')
    expect(Swal.fire).not.toHaveBeenCalled()
  })

  it('al pulsar "Registrar Viaje" sin token muestra error y redirige', async () => {
    render(
      <MemoryRouter>
        <RegisterTrip />
      </MemoryRouter>
    )
    // Pulsamos el botón de Registrar Viaje
    fireEvent.click(screen.getByRole('button', { name: /Registrar Viaje/i }))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        'Error',
        'No estás autenticado. Por favor inicia sesión.',
        'error'
      )
      expect(mockedNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('con token y status 201 navega a /manage-trips', async () => {
    localStorage.setItem('token', 'tok123')
    fetch.mockResolvedValueOnce({
      status: 201,
      json: async () => ({ message: 'Creado exitosamente' }),
    })

    render(
      <MemoryRouter>
        <RegisterTrip />
      </MemoryRouter>
    )
    // Pulsamos el botón de Registrar Viaje
    fireEvent.click(screen.getByRole('button', { name: /Registrar Viaje/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
      expect(Swal.fire).toHaveBeenCalledWith(
        'Éxito',
        'Creado exitosamente',
        'success'
      )
      expect(mockedNavigate).toHaveBeenCalledWith('/manage-trips')
    })
  })
})
