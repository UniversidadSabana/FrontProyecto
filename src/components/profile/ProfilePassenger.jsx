import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../reusable/CustomInput';
import CustomButton from '../reusable/CustomButton';
import { Camera } from 'lucide-react';
import { useUser } from '../auth/UserContext';
import Modal from '../reusable/Modal';

const ProfilePassenger = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        // Hacer la solicitud al backend para obtener los datos del perfil
        const response = await fetch(`https://wheels-backend-rafaelsavas-projects.vercel.app/api/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 401 || response.status === 403) {
          navigate('/login');}
          
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta completa del backend:', data);

        setUser(data);
        setImage(data.image || '');
        setContactNumber(data.contactNumber || '');
        setLastName(data.lastName || '');
        setName(data.name || '');

      } catch (error) {
        setError('Error al cargar el perfil');
        console.error('Error al cargar el perfil:', error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!name || !lastName || !contactNumber) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!/^\d+$/.test(contactNumber)) {
      setError("El ID y el número de contacto deben contener solo números");
      return;
    }

    if (contactNumber.length > 10) {
      setError("El número de contacto debe tener hasta 10 dígitos");
      return;
    }

    const updatedUser = {
      name,
      lastName,
      contactNumber,
      image,
    };

    console.log('Datos actualizados:', updatedUser);
    setUser(updatedUser);
    setModalMessage('Perfil actualizado con éxito.');

    try {
      const response = await fetch(
        "https://wheels-backend-rafaelsavas-projects.vercel.app/api/profile",
        {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        const errorText = await response.json();
        console.error("Error en el backend:", errorText);
        setModalMessage(
          `Ocurrió un error al registrar el perfil. ${errorText.error}`
        );
        setIsModalOpen(true);
        return;
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      setModalMessage("El perfil se ha actualizado correctamente.");
      setIsModalOpen(true);
      setTimeout(() => navigate("/trip-list"), 2000);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setModalMessage(
        "Ocurrió un error al registrar el perfil. Inténtalo de nuevo."
      );
      setIsModalOpen(true);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfcprvapn/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary:", error);
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadToCloudinary(file);
        setImage(imageUrl);
        console.log("Nueva URL de imagen:", imageUrl);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter">
      <div className="bg-white px-10 py-16 rounded-3xl shadow-lg w-[80%] max-w-3xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-5">Gestiona tu perfil</h2>

        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 cursor-pointer">
              <Camera size={16} />
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <form className="w-full flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <CustomInput
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CustomInput
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <CustomInput
              type="text"
              placeholder="Número de contacto"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end mt-6">
              <CustomButton
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Guardar Cambios
              </CustomButton>
            </div>
          </form>
        </div>
      </div>

      <Modal
        message={modalMessage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePassenger;
