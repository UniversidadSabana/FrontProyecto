import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomButton from '../reusable/CustomButton';
import Swal from 'sweetalert2';

const EditReservation = () => {
  const { tripId } = useParams(); // Asegúrate de que el tripId se recibe correctamente
  const [seats, setSeats] = useState('');
  const [stops, setStops] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservation = async () => {
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/reserve/${tripId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            Swal.fire("Error", "Reserva no encontrada.", "error");
          } else {
            Swal.fire("Error", "Ocurrió un error al cargar la reserva.", "error");
          }
          navigate('/my-reservations');
          return;
        }

        const data = await response.json();
        setSeats(data.seatsReserved || ''); 
        setStops((data.stops || []).join(', '));
      } catch (error) {
        console.error("Error de conexión al cargar la reserva:", error);
        Swal.fire("Error", "Ocurrió un error de conexión al cargar la reserva.", "error");
        navigate('/my-reservations');
      }
    };

    if (tripId) {
      fetchReservation();
    } else {
      Swal.fire("Error", "ID de reserva no encontrado.", "error");
      navigate('/my-reservations');
    }
  }, [tripId, navigate]);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    const stopsArray = stops.split(',').map(stop => stop.trim());

    try {
      const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/reserve/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ seatsReserved: seats, stops: stopsArray }),
      });

      if (response.ok) {
        Swal.fire("Éxito", "Reserva actualizada exitosamente.", "success");
        navigate('/my-reservations');
      } else {
        Swal.fire("Error", "Ocurrió un error al actualizar la reserva.", "error");
      }
    } catch (error) {
      console.error("Error de conexión al actualizar la reserva:", error);
      Swal.fire("Error", "Ocurrió un error de conexión al actualizar la reserva.", "error");
    }
  };

  return (
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
          <label className="block text-sm font-medium text-gray-700">Parada(s) para el/los cupo</label>
          <input
            type="text"
            value={stops}
            onChange={(e) => setStops(e.target.value)}
            placeholder="Ej: Calle 142, Toberín, Calle 170"
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          />
        </div>
        <CustomButton onClick={handleSaveChanges} className="w-full bg-orange-500 text-white">
          Guardar Cambios
        </CustomButton>
      </div>
    </div>
  );
};

export default EditReservation;
