import React, { useState, createContext, useContext } from 'react';

// Creamos el contexto del usuario
const UserContext = createContext();

// Custom hook para usar el contexto del usuario
export const useUser = () => {
  return useContext(UserContext);
};

// Proveedor del contexto
const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '',           // ID del usuario
    name: '',
    lastName: '',
    mail: '',
    password: '',
    contactNumber: '',
    image: null,      // Foto del perfil (URL o base64)
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
