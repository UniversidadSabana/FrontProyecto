// LinkText.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // O next/link si estás usando Next.js

const LinkText = ({ href, children }) => {
  return (
    <Link to={href} className="text-blue-500 hover:underline">
      {children}
    </Link>
  );
};

export default LinkText;
