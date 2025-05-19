// src/components/__tests__/ProfileSetup.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileSetup from '../profile/ProfileSetup';
import UserProvider from '../auth/UserContext';
import { MemoryRouter } from 'react-router-dom';

// Mock de useNavigate
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
    const checkbox = screen.getByRole('checkbox');  // <— sin name
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
