import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Para la alerta de éxito
import CustomInput from '../reusable/CustomInput';
import CustomButton from '../reusable/CustomButton';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditVehicle = () => {
  const [vehicleImage, setVehicleImage] = useState(null);
  const [soatImage, setSoatImage] = useState(null);
  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar los datos del vehículo al montar el componente
    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://wheels-backend-rafaelsavas-projects.vercel.app/api/vehicle', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar la información del vehículo.');
        }

        const data = await response.json();
        setPlate(data.vehicle.carPlate);
        setCapacity(data.vehicle.capacity);
        setBrand(data.vehicle.brand);
        setModel(data.vehicle.model);
        setColor(data.vehicle.color);
      } catch (error) {
        console.error('Error al cargar los datos del vehículo:', error);
        navigate('/manage-trips'); // Redirigir si no se pueden cargar los datos
      }
    };

    fetchVehicle();
  }, [navigate]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dfcprvapn/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error);
      throw error;
    }
  };

  const handleImageChange = async (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadToCloudinary(file);
        setImage(imageUrl);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!plate || !capacity || !brand || !model || !color || !vehicleImage || !soatImage) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
      });
      return;
    }

    const updatedVehicleData = {
      brand,
      model,
      carPlate: plate,
      capacity,
      color,
      picture: vehicleImage,
      soat: soatImage,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://wheels-backend-rafaelsavas-projects.vercel.app/api/vehicle', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedVehicleData),
      });

      if (!response.ok) {
        const errorText = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo actualizar el vehículo. ${errorText.message || ''}`,
        });
        return;
      }

      const result = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: result.message || 'Vehículo actualizado exitosamente.',
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate('/manage-trips'),
      });
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar los cambios. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center py-20 h-[screen] bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter">
      <div className="bg-white px-10 py-14 rounded-3xl shadow-lg w-[80%] max-w-3xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-5">Editar Vehículo</h2>

        <form className="flex flex-col gap-4">
          {/* Foto del vehículo */}
          <div className="relative mb-5">
            <label htmlFor="vehicleImage" className="block text-sm font-medium text-gray-700">
              Foto del vehículo
            </label>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center overflow-hidden relative">
              {vehicleImage ? (
                <>
                  <img src={vehicleImage} alt="Vehicle" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => setVehicleImage(null)}
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <>
                  <Camera size={50} className="text-gray-500" />
                  <label htmlFor="vehicleImage" className="block mt-2 text-blue-600 cursor-pointer">
                    Sube una foto
                  </label>
                </>
              )}
            </div>
            <input
              type="file"
              id="vehicleImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, setVehicleImage)}
            />
          </div>

          <CustomInput type="text" placeholder="Placa" value={plate} onChange={(e) => setPlate(e.target.value)} />
          <CustomInput type="text" placeholder="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <CustomInput type="text" placeholder="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
          <CustomInput type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />

          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            Capacidad
          </label>
          <input
            type="number"
            id="capacity"
            min="1"
            max="100"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Foto del SOAT */}
          <div className="relative mb-5">
            <label htmlFor="soatImage" className="block text-sm font-medium text-gray-700">
              Foto del SOAT
            </label>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center overflow-hidden relative">
              {soatImage ? (
                <>
                  <img src={soatImage} alt="SOAT" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => setSoatImage(null)}
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <>
                  <Camera size={50} className="text-gray-500" />
                  <label htmlFor="soatImage" className="block mt-2 text-blue-600 cursor-pointer">
                    Sube una foto
                  </label>
                </>
              )}
            </div>
            <input
              type="file"
              id="soatImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, setSoatImage)}
            />
          </div>

          <div className="flex justify-between mt-6">
            <CustomButton
              onClick={() => navigate('/manage-trips')}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancelar
            </CustomButton>
            <CustomButton
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Guardar Vehículo
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
