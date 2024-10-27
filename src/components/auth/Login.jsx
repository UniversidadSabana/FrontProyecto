import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../reusable/AuthLayout"; 
import CustomInput from "../reusable/CustomInput";
import CustomButton from "../reusable/CustomButton";
import LinkText from "../reusable/LinkText";
import Swal from 'sweetalert2'; // Importamos SweetAlert2

const Login = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      setError("Por favor completa ambos campos");
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
        Swal.fire({
          title: "Error de autenticación",
          text: errorText.error,
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
        });
        return;
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      // Almacenar el token JWT en localStorage
      localStorage.setItem("token", data.token);

      // Mostrar alerta de éxito y redirigir
      Swal.fire({
        title: "Inicio de sesión exitoso",
        text: "Redirigiendo a la lista de viajes...",
        icon: "success",
        showConfirmButton: false,
        timer: 2000, // Esperar 2 segundos antes de redirigir
      }).then(() => {
        navigate("/trip-list"); // Redirigir después de la alerta
      });
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Swal.fire({
        title: "Error",
        text: "Error en la solicitud. Por favor, intenta de nuevo.",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
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
        {error && <p className="text-red-500 text-sm">{error}</p>} 
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
    </AuthLayout>
  );
};

export default Login;
