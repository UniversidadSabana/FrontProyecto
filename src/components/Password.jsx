import React from 'react';

const Password = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-700 font-inter m-0 p-0">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-[80%] max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Contraseña</h2>
        <form className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Ingresa contraseña"
            className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600">Al menos 1 carácter especial</p>
          <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
            Registrarte
          </button>
        </form>
        <p className="text-center mt-4">
          Ya tienes cuenta?{' '}
          <a href="/" className="text-blue-500 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Password;
