import React, { useState, useEffect } from 'react';
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
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Verificar si el usuario está presente, si no, redirigir a '/'
  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Función para subir la imagen a Cloudinary y manejar la carga
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
      console.log(data.secure_url);
      return data.secure_url; 
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error);
      throw error;
    }
  };

  // Función para manejar la selección de imagen
  const handleImageChange = async (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadToCloudinary(file); // Subimos la imagen a Cloudinary
        setImage(imageUrl); // Guardamos la URL en el estado
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  };

  const handleSubmit = async () => {
    // Validar que todos los campos estén completos
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
      picture: vehicleImage,  // Ahora es la URL de Cloudinary
      soat: soatImage,        // También la URL de Cloudinary
    };

    console.log('Datos del vehículo que se enviarán:', vehicleData);

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
        console.error('Error en el backend:', errorText);
        setModalMessage(`Ocurrió un error al registrar el vehículo. ${errorText.error}`);
        setIsModalOpen(true); // Mostrar modal de error
        return;
      }

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      // Mostrar modal de éxito
      setModalMessage('El vehículo se ha registrado correctamente.');
      setIsModalOpen(true);

      // Redirigir después de cerrar el modal
      setTimeout(() => navigate('/login'), 2000); // Redirige tras cerrar el modal

    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setModalMessage('Ocurrió un error al registrar el vehículo. Inténtalo de nuevo.');
      setIsModalOpen(true); // Mostrar modal de error
    }
  };

  return (
    <div className="flex items-center justify-center py-20 h-[screen] bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter">
      <div className="bg-white px-10 py-14 rounded-3xl shadow-lg w-[80%] max-w-3xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-5">Agregar Vehículo</h2>

        <form className="flex flex-col gap-4">
          {/* Foto del vehículo */}
          <div className="relative mb-5">
            <label htmlFor="vehicleImage" className="block text-sm font-medium text-gray-700">
              Foto del vehículo
            </label>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center overflow-hidden">
              {vehicleImage ? (
                <img src={vehicleImage} alt="Vehicle" className="w-full h-full object-cover" />
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

          {/* Otros campos */}
          <CustomInput
            type="text"
            placeholder="Placa"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />
          <CustomInput
            type="text"
            placeholder="Marca"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <CustomInput
            type="text"
            placeholder="Modelo"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <CustomInput
            type="text"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          {/* Capacidad (input numérico) */}
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
            <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center overflow-hidden">
              {soatImage ? (
                <img src={soatImage} alt="SOAT" className="w-full h-full object-cover" />
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

          {error && <p className="text-red-500 text-sm">{error}</p>} {/* Mensaje de error */}

          {/* Botones */}
          <div className="flex justify-between mt-6">
          <CustomButton
                onClick={() => navigate("/trip-list")} // Botón de cancelar que redirige
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

      {/* Modal para mostrar éxito o error */}
      <Modal
        message={modalMessage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Cierra el modal
      />
    </div>
  );
};

export default AddVehicle;
