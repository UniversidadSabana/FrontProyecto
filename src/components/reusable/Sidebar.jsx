import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onClose, isDriver }) => {
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

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!profile) {
    return <p>Cargando...</p>;
  }

  return (
    <div
      id="sidebarOverlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white w-80 p-6 shadow-lg flex flex-col justify-between h-full">
        <button onClick={onClose} className="text-left text-3xl text-blue-800 mb-4">
          &#9776;
        </button>
        
        {/* Contenido del perfil */}
        <div>
          <img
            src={profile.image}
            alt="Profile"
            className="rounded-full w-24 h-24 mx-auto bg-center my-2 bg-cover mb-5 border-2 border-blue-800"
          />
          <h2 className="text-xl font-bold mt-4 text-blue-900 text-center">
            {profile.name} {profile.lastName}
          </h2>
          <p className="text-blue-700 text-sm text-center">{profile.mail}</p>
          <ul className="mt-4 space-y-2">
            {isDriver ? (
              <>
                <li className="py-2 text-blue-700 font-semibold cursor-pointer" onClick={() => navigate('/view-vehicle')}>
                  Ver Auto registrado
                </li>
              </>
            ) : (
              <>
                
                <li className="py-2 text-blue-700 font-semibold cursor-pointer" onClick={() => navigate('/my-reservations')}>
                  Gestionar Viajes
                </li>
              </>
            )}
            <li className="py-2 text-blue-700 font-semibold cursor-pointer" onClick={() => navigate('/profile-passenger')}>
              Perfil
            </li>
          </ul>
        </div>
        
        {/* Botón de cerrar sesión al fondo del Sidebar */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
