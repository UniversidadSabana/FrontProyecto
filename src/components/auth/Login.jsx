import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../reusable/AuthLayout"; // Asegúrate de usar la ruta correcta
import CustomInput from "../reusable/CustomInput";
import CustomButton from "../reusable/CustomButton";
import LinkText from "../reusable/LinkText";
import Modal from "../reusable/Modal"; // Asegúrate de importar el componente Modal

const Login = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [modalMessage, setModalMessage] = useState(""); 
  const [error,setError]=useState('')
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();

  // Función para verificar la validez del token
  const verifyToken = async (token) => {
    try {
      const response = await fetch(
        "https://wheels-backend-rafaelsavas-projects.vercel.app/api/verify-token",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en los headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Si el token es válido, redirigir al usuario a la página de lista de viajes
        navigate("/trip-list");
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que ambos campos estén completos
    if (!mail || !password) {
      setError("Por favor completa ambos campos"); // Mostrar mensaje de error
      return;
    }

    const loginData = {
      mail,
      password,
    };

    try {
      const response = await fetch(
        "https://wheels-backend-rafaelsavas-projects.vercel.app/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (!response.ok) {
        const errorText = await response.json();
        setModalMessage("Error de autenticación: " + errorText.error); // Mostrar el error en el modal
        setIsModalOpen(true); // Abrir el modal
        return;
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      // Almacenar el token JWT en localStorage
      localStorage.setItem("token", data.token);

      // Mostrar mensaje de éxito y redirigir
      setModalMessage("Inicio de sesión exitoso. Redirigiendo...");
      setIsModalOpen(true);
      setTimeout(() => {
        navigate("/trip-list"); // Redirigir después de unos segundos
      }, 2000); // Esperar 2 segundos antes de redirigir
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setModalMessage("Error en la solicitud. Por favor, intenta de nuevo.");
      setIsModalOpen(true);
    }
  };

  return (
    <AuthLayout title="Inicia Sesión">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <CustomInput
          type="email"
          placeholder="Correo Institucional"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
        <CustomInput
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
        {/* Mensaje de error para campos vacíos */}
        <CustomButton
          type="submit"
          className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600"
        >
          Iniciar Sesión
        </CustomButton>
      </form>
      <p className="text-center mt-4">
        ¿No tienes cuenta? <LinkText href="/register">Regístrate</LinkText>
      </p>

      {/* Modal para mostrar mensajes */}
      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)} // Cerrar el modal
      />
    </AuthLayout>
  );
};

export default Login;
