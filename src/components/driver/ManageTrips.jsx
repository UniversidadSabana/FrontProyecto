import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../reusable/CustomButton';

const ManageTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://wheels-backend-rafaelsavas-projects.vercel.app/api/trips', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        navigate('/login');
      } else {
        const data = await response.json();
        setTrips(data.trips);
      }
    };

    fetchTrips();
  }, [navigate]);

  const handleEdit = (tripId) => {
    navigate(`/edit-trip/${tripId}`); // Asumiendo que tienes una ruta para editar un viaje
  };

  const handleDelete = async (tripId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTrips(trips.filter(trip => trip.tripId !== tripId)); // Actualiza la lista de viajes después de eliminar
      } else {
        console.error('Error al eliminar el viaje');
      }
    } catch (error) {
      console.error('Error al eliminar el viaje:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Gestionar Viajes</h1>

      {/* Botón para registrar un nuevo viaje */}
      <div className="mb-6">
        <CustomButton
          onClick={() => navigate('/register-trip')}
          className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3 rounded-lg"
        >
          Registra un nuevo viaje
        </CustomButton>
      </div>

      {/* Listado de viajes */}
      {trips.length > 0 ? (
        trips.map((trip) => (
          <div key={trip.tripId} className="bg-white p-4 rounded-lg mb-4 shadow-lg">
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
              {/* Botón Editar */}
              <button
                onClick={() => handleEdit(trip.tripId)}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
              >
                Editar
              </button>
              
              {/* Botón Eliminar */}
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
    </div>
  );
};

export default ManageTrips;
