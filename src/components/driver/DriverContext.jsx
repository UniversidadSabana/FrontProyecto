import React, { useState, createContext, useContext } from 'react';

// Creamos el contexto del usuario
const DriverContext = createContext();

// Custom hook para usar el contexto del usuario
export const useDriver = () => {
  return useContext(DriverContext);
};

// Proveedor del contexto
const DriverProvider = ({ children }) => {
    const [isDriver, setIsDriver] = useState(false);

  return (
    <DriverContext.Provider value={{ isDriver, setIsDriver }}>
      {children}
    </DriverContext.Provider>
  );
};

export default DriverProvider;
