import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../reusable/NavigationBar';
import Sidebar from '../reusable/Sidebar';
import TripCard from '../reusable/TripCard';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minSeats, setMinSeats] = useState('');
  const [departurePoint, setDeparturePoint] = useState('');
  const navigate = useNavigate(); // Para redireccionar a /login

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
        // Token inválido o no autorizado
        navigate('/login');
      } else {
        const data = await response.json();
        setTrips(data.trips);
        setFilteredTrips(data.trips); // Inicialmente, no hay filtros aplicados
      }
    };

    fetchTrips();
  }, [navigate]); // Añadir navigate como dependencia

  // Función para filtrar los viajes según los valores seleccionados
  const filterTrips = () => {
    const filtered = trips.filter(trip => {
      const matchSeats = minSeats === '' || trip.seatsAvailable >= parseInt(minSeats);
      const matchDeparture = departurePoint === '' || trip.initialPoint.toLowerCase().includes(departurePoint.toLowerCase());
      return matchSeats && matchDeparture;
    });
    setFilteredTrips(filtered);
  };

  // Aplicar los filtros cada vez que cambien los valores
  useEffect(() => {
    filterTrips();
  }, [minSeats, departurePoint, trips]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]">
      {/* NavigationBar que abre el Sidebar */}
      <NavigationBar onMenuClick={() => setSidebarOpen(true)} />

      <div className="p-6">
        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg mb-6 shadow-lg">
          <h2 className="text-blue-900 text-2xl font-semibold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Filtro de cupos mínimos */}
            <div>
              <label className="block text-gray-700 mb-2">Cupos mínimos</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={minSeats}
                onChange={e => setMinSeats(e.target.value)}
              >
                <option value="">Selecciona cupos</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            {/* Filtro de puntos de salida */}
            <div>
              <label className="block text-gray-700 mb-2">Puntos de salida</label>
              <input
                type="text"
                placeholder="Buscar puntos de salida"
                className="w-full p-2 border rounded-lg"
                value={departurePoint}
                onChange={e => setDeparturePoint(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Listado de viajes */}
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <TripCard key={trip.tripId} trip={trip} />
          ))
        ) : (
          <p>No hay viajes disponibles</p>
        )}

        {/* Sidebar */}
        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      </div>
    </div>
  );
};

export default TripList;
