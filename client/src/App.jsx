import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import StaffLogin from "./pages/StaffLogin";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import SuperadminLogin from "./pages/SuperadminLogin";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/staff-login" element={<StaffLogin />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-signup" element={<UserSignUp />} />
      <Route path="/superadmin-login" element={<SuperadminLogin />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
