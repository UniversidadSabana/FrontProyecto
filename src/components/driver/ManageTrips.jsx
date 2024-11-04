import React, { useState, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../reusable/CustomButton";
import NavigationBar from "../reusable/NavigationBar";
import Sidebar from "../reusable/Sidebar";
import Swal from "sweetalert2";
import { useDriver } from "./DriverContext";

const ManageTrips = () => {
  const [trips, setTrips] = useState([]); // Valor inicial como arreglo vacío
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDriver, setIsDriver } = useDriver();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://wheels-backend-rafaelsavas-projects.vercel.app/api/my-trips",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          setIsDriver(false)
          Swal.fire({
            title: "No eres conductor",
            text: "Redirigiendo a la lista de viajes...",
            icon: "error",
            showConfirmButton: false,
            timer: 2000, // Esperar 2 segundos antes de redirigir
          }).then(() => {
            navigate("/trip-list"); // Redirigir después de la alerta
          });
        } else {
          const data = await response.json();
          setTrips(data.trips || []); // Asigna un arreglo vacío si no hay datos
        }
      } catch (error) {
        console.error("Error al obtener los viajes:", error);
        setTrips([]); // Asegura que `trips` sea un arreglo en caso de error
      }
    };

    fetchTrips();
  }, [navigate]);



  const handleDelete = async (tripId) => {
    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/${tripId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setTrips(trips.filter((trip) => trip.tripId !== tripId));

          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: "El viaje ha sido eliminado exitosamente.",
            confirmButtonText: "OK",
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: errorData.error || "Ocurrió un error al intentar eliminar el viaje.",
          });
        }
      } catch (error) {
        console.error("Error al eliminar el viaje:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: "Hubo un problema de conexión o un error inesperado.",
        });
      }
    }
  };

  return (
    <>
      <NavigationBar
        className="w-screen"
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-white mb-6">Gestionar Viajes</h1>
          <div>
            <div className="flex items-center">
              <span className="text-white mr-3">Modo Pasajero</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDriver}
                  onChange={() => setIsDriver(!isDriver)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 relative">
                  <span
                    className={`absolute left-1 top-1 h-4 w-4 rounded-full transition-transform ${
                      isDriver ? "bg-white" : "bg-gray-500"
                    } ${isDriver ? "transform translate-x-5" : ""}`}
                  ></span>
                </div>
                <span className="ml-3 text-sm font-medium text-white">
                  Modo Conductor
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <CustomButton
            onClick={() => navigate("/register-trip")}
            className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3 rounded-lg"
          >
            Registra un nuevo viaje
          </CustomButton>
        </div>

        {trips.length > 0 ? (
          trips.map((trip) => (
            <div
              key={trip.tripId}
              className="bg-white p-4 rounded-lg mb-4 shadow-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-blue-900 font-semibold">
                    Inicio: {trip.initialPoint}
                  </p>
                  <p className="text-blue-900 font-semibold">
                    Fin: {trip.endPoint}
                  </p>
                  <p className="text-gray-700">Ruta: {trip.route}</p>
                  <p className="text-gray-700">Cupos: {trip.seatsAvailable}</p>
                  <p className="text-gray-700">Tarifa: {trip.price}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(trip.tripId)}
                  className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(trip.tripId)}
                  className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center">No tienes viajes registrados.</p>
        )}
        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} isDriver={true} />}
      </div>
    </>
  );
};

export default ManageTrips;
