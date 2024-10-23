import React, { useState } from 'react';
import { Camera } from 'lucide-react'; // Importamos el ícono de cámara desde lucide-react

const ProfileSetup = () => {
  const [selectedImage, setSelectedImage] = useState(null); // Estado para almacenar la imagen seleccionada

  // Función para manejar el cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Guardamos la imagen en el estado
      };
      reader.readAsDataURL(file); // Leemos el archivo como URL de datos
      
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-700 font-inter m-0 p-0">
      {/* Ajustamos el ancho del contenedor */}
      <div className="bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">Configura tu perfil</h2>
        
        {/* Simulación de una foto de perfil con icono para cargar */}
        <div className="flex justify-center mb-6 relative">
          {/* Círculo grande gris para la foto */}
          <div className="w-32 h-32 bg-gray-200 rounded-full relative flex items-center justify-center overflow-hidden">
            {/* Si hay una imagen seleccionada, la mostramos */}
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Perfil" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <p className="text-gray-500">Sin imagen</p>
            )}
          </div>

          {/* Círculo naranja con el ícono de cámara, posicionado cerca del borde del círculo gris */}
          <div className="absolute bottom-[-4px] right-[-4px] bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center z-10">
            {/* Ícono de cámara */}
            <label htmlFor="upload-photo" className="cursor-pointer">
              <input
                id="upload-photo"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange} // Manejar el cambio de imagen
              />
              <Camera className="h-5 w-5 text-white" /> {/* Icono de cámara */}
            </label>
          </div>
        </div>

        {/* Contenedor redondeado para los campos */}
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Apellido"
              className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="ID Universidad"
              className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Correo Institucional"
              className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Número de contacto"
              className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {/* Switch para seleccionar si es conductor */}
        <div className="flex items-center gap-2 mb-6">
          <input type="checkbox" id="driver" className="toggle-checkbox" />
          <label htmlFor="driver" className="text-gray-700">
            Quiero ser conductor
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between">
          <button className="bg-white text-blue-800 border-2 border-blue-800 py-2 px-6 rounded-lg">
            Registrarse
          </button>
          <button className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600">
            Guardar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
