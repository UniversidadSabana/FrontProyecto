// src/components/__tests__/TripDetails.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TripDetails from '../trip/TripDetails';
import Swal from 'sweetalert2';

const mockNavigate = jest.fn();

// Mock react-router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ tripId: '123' }),
  useNavigate: () => mockNavigate,
}));

// Mock SweetAlert
jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: { fire: jest.fn(() => Promise.resolve()) },
}));

describe('TripDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirige a /login si no hay token', async () => {
    localStorage.removeItem('token');
    global.fetch = jest.fn();

    render(<TripDetails />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('muestra loader inicialmente y luego detalles del viaje', async () => {
    localStorage.setItem('token', 'abc');
    const tripData = {
      carPicture: 'car.jpg',
      initialPoint: 'Calle 100',
      finalPoint: 'Calle 200',
      hour: '08:00',
      seatsAvailable: 2,
      price: 100,
      carPlate: 'abc123',
      route: 'Autonorte',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => tripData,
    });

    const { container } = render(<TripDetails />);
    // Spinner con clase "loader" mientras loading === true
    expect(container.querySelector('.loader')).toBeInTheDocument();

    // Tras fetch, renderiza cabecera y datos
    expect(await screen.findByText('Detalles del viaje')).toBeInTheDocument();
    expect(screen.getByAltText('Vehicle')).toHaveAttribute('src', 'car.jpg');
    // Ruta completa
    expect(screen.getByText('Calle 100 → Calle 200')).toBeInTheDocument();
    expect(screen.getByText(/08:00/)).toBeInTheDocument();
    expect(screen.getByText(/2 cupos disponibles/)).toBeInTheDocument();
    expect(screen.getByText(/Tarifa: 100/)).toBeInTheDocument();
    expect(screen.getByText(/Placa: ABC123/)).toBeInTheDocument();

    // Un selector de cupos y un selector de parada inicial
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes).toHaveLength(2);
    expect(screen.getByText('Parada 1')).toBeInTheDocument();
  });

  it('permite cambiar número de cupos y genera selects de paradas', async () => {
    localStorage.setItem('token', 'abc');
    const tripData = {
      carPicture: 'car.jpg',
      initialPoint: 'Calle 100',
      finalPoint: 'Calle 200',
      hour: '08:00',
      seatsAvailable: 3,
      price: 100,
      carPlate: 'abc123',
      route: 'Autonorte',
    };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => tripData });

    render(<TripDetails />);
    await screen.findByText('Detalles del viaje');

    const comboboxes = screen.getAllByRole('combobox');
    const seatSelect = comboboxes[0];
    fireEvent.change(seatSelect, { target: { value: '3' } });

    // Ahora aparecen 3 labels de parada
    expect(screen.getAllByText(/^Parada \d+$/)).toHaveLength(3);
  });

  it('navega a /trip-list al cancelar', async () => {
    localStorage.setItem('token', 'abc');
    const tripData = {
      carPicture: 'car.jpg',
      initialPoint: 'Calle 100',
      finalPoint: 'Calle 200',
      hour: '08:00',
      seatsAvailable: 3,
      price: 100,
      carPlate: 'abc123',
      route: 'Autonorte',
    };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => tripData });

    render(<TripDetails />);
    await screen.findByText('Detalles del viaje');

    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockNavigate).toHaveBeenCalledWith('/trip-list');
  });

  it('realiza reserva exitosa y muestra alerta', async () => {
    localStorage.setItem('token', 'abc');
    const tripData = {
      carPicture: 'car.jpg',
      initialPoint: 'Calle 100',
      finalPoint: 'Calle 200',
      hour: '08:00',
      seatsAvailable: 1,
      price: 100,
      carPlate: 'abc123',
      route: 'Autonorte',
    };
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => tripData })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Reserva realizada', seatsRemaining: 0 }),
      });

    render(<TripDetails />);
    await screen.findByText('Detalles del viaje');

    fireEvent.click(screen.getByText('Reservar Cupo(s)'));
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Reserva exitosa',
        text: 'Reserva realizada. Cupos restantes: 0',
        confirmButtonText: 'OK',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/trip-list');
    });
  });

  it('muestra error si fetch devuelve ok:false', async () => {
    localStorage.setItem('token', 'abc');
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    render(<TripDetails />);
    expect(await screen.findByText(/Error: Error HTTP: 500/)).toBeInTheDocument();
  });
});
