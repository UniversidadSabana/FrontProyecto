// src/components/__tests__/Reservations.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Reservations from '../passengerBar/Reservations';
import Swal from 'sweetalert2';
import { MemoryRouter } from 'react-router-dom';

// Mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: { fire: jest.fn() }
}));

describe('Reservations Component', () => {
  const sampleReservations = [
    {
      tripId: 't1',
      initialPoint: 'A',
      finalPoint: 'B',
      route: 'Autonorte',
      seatsReserved: 2,
      price: 50,
      stops: ['Calle 100', 'Calle 106'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra "No tienes reservas" cuando la lista está vacía', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reservations: [] }),
    });

    render(
      <MemoryRouter>
        <Reservations />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No tienes reservas/i)).toBeInTheDocument();
    });
  });

  it('renderiza la lista de reservas con datos correctos', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reservations: sampleReservations }),
    });

    render(
      <MemoryRouter>
        <Reservations />
      </MemoryRouter>
    );

    // Espera que la tarjeta de reserva aparezca
    expect(await screen.findByText(/Inicio:/)).toBeInTheDocument();
    expect(screen.getAllByText('A')[0]).toBeInTheDocument(); // Usamos getAllByText en vez de getByText para evitar conflictos
    expect(screen.getByText(/Fin:/)).toBeInTheDocument();
    expect(screen.getByText(/B/)).toBeInTheDocument();
    expect(screen.getByText(/Ruta:/)).toBeInTheDocument();
    expect(screen.getByText(/Autonorte/)).toBeInTheDocument();
    expect(screen.getByText(/Cupos:/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/Tarifa:/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
    // Botones de acción
    expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Eliminar/i })).toBeInTheDocument();
  });

  it('abre modal de edición con campos prellenados', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reservations: sampleReservations }),
    });

    render(
      <MemoryRouter>
        <Reservations />
      </MemoryRouter>
    );
    await screen.findByText(/Inicio:/);

    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));

    // Modal aparece
    expect(screen.getByText(/Editar Viaje/i)).toBeInTheDocument();
    // El input de cupos muestra el valor inicial
    const seatInput = screen.getByDisplayValue('2');
    expect(seatInput).toBeInTheDocument();
    // Deben generarse dos selects de parada con opciones
    const stopSelects = screen.getAllByRole('combobox');
    expect(stopSelects).toHaveLength(2);
    // La primera parada preseleccionada
    expect(screen.getByDisplayValue('Calle 100')).toBeInTheDocument();
  });

  it('guarda cambios y actualiza la lista tras editar', async () => {
    // Primer fetch: obtener reservas
    // Segundo fetch: PUT cambios
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ reservations: sampleReservations }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Actualizado', seatsRemaining: 3 }) });

    render(
      <MemoryRouter>
        <Reservations />
      </MemoryRouter>
    );
    await screen.findByText(/Editar/i);
    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));

    // Cambiamos cupos y paradas
    fireEvent.change(screen.getByDisplayValue('2'), { target: { value: '3' } });
    const stopSelects = screen.getAllByRole('combobox');
    fireEvent.change(stopSelects[1], { target: { value: 'Calle 106' } });

    // Mock de confirmación en Swal
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    fireEvent.click(screen.getByRole('button', { name: /Guardar Cambios/i }));

    await waitFor(() => {
      // Swal de éxito
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Actualizado',
        text: 'Cupos restantes: 3',
        showConfirmButton: false,
        timer: 1500,
      });
      // Modal cerrado
      expect(screen.queryByText(/Editar Viaje/i)).not.toBeInTheDocument();
      // Nuevo valor de cupos en UI
      expect(screen.getByText(/3/)).toBeInTheDocument();
    });
  });

  it('elimina reserva tras confirmación', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ reservations: sampleReservations }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ seatsRemaining: 5 }) });

    render(
      <MemoryRouter>
        <Reservations />
      </MemoryRouter>
    );
    await screen.findByText(/Eliminar/i);

    // Confirmación de borrado
    Swal.fire
      .mockResolvedValueOnce({ isConfirmed: true }) // confirm dialog
      .mockResolvedValueOnce({});                  // success toast

    fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }));

    await waitFor(() => {
      // Reserva removida de la UI
      expect(screen.queryByText(/Inicio:/)).not.toBeInTheDocument();
      // Mensaje de éxito via Swal
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Reserva cancelada exitosamente',
        text: 'Cupos restantes: 5',
        showConfirmButton: false,
        timer: 1500,
      });
    });
  });
});
