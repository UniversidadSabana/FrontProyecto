import React from "react";
import { useNavigate } from "react-router-dom";
import { GiCarWheel } from "react-icons/gi";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter px-4">
      <div className="bg-white px-6 py-10 rounded-3xl shadow-lg flex flex-col gap-8 items-center w-full max-w-3xl">
        {/* Título y descripción */}
        <div className="w-full text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            {/* Ícono de la rueda */}
            <GiCarWheel size={90} color="#1e3a8a" />
            {/* Texto GoU */}
            <p className="text-blue-800 text-5xl font-bold">GoU</p>
          </div>
          <p className="text-md md:text-lg text-gray-600 mb-3">
            Conectamos estudiantes para un transporte universitario seguro y
            eficiente. ¡Únete a nuestra comunidad hoy!
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-4 w-full text-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-orange-500 text-white py-2 px-6 rounded-lg transform transition-transform duration-300 hover:scale-105"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate("/register")} // Navegar a la página de registro
            className="bg-white text-blue-800 border border-blue-800 py-2 px-6 rounded-lg transform transition-transform duration-300 hover:scale-105"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
