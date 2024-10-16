import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para la navegación

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-blue-700 font-inter m-0 p-0">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-[80%] max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Registrate con tu email institucional</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Apellido"
            className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email Institucional"
            className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => navigate('/password')} // Navegar a la pantalla de contraseña
            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
          >
            Registrarse
          </button>
        </form>
        <p className="text-center mt-4">
          Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

