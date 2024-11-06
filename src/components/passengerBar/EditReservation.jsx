import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomButton from '../reusable/CustomButton';

const EditReservation = () => {
  const { reservationId } = useParams(); // Obtén el ID de la reserva desde la URL
  const [reservation, setReservation] = useState(null);
  const [seats, setSeats] = useState('');
  const [pickupPoint, setPickupPoint] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservation = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setReservation(data.reservation);
      setSeats(data.reservation.seatsReserved);
      setPickupPoint(data.reservation.pickupPoint);
    };

    fetchReservation();
  }, [reservationId]);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ seatsReserved: seats, pickupPoint }),
    });

    if (response.ok) {
      navigate('/my-reservations');
    } else {
      console.error('Error al actualizar la reserva');
    }
  };

  return reservation ? (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Editar Viaje</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Número de cupos</label>
          <input
            type="number"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Parada para el cupo</label>
          <input
            type="text"
            value={pickupPoint}
            onChange={(e) => setPickupPoint(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          />
        </div>
        <CustomButton onClick={handleSaveChanges} className="w-full bg-orange-500 text-white">
          Guardar Cambios
        </CustomButton>
      </div>
    </div>
  ) : (
    <p>Cargando reserva...</p>
  );
};

export default EditReservation;
