import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../reusable/CustomButton";
import NavigationBar from "../reusable/NavigationBar";
import Sidebar from "../reusable/Sidebar";
import { MapPin, Users, DollarSign, Trash, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import '../reusable/loader.css';

const ManageTrips = () => {
  const [trips, setTrips] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDriver, setIsDriver] = useState(true);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState({
    initialPoint: "",
    finalPoint: "",
    route: "",
    seats: "",
    price: ""
  });
  const [departureTime, setDepartureTime] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true); 
      const response = await fetch(
        "https://wheels-backend-rafaelsavas-projects.vercel.app/api/my-trips",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        const result = await Swal.fire({
          title: "No eres conductor",
          text: "¿Quieres ser conductor?",
          icon: "info",
          confirmButtonText: "Sí",
          showCancelButton: true,
          cancelButtonText: "No",
        });

        if (result.isConfirmed) {
          navigate("/add-vehicle");
        } else {
          navigate("/trip-list");
        }

        setIsDriver(false);
      } else {
        const data = await response.json();
        setTrips(data.trips || []);
      }
      setLoading(false);
    };

    if (!hasFetched.current) {
      fetchTrips();
      hasFetched.current = true;
    }
  }, [navigate]);

  const handleEdit = (trip) => {
    // Carga los datos del viaje seleccionado en el formulario de edición
    setEditingTrip(trip.tripId);
    setEditForm({
      initialPoint: trip.initialPoint,
      finalPoint: trip.finalPoint,
      route: trip.route,
      seats: trip.seats.toString(), // Asegúrate de que los valores numéricos sean strings para los inputs
      price: trip.price.toString(),
    });
    setDepartureTime(trip.hour); // Carga la hora de salida
  };
  
  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("No se encontró un token de autenticación.");
      }
  
      const response = await fetch(
        `https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/${editingTrip}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editForm// Incluye la hora de salida actualizada
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el viaje.");
      }
  
      const data = await response.json();
  
      // Actualiza la lista de viajes local
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.tripId === editingTrip ? data.updatedTrip : trip
        )
      );
  
      // Cierra el formulario de edición
      setEditingTrip(null);
  
      await Swal.fire({
        icon: "success",
        title: "El viaje ha sido actualizado exitosamente.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al actualizar el viaje:", error);
  
      await Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.message || "Hubo un problema al intentar actualizar el viaje.",
      });
    }
  };
  
  const handleDelete = async (tripId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción cancelará tu viaje creado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/${tripId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al cancelar el viaje.");
        }

        setTrips((prevTrips) =>
          prevTrips.filter((trip) => trip.tripId !== tripId)
        );

        await Swal.fire({
          icon: "success",
          title: "Viaje cancelado exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error al cancelar el viaje:", error);

        Swal.fire({
          icon: "error",
          title: "Error al cancelar",
          text: "Hubo un problema al intentar cancelar el viaje.",
        });
      }
    }
  };

  const toggleDriverMode = () => {
    setIsDriver(!isDriver);
    if (isDriver) {
      navigate("/trip-list");
    }
  };

  return (
    <>
      <NavigationBar
        className="w-screen"
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className={`min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6 ${editingTrip ? "opacity-50" : ""}`}>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-white mb-6">Gestionar Viajes</h1>
          <div>
            <div className="flex items-center">
              <span className="text-white mr-3">Modo Pasajero</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDriver}
                  onChange={toggleDriverMode}
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          trips.length > 0 ? (
            trips.map((trip) => (
              <div key={trip.tripId} className="bg-white p-4 rounded-lg mb-4 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="flex items-center text-blue-900 font-semibold">
                      <MapPin className="mr-2 mb-2" /> Inicio: {trip.initialPoint}
                    </p>
                    <p className="flex items-center text-blue-900 font-semibold">
                      <MapPin className="mr-2 mb-2" /> Fin: {trip.finalPoint}
                    </p>
                    <p className="text-gray-700 mb-2">Ruta: {trip.route}</p>
                    <p className="flex items-center text-gray-700 mb-2">
                      <Users className="mr-2" /> Cupos: {trip.seats} / Reservados: {trip.reservations}
                    </p>
                    <p className="flex items-center text-gray-700 mb-2">
                      <DollarSign className="mr-2" /> Tarifa: {trip.price}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(trip)}
                    className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    <Edit3 className="mr-2" /> Editar
                  </button>

                  <button
                    onClick={() => handleDelete(trip.tripId)}
                    className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    <Trash className="mr-2" /> Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No tienes viajes registrados.</p>
          )
        )}
        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} isDriver={true} />}
      </div>
      {editingTrip && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">Editar Viaje</h2>
            <form>
              <input
                type="text"
                placeholder="Punto de inicio"
                value={editForm.initialPoint}
                onChange={(e) =>
                  setEditForm({ ...editForm, initialPoint: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="text"
                placeholder="Punto final"
                value={editForm.finalPoint}
                onChange={(e) =>
                  setEditForm({ ...editForm, finalPoint: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
              />
              <div>
                <select
                  className="w-full p-2 border rounded-lg bg-white mb-4"
                  value={editForm.route} // Corregido para usar editForm.route en lugar de trip.route
                  onChange={(e) => setEditForm({ ...editForm, route: e.target.value })}
                >
                  <option value="">Selecciona una ruta</option>
                  <option value="Boyaca">Boyacá</option>
                  <option value="Autonorte">Autonorte</option>
                  <option value="Novena">Novena</option>
                  <option value="Suba">Suba</option>
                </select>
              </div>
              <input
                type="number"
                placeholder="Cupos"
                value={editForm.seats}
                onChange={(e) =>
                  setEditForm({ ...editForm, seats: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="number"
                placeholder="Tarifa"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-between mt-6 space-x-4 w-full">
                <CustomButton
                  onClick={() => setEditingTrip(null)}
                  className="bg-white text-orange-500 border border-orange-500 hover:bg-gray-100 text-center py-2 rounded-lg flex-1"
                >
                  Volver
                </CustomButton>
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg flex-1"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageTrips;
