// src/components/__tests__/AddVehicle.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AddVehicle from '../profile/AddVehicle';
import { BrowserRouter } from 'react-router-dom';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock minimal de useUser para tener siempre un user.id y evitar redirect al login
jest.mock('../auth/UserContext', () => ({
  useUser: () => ({ user: { id: '1' } }),
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
    // Inputs de texto :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
    expect(screen.getByPlaceholderText('Placa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Marca')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Modelo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Color')).toBeInTheDocument();
    // Input numérico por label
    expect(screen.getByLabelText('Capacidad')).toBeInTheDocument();
    // Botones
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
});
