import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, User, DollarSign, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const TripDetails = () =>  {
  const { tripId } = useParams(); // Obtener tripId de la URL
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        if (!token) {
          navigate('/login'); // Redirigir a la página de inicio de sesión si no hay token
        }

        const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/${tripId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Incluir el token en el header Authorization
            'Content-Type': 'application/json', // Asegurarnos de especificar que el contenido es JSON
          }
        });
        
        if (response.status === 401 || response.status === 403) {
          // Token inválido o no autorizado
          navigate('/login');}
          

        if (!response.ok) {
          // Si la respuesta no es 200-299, lanza un error con el estado
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta completa del backend:', data); // Verificar la estructura completa de la respuesta

        setTrip(data);

      } catch (err) {
        setError(err.message); // Captura y muestra cualquier error que ocurra
        console.error('Error al obtener detalles del viaje:', err);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  if (error) {
    return <p className="text-red-600">Error: {error}</p>; // Mostrar errores si ocurren
  }

  if (!trip) {
    return <p>Cargando detalles del viaje...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Detalles del viaje</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="text-center mb-6">
          {/* Si tienes una imagen del viaje, puedes mostrarla aquí */}
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
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Número de cupos</label>
            <select className="w-full p-2 border rounded-lg">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Parada para el cupo</label>
            <select className="w-full p-2 border rounded-lg">
              <option>Parada 1</option>
              <option>Parada 2</option>
            </select>
          </div>

          <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded mt-4 hover:bg-orange-600 w-full">
            Reservar Cupo(s)
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripDetails;
