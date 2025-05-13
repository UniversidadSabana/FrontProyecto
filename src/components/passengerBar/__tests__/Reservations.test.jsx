// src/components/passengerBar/__tests__/Reservations.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyReservations from '../Reservations';
import Swal from 'sweetalert2';

// Mock de react-router-dom para el useNavigate (no vamos a testear navegación aquí)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock de sweetalert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

beforeAll(() => {
  // Stub para evitar el error de JSDOM en <form>
  window.HTMLFormElement.prototype.submit = jest.fn();
});

describe('MyReservations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock básico de localStorage.getItem
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
  });

  test('1) muestra mensaje si no hay reservas', async () => {
    // fetch devuelve empty list
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reservations: [] }),
    });

    render(<MyReservations />);
    expect(
      await screen.findByText('No tienes reservas')
    ).toBeInTheDocument();
  });

  test('2) renderiza reservas tras fetch', async () => {
    const mockReservations = [
      {
        tripId: 'abc',
        initialPoint: 'Origen',
        finalPoint: 'Destino',
        route: 'Autonorte',
        seatsReserved: 2,
        price: 50,
      },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reservations: mockReservations }),
    });

    render(<MyReservations />);

    // Esperamos a que cargue el texto "Inicio:" y los datos
    expect(await screen.findByText(/Inicio:/)).toBeInTheDocument();
    expect(screen.getByText('Origen')).toBeInTheDocument();
    expect(screen.getByText('Destino')).toBeInTheDocument();
    expect(screen.getByText('Autonorte')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  test('3) handleModify abre modal con datos correctos', async () => {
    const reservation = {
      tripId: 'xyz',
      initialPoint: 'A',
      finalPoint: 'B',
      route: 'Novena',
      seatsReserved: 3,
      price: 75,
      stops: ['s1', 's2', 's3'],
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reservations: [reservation] }),
    });

    render(<MyReservations />);

    // Click en el botón "Editar"
    fireEvent.click(await screen.findByText('Editar'));

    // Se abre el modal
    expect(await screen.findByText('Editar Viaje')).toBeInTheDocument();

    // Input de cupos muestra el valor correcto
    const inputCupos = screen.getByLabelText('Número de cupos');
    expect(inputCupos).toHaveValue(3);

    // Debe haber tantos <select> como paradas
    expect(screen.getAllByRole('combobox')).toHaveLength(3);
  });

  test('4) handleCloseModal cierra el modal', async () => {
    const reservation = {
      tripId: 'xyz',
      initialPoint: 'A',
      finalPoint: 'B',
      route: 'Novena',
      seatsReserved: 2,
      price: 75,
      stops: ['s1', 's2'],
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reservations: [reservation] }),
    });

    render(<MyReservations />);
    fireEvent.click(await screen.findByText('Editar'));

    // Click en "Volver"
    fireEvent.click(screen.getByText('Volver'));

    await waitFor(() =>
      expect(screen.queryByText('Editar Viaje')).not.toBeInTheDocument()
    );
  });

  test('5) handleSaveChanges edita y cierra modal correctamente', async () => {
    const reservation = {
      tripId: '123',
      initialPoint: 'A',
      finalPoint: 'B',
      route: 'Novena',
      seatsReserved: 2,
      price: 75,
      stops: ['s1', 's2'],
    };
    // 1ª llamada: GET reservas
    // 2ª llamada: PUT save changes
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ reservations: [reservation] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Actualizado', seatsRemaining: 5 }) });

    // Primer modal: confirmación de edición (no hace nada)
    // Segundo modal: success tras guardar
    Swal.fire
      .mockResolvedValueOnce({})  
      .mockResolvedValueOnce({});

    render(<MyReservations />);
    fireEvent.click(await screen.findByText('Editar'));

    // Cambiamos el número de cupos
    const input = screen.getByLabelText('Número de cupos');
    fireEvent.change(input, { target: { value: '4' } });

    // Guardar cambios
    fireEvent.click(screen.getByText('Guardar Cambios'));

    await waitFor(() =>
      expect(screen.queryByText('Editar Viaje')).not.toBeInTheDocument()
    );
  });

  test('6) handleDelete cancela reserva y la elimina de la lista', async () => {
    const reservation = {
      tripId: 'del1',
      initialPoint: 'X',
      finalPoint: 'Y',
      route: 'Suba',
      seatsReserved: 1,
      price: 20,
    };
    // 1ª llamada: GET reservas
    // 2ª llamada: DELETE reserva
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ reservations: [reservation] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ seatsRemaining: 10 }) });

    // Confirmación del diálogo
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    render(<MyReservations />);
    fireEvent.click(await screen.findByText('Eliminar'));

    // Tras el borrado, ya no hay reservas
    await waitFor(() =>
      expect(screen.getByText('No tienes reservas')).toBeInTheDocument()
    );
  });
});
