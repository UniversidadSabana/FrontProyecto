import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/registerAndLogin/Welcome';
import Register from './components/registerAndLogin/Register';
import Password from './components/registerAndLogin/Password';
import ProfileSetup from './components/registerAndLogin/ProfileSetup';
import AddVehicle from './components/registerAndLogin/AddVehicle';
import UserProvider  from './components/registerAndLogin/UserContext';
import Login from './components/registerAndLogin/Login';
function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password" element={<Password />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
