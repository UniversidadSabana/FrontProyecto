import React from 'react';
import AuthLayout from './AuthLayout'; // Asegúrate de usar la ruta correcta según tu estructura de carpetas
import CustomInput from './CustomInput'; // Componente reutilizable de input
import CustomButton from './CustomButton'; // Componente reutilizable de botón
import LinkText from './LinkText'; // Componente reutilizable de enlace

const Login = () => {
  return (
    <AuthLayout title="Inicia Sesión">
      <form className="flex flex-col gap-4">
        <CustomInput
          type="email"
          placeholder="Correo Institucional"
        />
        <CustomInput
          type="password"
          placeholder="Contraseña"
        />
        <CustomButton type="submit" className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600">
          Iniciar Sesión
        </CustomButton>
      </form>
      <p className="text-center mt-4">
        No tienes cuenta?{' '}
        <LinkText href="/register">
          Regístrate
        </LinkText>
      </p>
    </AuthLayout>
  );
};

export default Login;
