import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../registerAndLogin/UserContext'; // Asume que tienes un UserContext para gestionar el estado del usuario

const Sidebar = ({ onClose }) => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('https://wheels-backend-rafaelsavas-projects.vercel.app/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      setProfile(data);
      console.log('Perfil:', data);
    };

    fetchProfile();
  }, []);

  // Manejar clic fuera del Sidebar
  const handleOutsideClick = (e) => {
    if (e.target.id === 'sidebarOverlay') {
      onClose();
    }
  };

  // Función para redirigir al perfil según el rol del usuario
  const handleProfileClick = () => {
    if (user.isDriver) {
      navigate('/profile-setup'); // Si es conductor, redirige a la configuración del conductor
    } else {
      navigate('/profile-passenger'); // Si es pasajero, redirige a la configuración del pasajero
    }
  };
  

  if (!profile) {
    return <p>Cargando...</p>;
  }

  return (
    <div
      id="sidebarOverlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      onClick={handleOutsideClick} // Detectar clics fuera del Sidebar para cerrarlo
    >
      <div className="bg-white w-80 p-6 shadow-lg">
        <button onClick={onClose} className="text-left text-3xl text-blue-800 mb-4">
          &#9776; {/* Icono del menú */}
        </button>
        <div>
          {/* Imagen de perfil proveniente del backend en base64 */}
          <img
            src={profile.image}
            alt="Profile"
            className="rounded-full w-24 h-24 mx-auto bg-center my-2 bg-cover mb-5 border-2 border-blue-800"
          />
          <h2 className="text-xl font-bold mt-4 text-blue-900">
            {profile.name} {profile.lastName}
          </h2>
          <p className="text-blue-700 text-sm">{profile.mail}</p>
          <ul className="mt-4 space-y-2">
            <li className="py-2 text-blue-700 font-semibold cursor-pointer">
              Ver viajes disponibles
            </li>
            <li onClick={() => navigate('/trip-list')} className="py-2 text-blue-700 font-semibold cursor-pointer">
              Gestionar Viajes
            </li>
            <li onClick={handleProfileClick} className="py-2 text-blue-700 font-semibold cursor-pointer">
              Perfil
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
