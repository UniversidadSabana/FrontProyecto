import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../reusable/CustomButton";
import Swal from "sweetalert2";

const RegisterTrip = () => {
  const [initialPoint, setInitialPoint] = useState("");
  const [finalPoint, setFinalPoint] = useState("");
  const [route, setRoute] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    // Aquí iría la lógica para enviar los datos al backend
    navigate("/manage-trips"); // Redirigir a "Gestionar Viajes" después del registro
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Registrar un viaje</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Detalles del viaje</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Punto de inicio</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={initialPoint}
              onChange={(e) => setInitialPoint(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Punto Final</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={finalPoint}
              onChange={(e) => setFinalPoint(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Ruta</label>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Hora de salida</label>
            <input
              type="time"
              className="w-full p-2 border rounded-lg"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Puestos disponibles</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              value={seatsAvailable}
              onChange={(e) => setSeatsAvailable(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Tarifa por pasajero</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-6">
            <CustomButton
              onClick={() => navigate("/manage-trips")}
              className="bg-white text-orange-500 border border-orange-500 hover:bg-gray-100 text-center px-6 py-2 rounded-lg"
            >
              Volver
            </CustomButton>
            <CustomButton
              onClick={handleRegister}
              className="bg-orange-500 hover:bg-orange-600 text-white text-center px-6 py-2 rounded-lg"
            >
              Registrar Viaje
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTrip;
