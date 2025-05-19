import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileSetup from '../profile/ProfileSetup';
import UserProvider from '../auth/UserContext';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ProfileSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <UserProvider>
        <MemoryRouter>
          <ProfileSetup />
        </MemoryRouter>
      </UserProvider>
    );

  it('renderiza todos los campos del formulario', () => {
    setup();
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Apellido')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Id Universidad')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo institucional')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Número de contacto')).toBeInTheDocument();
  });

  it('permite alternar la casilla "Quiero ser conductor"', () => {
    setup();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('muestra errores si se envía con campos vacíos', async () => {
    setup();
    fireEvent.click(screen.getByText('Guardar Perfil'));
    expect(await screen.findByText('Todos los campos son obligatorios')).toBeInTheDocument();
  });

  it('muestra error si el correo es inválido', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Ramírez' } });
    fireEvent.change(screen.getByPlaceholderText('Id Universidad'), { target: { value: '1234' } });
    fireEvent.change(screen.getByPlaceholderText('Correo institucional'), { target: { value: 'correo@invalido' } });
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Guardar Perfil'));
    expect(await screen.findByText('Por favor ingrese un correo válido')).toBeInTheDocument();
  });

  it('muestra error si ID o contacto contienen letras', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Ramírez' } });
    fireEvent.change(screen.getByPlaceholderText('Id Universidad'), { target: { value: 'abc123' } });
    fireEvent.change(screen.getByPlaceholderText('Correo institucional'), { target: { value: 'correo@uni.edu' } });
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Guardar Perfil'));
    expect(await screen.findByText('El ID y el número de contacto deben contener solo números')).toBeInTheDocument();
  });
});