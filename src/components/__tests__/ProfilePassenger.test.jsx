import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePassenger from '../profile/ProfilePassenger';
import UserProvider from '../auth/UserContext';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ProfilePassenger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'fake-token');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        name: 'Juan',
        lastName: 'Pérez',
        contactNumber: '1234567890',
        image: 'avatar.jpg',
      }),
    });
  });

  const setup = () =>
    render(
      <UserProvider>
        <MemoryRouter>
          <ProfilePassenger />
        </MemoryRouter>
      </UserProvider>
    );

  it('renderiza los inputs con los datos traídos del backend', async () => {
    setup();
    expect(await screen.findByDisplayValue('Juan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
  });

  it('muestra error si intento guardar con campos vacíos', async () => {
    setup();
    await screen.findByDisplayValue('Juan');
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(await screen.findByText('Todos los campos son obligatorios')).toBeInTheDocument();
  });

  it('valida si el número de contacto tiene más de 10 dígitos', async () => {
    setup();
    await screen.findByDisplayValue('Juan');
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), { target: { value: '123456789012' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(await screen.findByText('El número de contacto debe tener hasta 10 dígitos')).toBeInTheDocument();
  });

  it('valida si el número de contacto contiene letras', async () => {
    setup();
    await screen.findByDisplayValue('Juan');
    fireEvent.change(screen.getByPlaceholderText('Número de contacto'), { target: { value: '123abc456' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(await screen.findByText('El ID y el número de contacto deben contener solo números')).toBeInTheDocument();
  });
});