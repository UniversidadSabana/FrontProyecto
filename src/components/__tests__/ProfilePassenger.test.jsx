// src/components/__tests__/ProfilePassenger.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePassenger from '../profile/ProfilePassenger';
import UserProvider from '../auth/UserContext';
import { MemoryRouter } from 'react-router-dom';

// mock de useNavigate…
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

    // Esperamos a que el input tenga realmente el valor "Juan"
    const nombreInput = await screen.findByDisplayValue('Juan');
    expect(nombreInput).toHaveAttribute('placeholder', 'Nombre');

    // Y lo mismo para los otros campos
    const apellidoInput = screen.getByDisplayValue('Pérez');
    expect(apellidoInput).toHaveAttribute('placeholder', 'Apellido');

    const contactoInput = screen.getByDisplayValue('1234567890');
    expect(contactoInput).toHaveAttribute('placeholder', 'Número de contacto');
  });

  it('muestra error si intento guardar con campos vacíos', async () => {
    setup();
    // esperamos a que el nombre esté cargado
    await screen.findByDisplayValue('Juan');
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(await screen.findByText('Todos los campos son obligatorios')).toBeInTheDocument();
  });
});
