import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../reusable/CustomInput';
import CustomButton from '../reusable/CustomButton';
import { Camera } from 'lucide-react';
import { useUser } from './UserContext';
import Modal from '../reusable/Modal';

const defaultProfileImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAIAAABEtEjdAAAgAElEQVR4nO3daVfbSNqAYUvywr4FEqDBkDSke06S//8/cpKTEDZjsI0XvG+ypKr3g/rNzPSkEzCyy350Xx/mw5w+M88k1j3lUkm2isViAgAgi216AABA9Ig7AAhE3AFAIOIOAAIRdwAQiLgDgEDEHQAEIu4AIBBxBwCBiDsACETcAUAg4g4AAhF3ABCIuAOAQMQdAAQi7gAgEHEHAIGIOwAIRNwBQCDiDgACEXcAEIi4A4BAxB0ABCLuACAQcQcAgYg7AAhE3AFAIOIOAAIRdwAQiLgDgEDEHQAEIu4AIBBxBwCBiDsACETcAUAg4g4AAhF3ABCIuAOAQMQdAAQi7gAgEHEHAIGIOwAIRNwBQCDiDgACEXcAEIi4A4BAxB0ABCLuACAQcQcAgYg7AAhE3AFAIOIOAAIRdwAQiLgDgEDEHQAEIu4AIBBxBwCBiDsACETcAUAg4g4AAhF3ABCIuAOAQMQdAAQi7gAgEHEHAIGIOwAIRNwBQCDiDgACEXcAEOj/ACnAjOCrJ+cTAAAAAElFTkSuQmCC'; 

const ProfilePassenger = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user.name || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [contactNumber, setContactNumber] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setName(user.name);
    setLastName(user.lastName);
  }, [user]);

  const handleSubmit = () => {
    if (!name || !lastName || !contactNumber) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const finalImage = image || defaultProfileImage;

    const updatedUser = {
      name,
      lastName,
      contactNumber,
      image: finalImage,
    };

    console.log('Datos actualizados:', updatedUser);
    setUser(updatedUser);
    setModalMessage('Perfil actualizado con éxito.');
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter">
      <div className="bg-white px-10 py-16 rounded-3xl shadow-lg w-[80%] max-w-3xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-5">Gestiona tu perfil</h2>

        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {image ? (
                <img src={image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={defaultProfileImage} alt="Default" className="w-full h-full object-cover" />
              )}
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

      {/* Modal para mostrar éxito o error */}
      <Modal
        message={modalMessage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Cierra el modal
      />
    </div>
  );
};

export default ProfilePassenger;

