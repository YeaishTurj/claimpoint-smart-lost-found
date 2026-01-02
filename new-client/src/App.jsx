import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import {
  AboutPage,
  ContactPage,
  HomePage,
  LoginPage,
  RegisterPage,
  VerificationPage,
  BrowseFoundItems,
  HowItWorks,
  MyProfilePage,
  UpdateProfilePage,
  ChangePasswordPage,
} from "./pages/index.js";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Main Content Area with consistent padding */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerificationPage />} />
          <Route path="/found-items" element={<BrowseFoundItems />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
