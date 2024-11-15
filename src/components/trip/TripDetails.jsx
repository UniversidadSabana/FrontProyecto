import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, User, DollarSign, Calendar, CarFront } from 'lucide-react';
import Swal from 'sweetalert2';
import '../reusable/loader.css';

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [seatsReserved, setSeatsReserved] = useState(1);
  const [stops, setStops] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const autonorteStops = [
    "Calle 82", "Calle 85", "Calle 100", "Calle 106", "Calle 116", "Calle 127",
    "Prado", "Alcalá", "Calle 142", "Calle 146", "Mazurén", "Cardio Infantil",
    "Toberín", "Éxito", "Panamá", "Calle 187", "Terminal"
  ];

  const boyacaStops = [
    "Bahía Carlos Lleras", "CAI Normandía", "Calle 55", "Calle 63B", "Calle 66", "Calle 72",
    "Calle 75", "Titan Plaza", "Calle 98", "Calle 116", "Calle 127", "Suba",
    "Calle 134", "Farmatodo Colina", "Calle 153", "Calle 162", "Calle 165",
    "Calle 170", "Uniagraria"
  ];

  const novenaStops = [
    "Av 9 Calle 101", "Av 9 Calle 106", "Av 9 Calle 116", "Av 9 Calle 127", "Av 9 Calle 134", 
    "Av 9 Calle 140", "Av 9 Calle 147", "Av 9 Calle 153", "Av 9 Calle 163", "Av 9 Calle 166", "Av 9 Calle 170"
  ];

  const subaStops = [
    "Suba ETB", "Suba Gym Cra 109A # 134-73", "Suba Portal Suba", "Suba C.C Plaza Imperial", 
    "Suba Cll 148 Cra 92", "Suba Cra 92 con Cll 142", "Suba Cll 154 Conjunto Almeria", 
    "Suba Biblioteca Julio Mario Santodomingo"
  ];

  const getFilteredStops = (route, initialPoint) => {
    let routeStops;

    switch (route) {
      case "Autonorte":
        routeStops = autonorteStops;
        break;
      case "Boyaca":
        routeStops = boyacaStops;
        break;
      case "Novena":
        routeStops = novenaStops;
        break;
      case "Suba":
        routeStops = subaStops;
        break;
      default:
        return [];
    }

    const match = initialPoint.match(/\bCalle\s(\d+)|\bAv\s9\sCalle\s(\d+)/i);
    if (match) {
      const initialStreet = match[0];
      const startIndex = routeStops.findIndex(stop => stop.includes(initialStreet));
      return startIndex !== -1 ? routeStops.slice(startIndex) : routeStops;
    }
    return routeStops;
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        setLoading(true);
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
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
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
        await Swal.fire({
          icon: 'success',
          title: 'Reserva exitosa',
          text: `${result.message}. Cupos restantes: ${result.seatsRemaining}`,
          confirmButtonText: 'OK'
        });
        navigate('/trip-list');
      } else {
        throw new Error(result.error || 'Error en la reserva');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error en la reserva:', err);
    }
  };

  const handleStopChange = (index, value) => {
    const updatedStops = [...stops];
    updatedStops[index] = value;
    setStops(updatedStops);
  };

  useEffect(() => {
    setStops(Array(seatsReserved).fill(''));
  }, [seatsReserved]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  const filteredStops = getFilteredStops(trip.route, trip.initialPoint);

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
          <CarFront className="inline-block mr-2" /> Placa: {trip.carPlate.toUpperCase()}
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

          {Array.from({ length: seatsReserved }).map((_, index) => (
            <div key={index}>
              <label className="block text-gray-700">Parada {index + 1}</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={stops[index] || ''}
                onChange={(e) => handleStopChange(index, e.target.value)}
              >
                <option value="">Selecciona una parada</option>
                {filteredStops.map((stop, i) => (
                  <option key={i} value={stop}>
                    {stop}
                  </option>
                ))}
              </select>
            </div>
          ))}

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
