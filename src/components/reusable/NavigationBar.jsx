import React from 'react';
import { GiCarWheel } from "react-icons/gi";


const NavigationBar = ({ onMenuClick }) => {
  return (
    <nav className="bg-white text-blue-800 p-4 flex justify-between">
      <div className='flex'>
       <GiCarWheel size={40} color="#1e3a8a" />
      <h1 className="text-3xl font-bold font-inter ml-2">GoU</h1>
      </div>
      <button onClick={onMenuClick} className="text-3xl">&#9776;</button> {/* Icono del menú hamburguesa */}
    </nav>
  );
};

export default NavigationBar;
