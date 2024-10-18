import React, { useEffect, useState } from 'react';

const Sidebar = ({ onClose }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('http://localhost:5000/api/profile', {
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
            <li className="py-2 text-blue-700 font-semibold cursor-pointer">
              Gestionar Viajes
            </li>
            <li className="py-2 text-blue-700 font-semibold cursor-pointer">
              Perfil
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
