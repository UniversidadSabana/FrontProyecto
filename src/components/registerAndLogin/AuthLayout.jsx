// AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] font-inter m-0 p-0">
      <div className="bg-white px-10 py-16 rounded-3xl shadow-lg w-[80%] max-w-3xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
