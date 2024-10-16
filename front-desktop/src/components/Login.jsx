import React from 'react';

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-700 font-inter m-0 p-0">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-[80%] max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Inicia Sesion</h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo Institucional"
            className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
            Iniciar Sesión
          </button>
        </form>
        <p className="text-center mt-4">
          No tienes cuenta?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
