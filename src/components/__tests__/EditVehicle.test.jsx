// src/components/__tests__/EditVehicle.test.jsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditVehicle from '../driver/EditVehicle'
import { MemoryRouter } from 'react-router-dom'
import Swal from 'sweetalert2'

const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))
jest.mock('sweetalert2', () => ({ fire: jest.fn() }))

describe('EditVehicle', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch')
    localStorage.setItem('token', 'tok')
  })
  afterEach(() => {
    global.fetch.mockRestore()
    localStorage.clear()
    mockedNavigate.mockReset()
    Swal.fire.mockReset()
  })

  it('carga datos iniciales tras GET exitoso', async () => {
    const data = { vehicle: { carPlate: 'P1', capacity: 2, brand: 'B', model: 'M', color: 'C' } }
    fetch.mockResolvedValue({ ok: true, json: async () => data })
    render(<EditVehicle />, { wrapper: MemoryRouter })
    await waitFor(() => expect(screen.getByDisplayValue('P1')).toBeInTheDocument())
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
  })

  it('muestra error si intento guardar con campos vacíos', async () => {
    render(<EditVehicle />, { wrapper: MemoryRouter })
    fireEvent.click(screen.getByRole('button', { name: /Guardar Vehículo/i }))
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error', title: 'Error', text: 'Todos los campos son obligatorios.'
    })
  })
})
