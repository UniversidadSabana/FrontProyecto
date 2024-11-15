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

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      Swal.fire("Error", "No estás autenticado. Por favor inicia sesión.", "error");
      navigate("/login");
      return;
    }

    const tripData = {
      initialPoint,
      finalPoint,
      route,
      hour: departureTime,  // Cambia "departureTime" a "hour" para coincidir con el backend
      seats: parseInt(seatsAvailable, 10),  // Cambia "seatsAvailable" a "seats"
      price: parseFloat(price)  // Asegúrate de que "price" sea un número
    };

    try {
      const response = await fetch("https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
      });

      if (response.status === 201) {
        // Muestra una alerta de éxito y redirige a la página de gestión de viajes
        const responseData = await response.json();
        Swal.fire("Éxito", responseData.message, "success");
        navigate("/manage-trips");
      } else {
        // Muestra un error en caso de que la solicitud falle
        const errorData = await response.json();
        Swal.fire("Error", errorData.message || "No se pudo registrar el viaje", "error");
      }
    } catch (error) {
      console.error("Error al registrar el viaje:", error);
      Swal.fire("Error", "Ocurrió un error al intentar registrar el viaje", "error");
    }
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
            <select
              className="w-full p-2  border rounded-lg bg-white"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
            >
              <option value="">Selecciona una ruta</option>
              <option value="Boyaca">Boyacá</option>
              <option value="Autonorte">Autonorte</option>
              <option value="Novena">Novena</option>
              <option value="Suba">Suba</option>
            </select>
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
