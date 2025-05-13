// src/components/__tests__/TripCard.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TripCard from '../trip/TripCard.jsx'

// 1) Mockea useNavigate
const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))

describe('TripCard.jsx', () => {
  beforeEach(() => jest.clearAllMocks())

  it('al pulsar "Ver detalles" navega con el tripId correcto', () => {
    const trip = {
      tripId: 'trip123',
      initialPoint: 'A',
      finalPoint: 'B',
      route: 'Ruta X',
      seatsAvailable: 4,
      hour: '08:30',
      price: 1500,
    }
    render(
      <MemoryRouter>
        <TripCard trip={trip} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Ver detalles/i }))
    expect(mockedNavigate).toHaveBeenCalledWith('/trip-details/trip123')
  })
})
