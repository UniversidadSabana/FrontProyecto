import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddVehicle from '../profile/AddVehicle';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../auth/UserContext', () => ({
  useUser: () => ({ user: { id: '1' } })
}));

describe('AddVehicle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <AddVehicle />
      </BrowserRouter>
    );

  it('renderiza todos los campos y botones del formulario', () => {
    setup();
    expect(screen.getByPlaceholderText('Placa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Marca')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Modelo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Color')).toBeInTheDocument();
    expect(screen.getByLabelText('Capacidad')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Guardar Vehículo')).toBeInTheDocument();
  });

  it('muestra error si intento guardar sin completar todos los campos', () => {
    setup();
    fireEvent.click(screen.getByText('Guardar Vehículo'));
    expect(screen.getByText('Todos los campos son obligatorios')).toBeInTheDocument();
  });

  it('navega a /trip-list al hacer click en Cancelar', () => {
    setup();
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockNavigate).toHaveBeenCalledWith('/trip-list');
  });

  it('actualiza valores del formulario correctamente', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Placa'), { target: { value: 'ABC123' } });
    fireEvent.change(screen.getByPlaceholderText('Marca'), { target: { value: 'Mazda' } });
    fireEvent.change(screen.getByPlaceholderText('Modelo'), { target: { value: '2020' } });
    fireEvent.change(screen.getByPlaceholderText('Color'), { target: { value: 'Rojo' } });
    fireEvent.change(screen.getByLabelText('Capacidad'), { target: { value: 4 } });

    expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mazda')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2020')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rojo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
  });
});