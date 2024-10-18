// CustomButton.jsx
import React from 'react';

const CustomButton = ({ onClick, children, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={` py-2 px-4 rounded-lg ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
