import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Reservations from '../passengerBar/Reservations.jsx'

// mock de useNavigate para evitar errores
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

// mock global fetch
global.fetch = jest.fn()

describe('Reservations.jsx', () => {
  beforeEach(() => jest.clearAllMocks())

  it('muestra "No tienes reservas" cuando la API devuelve lista vacía', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reservations: [] }),
    })

    render(
      <MemoryRouter>
        <Reservations />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/No tienes reservas/i)).toBeInTheDocument()
    })
  })
})
