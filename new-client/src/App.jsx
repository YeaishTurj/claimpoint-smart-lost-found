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
  BrowseFoundItems,
  HowItWorks,
} from "./pages/index.js";
import Footer from "./components/Footer";

const App = () => {
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
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
