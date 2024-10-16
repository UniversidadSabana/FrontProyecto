import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import Register from './components/Register';
import Password from './components/Password';
import Login from './components/Login'; // Nuevo componente de inicio de sesión

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password" element={<Password />} />
        <Route path="/login" element={<Login />} /> {/* Ruta para la página de inicio de sesión */}
      </Routes>
    </Router>
  );
}

export default App;
