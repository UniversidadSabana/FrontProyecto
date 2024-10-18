import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../reusable/CustomInput';
import CustomButton from '../reusable/CustomButton';
import { Camera } from 'lucide-react';
import { useUser } from './UserContext';
import Modal from '../reusable/Modal'; // Importa el modal

// Imagen de perfil por defecto (agrega aquí tu código base64 de imagen)
const defaultProfileImage = 'data:image/png;base64,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'; 

const ProfileSetup = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user.name || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [mail, setMail] = useState(user.mail || '');
  const [contactNumber, setContactNumber] = useState('');
  const [image, setImage] = useState(null);
  const [id, setId] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  const [error, setError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setName(user.name);
    setLastName(user.lastName);
    setMail(user.mail);
  }, [user]);

  // Función para validar el email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de campos
  const handleSubmit = async () => {
    // Validar que los campos no estén vacíos
    if (!name || !lastName || !mail || !contactNumber || !id) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar formato de email
    if (!validateEmail(mail)) {
      setError('Por favor ingrese un correo válido');
      return;
    }

    // Validar que ID y número de contacto solo contengan números
    if (!/^\d+$/.test(id) || !/^\d+$/.test(contactNumber)) {
      setError('El ID y el número de contacto deben contener solo números');
      return;
    }

    // Validar que el número de contacto tenga hasta 10 dígitos
    if (contactNumber.length > 10) {
      setError('El número de contacto debe tener hasta 10 dígitos');
      return;
    }

    // Si el usuario no ha subido una imagen, usar la imagen predeterminada
    const finalImage = image || defaultProfileImage;

    const updatedUser = {
      id,
      name,
      lastName,
      mail,
      contactNumber,
      image: finalImage,
      password: user.password, // Asegúrate de tener la contraseña en el contexto
    };

    // Imprimir los datos que se van a enviar
    console.log('Datos que se enviarán al backend:', updatedUser);
    setUser(updatedUser);

    try {
      // Enviar los datos al endpoint de registro
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
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

      // Muestra el modal con un mensaje de éxito
      setModalMessage('El perfil se ha registrado correctamente.');
      setIsModalOpen(true);

      // Redirigir después de cerrar el modal
      if (isDriver) {
        setTimeout(() => navigate('/add-vehicle'), 2000); // redirige tras cerrar el modal
      } else {
        setTimeout(() => navigate('/login'), 2000);
      }

    } catch (error) {
      console.error('Error al enviar los datos:', error);
      // Muestra el modal con un mensaje de error
      setModalMessage('Ocurrió un error al registrar el perfil. Inténtalo de nuevo.');
      setIsModalOpen(true);
    }
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
        <h2 className="text-4xl font-bold text-blue-800 mb-5">Configura tu perfil</h2>

        <div className="flex flex-col items-center">
          {/* Imagen de perfil */}
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

          {/* Formulario */}
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
              placeholder="Id Universidad"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <CustomInput
              type="email"
              placeholder="Correo institucional"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
            <CustomInput
              type="text"
              placeholder="Número de contacto"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Mensaje de error */}

            <div className="flex items-center gap-2 mt-4">
              <label className="text-gray-600">Quiero ser conductor</label>
              <input
                type="checkbox"
                checked={isDriver}
                onChange={() => setIsDriver(!isDriver)}
                className="toggle-checkbox h-6 w-6 text-blue-600"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end mt-6">
              <CustomButton
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Guardar Perfil
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

export default ProfileSetup;
