import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../reusable/AuthLayout';
import CustomInput from '../reusable/CustomInput';
import CustomButton from '../reusable/CustomButton';
import LinkText from '../reusable/LinkText';
import { useUser } from './UserContext';

const Register = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mail, setMail] = useState('');
  const [emailError, setEmailError] = useState(''); // Estado para el mensaje de error
  const [error, setError] = useState(''); // Estado para manejar los errores de validación

  const navigate = useNavigate();

  // Función para validar el formato del correo electrónico
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para formato de email
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Verificar si los campos están vacíos
    if (!name || !lastName || !mail) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar el correo electrónico
    if (!validateEmail(mail)) {
      setEmailError('Por favor ingrese un correo válido');
      return;
    }

    // Si todo está bien, actualizamos el usuario en el contexto
    setUser({
      ...user,
      name,
      lastName,
      mail,
    });

    navigate('/password');
  };

  return (
    <AuthLayout title="Regístrate con tu email institucional">
      {/* onSubmit se activará al hacer clic en el botón o al presionar Enter */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <CustomInput
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <CustomInput
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <CustomInput
          type="email"
          placeholder="Email Institucional"
          value={mail}
          onChange={(e) => {
            setMail(e.target.value);
            setEmailError(''); // Limpiar el mensaje de error al escribir
            setError(''); // Limpiar el mensaje de error al escribir
          }}
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>} {/* Mensaje de error para email */}
        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Mensaje de error para campos vacíos */}
        
        {/* Botón de tipo submit, necesario para que el enter funcione */}
        <CustomButton type="submit" className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600">
          Registrarse
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

export default Register;
