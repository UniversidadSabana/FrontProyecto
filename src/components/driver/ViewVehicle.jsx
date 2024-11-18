import React, { useEffect, useState } from 'react';
import CustomButton from '../reusable/CustomButton';
import { useNavigate } from 'react-router-dom';

const ViewVehicle = () => {
  const [vehicle, setVehicle] = useState(null); // Estado para almacenar la información del vehículo
  const [loading, setLoading] = useState(true); // Estado para manejar el cargando
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('https://wheels-backend-rafaelsavas-projects.vercel.app/api/vehicle', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            const errorMessage = await response.text(); // Capturar el mensaje de error del backend
            console.error('Error en la respuesta del servidor:', errorMessage);
            throw new Error('No se pudo obtener la información del vehículo.');
          }
      
          const data = await response.json(); // Extraer los datos JSON
          console.log('Datos del vehículo recibidos:', data); // Para depuración
          setVehicle(data.vehicle); // Extraer y guardar SOLO la propiedad "vehicle"
        } catch (error) {
          console.error('Error al obtener la información del vehículo:', error);
          navigate('/trip-list'); // Redirigir al usuario si ocurre un error
        } finally {
          setLoading(false); // Desactivar el estado de carga
        }
      };
      
      
    fetchVehicle();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white">
        <p>Cargando la información del vehículo...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white">
        <p>No se encontró información del vehículo.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20 h-[screen] bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter">
      <div className="bg-white px-10 py-14 rounded-3xl shadow-lg w-[80%] max-w-3xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-5 text-center">Vehículo Registrado</h2>

        <form className="flex flex-col gap-4">
          {/* Foto del vehículo */}
          <div className="relative mb-5">
            <label className="block text-sm font-medium text-gray-700">Foto del vehículo actual</label>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {vehicle.picture ? (
                <img src={vehicle.picture} alt="Vehículo" className="w-full h-full object-cover" />
              ) : (
                <p className="text-blue-500">No hay foto disponible</p>
              )}
            </div>
          </div>

          {/* Información del vehículo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Placa</label>
            <input
              type="text"
              value={vehicle.carPlate}
              readOnly
              className="border rounded-lg py-2 px-4 focus:outline-none w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacidad</label>
            <input
              type="text"
              value={vehicle.capacity}
              readOnly
              className="border rounded-lg py-2 px-4 focus:outline-none w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <input
              type="text"
              value={vehicle.brand}
              readOnly
              className="border rounded-lg py-2 px-4 focus:outline-none w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Modelo</label>
            <input
              type="text"
              value={vehicle.model}
              readOnly
              className="border rounded-lg py-2 px-4 focus:outline-none w-full bg-gray-100"
            />
          </div>

          {/* Foto del SOAT */}
          <div className="relative mb-5">
            <label className="block text-sm font-medium text-gray-700">Foto del SOAT actual</label>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {vehicle.soat ? (
                <img src={vehicle.soat} alt="SOAT" className="w-full h-full object-cover" />
              ) : (
                <p className="text-blue-500">No hay foto disponible</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-6">
            <CustomButton
              onClick={() => navigate('/manage-trips')}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Volver
            </CustomButton>
            <CustomButton
              onClick={() => navigate('/edit-vehicle')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Editar Vehículo
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewVehicle;
