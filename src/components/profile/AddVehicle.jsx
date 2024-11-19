import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import CustomInput from '../reusable/CustomInput';
import CustomButton from '../reusable/CustomButton';
import { Camera } from 'lucide-react';
import { useUser } from '../auth/UserContext';
import Modal from '../reusable/Modal';
import { useNavigate } from 'react-router-dom';

const AddVehicle = () => {
  const { user } = useUser();
  const [vehicleImage, setVehicleImage] = useState(null);
  const [soatImage, setSoatImage] = useState(null);
  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Verificar si el usuario está presente, si no, redirigir a '/login'
  useEffect(() => {
    if (!user || !user.id) {
      try {
        const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;
        if (!userId) {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    }
  }, [user, navigate]);

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
      setError('Todos los campos son obligatorios');
      return;
    }

    const vehicleData = {
      userId: user.id,
      carPlate: plate,
      capacity,
      brand,
      model,
      color,
      picture: vehicleImage,
      soat: soatImage,
    };

    try {
      const response = await fetch('https://wheels-backend-rafaelsavas-projects.vercel.app/api/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const errorText = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Ocurrió un error al registrar el vehículo. ${errorText.error}`,
        });
        return;
      }

      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Vehículo agregado exitosamente',
        text: 'Redirigiendo...',
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate('/trip-list'), // Redirige al cerrar la alerta
      });
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar el vehículo. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center py-20 h-[screen] bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter">
      <div className="bg-white px-10 py-14 rounded-3xl shadow-lg w-[80%] max-w-3xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-5">Agregar Vehículo</h2>

        <form className="flex flex-col gap-4">
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-between mt-6">
            <CustomButton
              onClick={() => navigate('/trip-list')}
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

export default AddVehicle;
