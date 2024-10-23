import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, DollarSign } from 'lucide-react';

const TripCard = ({ trip }) => {
  const navigate = useNavigate(); // Hook para navegación

  const handleDetailsClick = () => {
    navigate(`/trip-details/${trip.tripId}`); // Redirigir con el tripId
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4 border border-gray-200">
      {/* Encabezado con puntos de inicio y fin */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <MapPin className="text-blue-800 mr-2" />
          <p className="text-blue-800 font-semibold">Inicio: {trip.initialPoint}</p>
        </div>
        <div className="flex items-center">
          <MapPin className="text-blue-800 mr-2" />
          <p className="text-blue-800 font-semibold">Fin: {trip.finalPoint}</p>
        </div>
      </div>

      {/* Detalles del viaje */}
      <p className="text-gray-700 mb-2"><strong>Ruta:</strong> {trip.route}</p>
      
      {/* Información de cupos y tarifa */}
      <div className="flex items-center mb-4">
        <Users className="text-gray-500 mr-2" />
        <p className="text-gray-700 mr-4">Cupos: {trip.seatsAvailable}</p>
        <DollarSign className="text-gray-500 mr-2" />
        <p className="text-gray-700">Tarifa: {trip.price.toLocaleString()}</p>
      </div>

      {/* Botón de Ver detalles */}
      <button 
        onClick={handleDetailsClick} // Aquí agregamos el onClick para manejar la navegación
        className="w-full bg-orange-500 text-white py-2 rounded-lg text-center font-medium hover:bg-orange-600"
      >
        Ver detalles
      </button>
    </div>
  );
};

export default TripCard;
