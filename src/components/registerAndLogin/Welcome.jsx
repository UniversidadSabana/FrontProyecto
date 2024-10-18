import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'lucide-react'; // Importa el icono desde Lucide

const Welcome = () => {
    const navigate = useNavigate();
    return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter">
      <div className="bg-white px-10 py-16 rounded-3xl shadow-lg flex gap-10 items-center w-[50%] max-w-3xl">
        {/* Dividiendo el espacio en dos mitades */}
        <div className="w-1/2 text-left">
          {/* Textos y botones a la izquierda */}
          <h1 className="text-5xl font-bold text-blue-800 mb-4">Bienvenido a Wheels</h1>
          <p className="text-lg text-gray-600 mb-6">
            Conectamos estudiantes para un transporte universitario seguro y eficiente. ¡Únete a nuestra comunidad hoy!
          </p>
          <div className="flex flex-col gap-4">
            <button 
             onClick={() => navigate('/login')}
            className="bg-orange-500 text-white py-2 px-6 rounded-lg transform transition-transform duration-300 hover:scale-110">
              Iniciar Sesión
            </button>
            <button
            onClick={() => navigate('/register')} // Navegar a la página de registro            
            className="bg-white text-blue-800 border border-blue-800 py-2 px-6 rounded-lg transform transition-transform duration-300 hover:scale-110">
              Registrarse
            </button>
          </div>
        </div>

        {/* Logo a la derecha */}
        <div className="w-1/2 flex justify-center items-center bg-gray-200 h-48 rounded-lg">
          <Image size={100} />
          <p className="text-gray-600 ml-4">LOGO POR DEFINIR</p>
        </div>
      </div>
    </div>
    );
  };

export default Welcome;

