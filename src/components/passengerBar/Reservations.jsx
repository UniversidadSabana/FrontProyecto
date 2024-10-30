// src/components/trip/MyReservations.jsx

import React, { useEffect, useState } from 'react';
import CustomButton from '../reusable/CustomButton';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { useNavigate } from 'react-router-dom';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://wheels-backend-rafaelsavas-projects.vercel.app/api/my-reservations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setReservations(data.reservations || []);
    };

    fetchReservations();
  }, []);

  const handleModify = (reservationId) => {
    console.log('Modificar reserva:', reservationId);
  };

  const handleDelete = async (tripId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción cancelará tu reserva.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/reserve/${tripId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cancelar la reserva.');
        }

        const data = await response.json();
        console.log(data.message);

        // Actualizar la lista de reservas
        setReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== tripId));

        // Mostrar alerta de éxito y redirigir a la lista de viajes
        await Swal.fire({
          icon: 'success',
          title: 'Reserva cancelada exitosamente',
          showConfirmButton: false,
          timer: 1500
        });

        navigate('/trip-list');
      } catch (error) {
        console.error('Error al cancelar la reserva:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6">
      <h1 className="text-white text-3xl font-semibold mb-6">Mis Reservas</h1>
      {reservations.length > 0 ? (
        reservations.map((reservation) => (
          <div key={reservation.id} className="bg-white p-4 rounded-lg mb-4 shadow-lg">
            <div className="flex justify-between">
              <div>
                <p><strong>Inicio:</strong> {reservation.initialPoint}</p>
                <p><strong>Fin:</strong> {reservation.finalPoint}</p>
                <p><strong>Ruta:</strong> {reservation.route}</p>
                <p><strong>Cupos:</strong> {reservation.seatsReserved}</p>
                <p><strong>Tarifa:</strong> {reservation.price}</p>
              </div>
              <div className="flex gap-2">
                <CustomButton onClick={() => handleModify(reservation.id)} className="bg-blue-500 text-white">
                  Modificar
                </CustomButton>
                <CustomButton onClick={() => handleDelete(reservation.tripId)} className="bg-red-500 text-white">
                  Eliminar
                </CustomButton>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white">No tienes reservas</p>
      )}
    </div>
  );
};

export default MyReservations;
