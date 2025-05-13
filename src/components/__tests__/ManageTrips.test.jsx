import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ManageTrips from '../driver/ManageTrips.jsx'
import Swal from 'sweetalert2'

// mock de sweetalert2
jest.mock('sweetalert2', () => ({ fire: jest.fn(() => Promise.resolve()) }))

// mock de useNavigate
const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))

describe('ManageTrips.jsx', () => {
  beforeEach(() => jest.clearAllMocks())

  it('navega a /register-trip al pulsar "Registra un nuevo viaje"', () => {
    render(
      <MemoryRouter>
        <ManageTrips />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /Registra un nuevo viaje/i }))
    expect(mockedNavigate).toHaveBeenCalledWith('/register-trip')
  })

  it('al desactivar el toggle de modo conductor navega a /trip-list', () => {
    render(
      <MemoryRouter>
        <ManageTrips />
      </MemoryRouter>
    )
    const toggle = screen.getByLabelText(/Modo Conductor/i)
    fireEvent.click(toggle)
    expect(mockedNavigate).toHaveBeenCalledWith('/trip-list')
  })
})
