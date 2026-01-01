import React from "react";
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import {
  AboutPage,
  ContactPage,
  HomePage,
  LoginPage,
  RegisterPage,
  VerificationPage,
} from "./pages/index.js";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-screen ">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerificationPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
