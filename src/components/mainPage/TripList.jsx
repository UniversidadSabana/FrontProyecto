import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../reusable/NavigationBar';
import Sidebar from '../reusable/Sidebar';
import TripCard from '../reusable/TripCard';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Para redireccionar a /login

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/trips', {
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
      }
    };

    fetchTrips();
  }, [navigate]); // Añadir navigate como dependencia

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]">
      {/* NavigationBar que abre el Sidebar */}
      <NavigationBar onMenuClick={() => setSidebarOpen(true)} />

      <div className="p-6">
        {/* Listado de viajes */}
        {trips.length > 0 ? (
          trips.map((trip) => (
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
