import React, { useEffect, useState } from 'react';
import CustomButton from '../reusable/CustomButton';
import { ArrowLeft, Edit3, Trash } from 'lucide-react'; // Importar los iconos
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [seats, setSeats] = useState(1);
  const [stops, setStops] = useState([]);
  const [filteredStops, setFilteredStops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const autonorteStops = ["Calle 82", "Calle 85", "Calle 100", "Calle 106", "Calle 116", "Calle 127", "Prado", "Alcalá", "Calle 142", "Calle 146", "Mazurén", "Cardio Infantil", "Toberín", "Éxito", "Panamá", "Calle 187", "Terminal"];
  const boyacaStops = ["Bahía Carlos Lleras", "CAI Normandía", "Calle 55", "Calle 63B", "Calle 66", "Calle 72", "Calle 75", "Titan Plaza", "Calle 98", "Calle 116", "Calle 127", "Suba", "Calle 134", "Farmatodo Colina", "Calle 153", "Calle 162", "Calle 165", "Calle 170", "Uniagraria"];
  const novenaStops = ["Av 9 Calle 101", "Av 9 Calle 106", "Av 9 Calle 116", "Av 9 Calle 127", "Av 9 Calle 134", "Av 9 Calle 140", "Av 9 Calle 147", "Av 9 Calle 153", "Av 9 Calle 163", "Av 9 Calle 166", "Av 9 Calle 170"];
  const subaStops = ["Suba ETB", "Suba Gym Cra 109A # 134-73", "Suba Portal Suba", "Suba C.C Plaza Imperial", "Suba Cll 148 Cra 92", "Suba Cra 92 con Cll 142", "Suba Cll 154 Conjunto Almeria", "Suba Biblioteca Julio Mario Santodomingo"];

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

  const getFilteredStops = (route) => {
    switch (route) {
      case 'Autonorte':
        return autonorteStops;
      case 'Boyaca':
        return boyacaStops;
      case 'Novena':
        return novenaStops;
      case 'Suba':
        return subaStops;
      default:
        return [];
    }
  };

  const handleModify = (reservation) => {
    setSelectedReservation(reservation);
    setSeats(reservation.seatsReserved);
    setFilteredStops(getFilteredStops(reservation.route));
    setStops(reservation.stops || []);
    setIsModalOpen(true);
  };

  const handleStopChange = (index, value) => {
    const updatedStops = [...stops];
    updatedStops[index] = value;
    setStops(updatedStops);
  };

  const handleDelete = async (tripId) => {
    const confirmResult = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción. La reserva será cancelada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  
    if (confirmResult.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/reserve/${tripId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tripId }), // Enviar el tripId en el cuerpo de la solicitud
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al cancelar la reserva');
        }
  
        const result = await response.json();
  
        // Mostrar mensaje de éxito y actualizar la lista de reservas
        await Swal.fire({
          icon: 'success',
          title: 'Reserva cancelada exitosamente',
          text: `Cupos restantes: ${result.seatsRemaining}`,
          showConfirmButton: false,
          timer: 1500,
        });
  
        // Eliminar la reserva de la lista en el frontend
        setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation.tripId !== tripId)
        );
      } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo cancelar la reserva. Inténtalo de nuevo.',
        });
      }
    }
  };
  
  

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/trip/reserve/${selectedReservation.tripId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seatsReserved: seats, stops }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar los cambios');
      }

      const result = await response.json();
      
      // Actualizar la reserva en el frontend
      const updatedReservation = { ...selectedReservation, seatsReserved: seats, stops };
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.tripId === selectedReservation.tripId ? updatedReservation : res
        )
      );

      await Swal.fire({
        icon: 'success',
        title: result.message,
        text: `Cupos restantes: ${result.seatsRemaining}`,
        showConfirmButton: false,
        timer: 1500,
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6 relative">
      {/* Título con icono de flecha para volver */}
      <div className="flex items-center mb-6">
        <ArrowLeft 
          onClick={() => navigate('/trip-list')}
          className="text-white cursor-pointer mr-2"
          size={24}
        />
        <h1 className="text-white text-3xl font-semibold">Mis Reservas</h1>
      </div>
      
      {reservations.length > 0 ? (
        reservations.map((reservation) => (
          <div key={reservation.tripId} className="bg-white p-4 rounded-lg mb-4 shadow-lg">
            <div>
              <p><strong>Inicio:</strong> {reservation.initialPoint}</p>
              <p><strong>Fin:</strong> {reservation.finalPoint}</p>
              <p><strong>Ruta:</strong> {reservation.route}</p>
              <p><strong>Cupos:</strong> {reservation.seatsReserved}</p>
              <p><strong>Tarifa:</strong> {reservation.price}</p>
            </div>
             {/* Contenedor de los botones debajo de "Tarifa" */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleModify(reservation)}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Edit3 className="mr-2" /> Editar
              </button>
              <button
                onClick={() => handleDelete(reservation.tripId)}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                <Trash className="mr-2" /> Eliminar
              </button>
            </div>
          </div>
    ))
      ) : (
        <p className="text-white">No tienes reservas</p>
      )}

      {/* Modal de edición */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
            <h2 className="text-blue-900 text-2xl font-semibold mb-4">Editar Viaje</h2>
            <form className="flex flex-col gap-4">
              <label className="block text-gray-700">
                Número de cupos
                <input
                  type="number"
                  value={seats}
                  onChange={(e) => setSeats(parseInt(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg"
                  min="1"
                />
              </label>
              {Array.from({ length: seats }).map((_, index) => (
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
              <div className="flex justify-between mt-4">
                <CustomButton onClick={handleCloseModal} className="bg-gray-500 text-white">
                  Volver
                </CustomButton>
                <CustomButton onClick={handleSaveChanges} className="bg-orange-500 text-white">
                  Guardar Cambios
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;