// CustomInput.jsx
import React from 'react';

const CustomInput = ({ type = "text", placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default CustomInput;
