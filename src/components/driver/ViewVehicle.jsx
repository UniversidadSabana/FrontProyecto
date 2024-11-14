import React, { useState, useEffect } from 'react';
import CustomButton from '../reusable/CustomButton';
import { useNavigate } from 'react-router-dom';

const ViewVehicle = () => {
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("https://wheels-backend-rafaelsavas-projects.vercel.app/api/vehicle", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Error: ${errorData.message}`);
          return;
        }

        const data = await response.json();
        setVehicle(data);
      } catch (err) {
        console.error("Error fetching vehicle data:", err);
        setError("Ocurrió un error al obtener la información del vehículo.");
      }
    };

    fetchVehicleData();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!vehicle) {
    return <p>Cargando información del vehículo...</p>;
  }

  return (
    <div className="flex items-center justify-center py-20 h-[screen] bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter">
      <div className="bg-white px-10 py-14 rounded-3xl shadow-lg w-[80%] max-w-3xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-5">Vehículo Registrado</h2>

        <form className="flex flex-col gap-4">
          {/* Foto del vehículo */}
          <div className="relative mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Foto del vehículo
            </label>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center overflow-hidden">
              {vehicle.picture ? (
                <img src={vehicle.picture} alt="Vehicle" className="w-full h-full object-cover" />
              ) : (
                <p className="text-blue-500">Aca va la foto del carro actual</p>
              )}
            </div>
          </div>

          {/* Datos del vehículo */}
          <label className="block text-sm font-medium text-gray-700">Placa</label>
          <input
            type="text"
            value={vehicle.carPlate}
            readOnly
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block text-sm font-medium text-gray-700">Capacidad</label>
          <input
            type="text"
            value={vehicle.capacity}
            readOnly
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block text-sm font-medium text-gray-700">Marca</label>
          <input
            type="text"
            value={vehicle.brand}
            readOnly
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block text-sm font-medium text-gray-700">Modelo</label>
          <input
            type="text"
            value={vehicle.model}
            readOnly
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="text"
            value={vehicle.color}
            readOnly
            className="w-full p-2 mb-4 border rounded"
          />

          {/* Foto del SOAT */}
          <div className="relative mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Foto del SOAT
            </label>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center overflow-hidden">
              {vehicle.soat ? (
                <img src={vehicle.soat} alt="SOAT" className="w-full h-full object-cover" />
              ) : (
                <p className="text-blue-500">Aca va la foto del SOAT actual</p>
              )}
            </div>
          </div>

          {/* Botones de Volver y Editar */}
          <div className="flex justify-between mt-6">
            <CustomButton
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Volver
            </CustomButton>
            <CustomButton
              onClick={() => navigate(`/edit-vehicle`)}
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
