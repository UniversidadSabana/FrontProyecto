// src/components/__tests__/TripList.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TripList from '../trip/TripList.jsx'
import { useUser } from '../auth/UserContext'

// 1) Mockea useNavigate
const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))

// 2) Mockea tu UserContext
jest.mock('../auth/UserContext', () => ({
  useUser: jest.fn(),
}))
const setUser = jest.fn()

describe('TripList.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Devuelve un objeto válido para destructurar
    useUser.mockReturnValue({ user: {}, setUser })
  })

  it('al activar modo conductor navega a /manage-trips', () => {
    render(
      <MemoryRouter>
        <TripList />
      </MemoryRouter>
    )

    const toggle = screen.getByLabelText(/Modo Conductor/i)
    fireEvent.click(toggle)
    expect(mockedNavigate).toHaveBeenCalledWith('/manage-trips')
  })
})
