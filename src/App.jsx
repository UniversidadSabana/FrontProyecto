import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./components/auth/Welcome";
import Register from "./components/auth/Register";
import Password from "./components/auth/Password";
import ProfileSetup from "./components/profile/ProfileSetup";
import AddVehicle from "./components/profile/AddVehicle";
import UserProvider from "./components/auth/UserContext";
import Login from "./components/auth/Login";
import TripList from "./components/trip/TripList";
import TripDetails from "./components/trip/TripDetails";
import ProfilePassenger from "./components/profile/ProfilePassenger";
import ManageTrips from "./components/driver/ManageTrips"; // Importa el nuevo componente
import MyReservations from "./components/passengerBar/Reservations";
import RegisterTrip from "./components/driver/RegisterTrip";
import ViewVehicle from "./components/driver/ViewVehicle";
import EditVehicle from "./components/driver/EditVehicle";
function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password" element={<Password />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/trip-list" element={<TripList />} />
          <Route path="/trip-details/:tripId" element={<TripDetails />} />
          <Route path="/profile-passenger" element={<ProfilePassenger />} />
          <Route path="/manage-trips" element={<ManageTrips />} />{" "}
          {/* Nueva ruta */}
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/register-trip" element={<RegisterTrip />} />
          <Route path="/view-vehicle" element={<ViewVehicle />} />
          <Route path="/edit-vehicle" element={<EditVehicle />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
