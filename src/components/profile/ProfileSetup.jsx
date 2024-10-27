import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../reusable/CustomInput";
import CustomButton from "../reusable/CustomButton";
import { Camera } from "lucide-react";
import { useUser } from "../auth/UserContext";
import Swal from 'sweetalert2'; // Importa SweetAlert2

const defaultProfileImage = "https://res.cloudinary.com/dfcprvapn/image/upload/v1729783367/default-img_kun3yf.png";

const ProfileSetup = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user.name || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [mail, setMail] = useState(user.mail || "");
  const [contactNumber, setContactNumber] = useState("");
  const [image, setImage] = useState(null); // URL de la imagen
  const [id, setId] = useState("");
  const [isDriver, setIsDriver] = useState(false); // Casilla "Quiero ser conductor"
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setName(user.name);
    setLastName(user.lastName);
    setMail(user.mail);
    if (!user.name) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Función para validar el email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Subir la imagen a Cloudinary
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
      return data.secure_url; // Devuelve la URL segura de Cloudinary
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary:", error);
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadToCloudinary(file); // Subimos la imagen a Cloudinary
        setImage(imageUrl); // Guardamos la URL en el estado
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }
  };

  // Validación de campos y envío de datos
  const handleSubmit = async () => {
    // Validar que los campos no estén vacíos
    if (!name || !lastName || !mail || !contactNumber || !id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios',
      });
      return;
    }

    // Validar formato de email
    if (!validateEmail(mail)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese un correo válido',
      });
      return;
    }

    // Validar que ID y número de contacto solo contengan números
    if (!/^\d+$/.test(id) || !/^\d+$/.test(contactNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID y el número de contacto deben contener solo números',
      });
      return;
    }

    // Validar que el número de contacto tenga hasta 10 dígitos
    if (contactNumber.length > 10) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El número de contacto debe tener hasta 10 dígitos',
      });
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
      image: finalImage, // Enviar la URL de la imagen
      password: user.password, // Asegúrate de tener la contraseña en el contexto
    };

    console.log("Datos que se enviarán al backend:", updatedUser);
    setUser(updatedUser);

    try {
      const response = await fetch(
        "https://wheels-backend-rafaelsavas-projects.vercel.app/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        const errorText = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Ocurrió un error al registrar el perfil. ${errorText.error}`,
        });
        return;
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'El perfil se ha registrado correctamente',
        timer: 2000,
        showConfirmButton: false
      });

      // Redirigir solo si "Quiero ser conductor" está activado
      if (isDriver) {
        setTimeout(() => navigate("/add-vehicle"), 2000); // Redirige a "Añadir vehículo"
      } else {
        setTimeout(() => navigate("/trip-list"), 2000); // Redirige a "trip-list"
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar el perfil. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter">
      <div className="bg-white px-10 py-16 rounded-3xl shadow-lg w-[80%] max-w-3xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-5">
          Configura tu perfil
        </h2>

        <div className="flex flex-col items-center">
          {/* Imagen de perfil */}
          <div className="relative mb-5">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={defaultProfileImage}
                  alt="Default"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 cursor-pointer"
            >
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
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
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
            {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
            {/* Mensaje de error */}
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
            <div className="flex justify-end mt-6 gap-4">
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
    </div>
  );
};

export default ProfileSetup;
