import React from 'react';

const NavigationBar = ({ onMenuClick }) => {
  return (
    <nav className="bg-white text-blue-800 p-4 flex justify-between">
      <h1 className="text-3xl font-bold font-inter ml-3">Wheels</h1>
      <button onClick={onMenuClick} className="text-3xl">&#9776;</button> {/* Icono del menú hamburguesa */}
    </nav>
  );
};

export default NavigationBar;
