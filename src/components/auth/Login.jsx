import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import AuthLayout from "../reusable/AuthLayout";
import CustomInput from "../reusable/CustomInput";
import CustomButton from "../reusable/CustomButton";
import LinkText from "../reusable/LinkText";
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react'; // Importa los iconos de Lucide

const Login = () => {
  const { user, setUser } = useUser();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const verifyToken = async (token) => {
    try {
      const response = await fetch(
        "https://wheels-backend-rafaelsavas-projects.vercel.app/api/verify-token",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
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

    if (!mail || !password) {
      setError("Por favor completa ambos campos");
      return;
    }

    const loginData = { mail, password };

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
      setUser({ id: data.userId });
      console.log("Respuesta del backend:", data);

      localStorage.setItem("token", data.token);

      Swal.fire({
        title: "Inicio de sesión exitoso",
        text: "Redirigiendo a la lista de viajes...",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate("/trip-list");
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
        <div className="relative">
          <CustomInput
            type={showPassword ? "text" : "password"} // Cambia el tipo según el estado
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
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
