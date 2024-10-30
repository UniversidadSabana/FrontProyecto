import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, User, DollarSign, Calendar } from 'lucide-react';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [seatsReserved, setSeatsReserved] = useState(1);
  const [stops, setStops] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/${tripId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setTrip(data);
      } catch (err) {
        setError(err.message);
        console.error('Error al obtener detalles del viaje:', err);
      }
    };

    fetchTripDetails();
  }, [tripId, navigate]);

  const handleReserve = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/reserve/${tripId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seatsReserved, stops }),
      });

      const result = await response.json();
      if (response.ok) {
        // Mostrar SweetAlert de reserva confirmada
        await Swal.fire({
          icon: 'success',
          title: 'Reserva exitosa',
          text: `${result.message}. Cupos restantes: ${result.seatsRemaining}`,
          confirmButtonText: 'OK'
        });
        navigate('/trip-list'); // Redirigir a la lista de viajes después de la reserva
      } else {
        throw new Error(result.error || 'Error en la reserva');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error en la reserva:', err);
    }
  };

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  if (!trip) {
    return <p>Cargando detalles del viaje...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Detalles del viaje</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <img src={trip.carPicture} alt="Vehicle" className="w-full h-64 object-cover rounded-lg" />
        </div>

        <h3 className="text-2xl font-bold text-blue-800 mb-2">Información del viaje</h3>
        <div className="text-gray-700 mb-2">
          <MapPin className="inline-block mr-2" /> {trip.initialPoint} &rarr; {trip.finalPoint}
        </div>
        <div className="text-gray-700 mb-2">
          <Calendar className="inline-block mr-2" /> Salida: {trip.hour}
        </div>
        <div className="text-gray-700 mb-2">
          <User className="inline-block mr-2" /> {trip.seatsAvailable} cupos disponibles
        </div>
        <div className="text-gray-700 mb-2">
          <DollarSign className="inline-block mr-2" /> Tarifa: {trip.price}
        </div>
        <div className="text-gray-700 mb-2">
          <MapPin className="inline-block mr-2" /> Ruta: {trip.route}
        </div>

        <h3 className="text-2xl font-bold text-blue-800 mt-6 mb-2">Reserva tu Cupo</h3>
        <form className="space-y-4" onSubmit={handleReserve}>
          <div>
            <label className="block text-gray-700">Número de cupos</label>
            <select className="w-full p-2 border rounded-lg" value={seatsReserved} onChange={(e) => setSeatsReserved(parseInt(e.target.value))}>
              {[...Array(trip.seatsAvailable).keys()].map(n => (
                <option key={n + 1} value={n + 1}>{n + 1}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Paradas para los cupos</label>
            <input
              type="text"
              placeholder="Especifica paradas separadas por comas (Ej: Calle 142, Toberín)"
              className="w-full p-2 border rounded-lg"
              value={stops.join(', ')}
              onChange={(e) => setStops(e.target.value.split(',').map(stop => stop.trim()))}
            />
          </div>

          <div className="flex justify-between">
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded mt-4 hover:bg-orange-600 w-[40%]">
              Reservar Cupo(s)
            </button>
            <button type="button" className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700 w-[40%]" onClick={() => navigate('/trip-list')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripDetails;
