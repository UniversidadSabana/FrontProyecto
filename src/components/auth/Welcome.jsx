import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'lucide-react'; // Importa el icono desde Lucide

const Welcome = () => {
  const navigate = useNavigate();

  console.log("Componente Welcome se ha montado");
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter px-4">
      <div className="bg-white px-6 py-10 rounded-3xl shadow-lg flex flex-col gap-8 items-center w-full max-w-3xl">
        {/* Título y descripción */}
        <div className="w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Bienvenido a Wheels</h1>
          <p className="text-md md:text-lg text-gray-600 mb-6">
            Conectamos estudiantes para un transporte universitario seguro y eficiente. ¡Únete a nuestra comunidad hoy!
          </p>
        </div>

        {/* Logo */}
        <div className="w-full flex justify-center items-center bg-gray-200 h-48 rounded-lg">
          <Image size={80} />
          <p className="text-gray-600 ml-4 hidden sm:block">LOGO POR DEFINIR</p>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-4 w-full text-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-orange-500 text-white py-2 px-6 rounded-lg transform transition-transform duration-300 hover:scale-110"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate('/register')} // Navegar a la página de registro
            className="bg-white text-blue-800 border border-blue-800 py-2 px-6 rounded-lg transform transition-transform duration-300 hover:scale-110"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
