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
  AddFoundItem,
  AddStaffPage,
  ManageUsersPage,
  UpdateStaffPage,
  ManageStaffsPage,
  ManageItemsPage,
  UpdateItemPage,
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
          <Route path="/add-found-item" element={<AddFoundItem />} />
          <Route path="/add-staff" element={<AddStaffPage />} />
          <Route path="/manage-users" element={<ManageUsersPage />} />
          <Route path="/manage-staffs" element={<ManageStaffsPage />} />
          <Route path="/update-staff/:staffId" element={<UpdateStaffPage />} />
          <Route path="/manage-items" element={<ManageItemsPage />} />
          <Route path="/update-item/:itemId" element={<UpdateItemPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
