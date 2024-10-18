import React from 'react';

const TripCard = ({ trip }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <p><strong>Inicio:</strong> {trip.initialPoint}</p>
      <p><strong>Fin:</strong> {trip.finalPoint}</p>
      <p><strong>Ruta:</strong> {trip.route}</p>
      <p><strong>Hora:</strong> {trip.hour}</p>
      <p><strong>Cupos disponibles:</strong> {trip.seatsAvailable}</p>
      <p><strong>Precio:</strong> {trip.price}</p>
      <button className="bg-orange-500 text-white px-4 py-2 rounded mt-4">Ver detalles</button>
    </div>
  );
};

export default TripCard;
