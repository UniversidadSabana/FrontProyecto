import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import LinkText from './LinkText';
import { useUser } from './UserContext';

const Password = () => {
  const { user, setUser } = useUser();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Verificar si los campos están vacíos
    if (!password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar la contraseña
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una letra, un número y un carácter especial.');
      return;
    }

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Si todo está bien, actualizamos el usuario en el contexto
    setUser({
      ...user,
      password,
    });

    navigate('/profile-setup');
  };

  return (
    <AuthLayout title="Contraseña">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <CustomInput
          type="password"
          placeholder="Ingresa contraseña"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(''); // Limpiar el mensaje de error al escribir
          }}
        />
        <CustomInput
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError(''); // Limpiar el mensaje de error al escribir
          }}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Mensaje de error */}
        
        <CustomButton type="submit" className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600">
          Registrarte
        </CustomButton>
      </form>
      <p className="text-center mt-4">
        ¿Ya tienes cuenta?{' '}
        <LinkText href="/login">
          Inicia sesión
        </LinkText>
      </p>
    </AuthLayout>
  );
};

export default Password;
