import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router"; // Fixed: use react-router-dom
import Navbar from "./components/Navbar";
import LoginModal from "./components/modal/LoginModal";
import RegisterModal from "./components/modal/RegisterModal";
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
  ClaimItemPage,
  ClaimDetailsPage,
  AddLostItemReportPage,
  MyDashboardPage,
  UpdateReportPage,
  ManageClaimsPage,
  ManageLostReportsPage,
  ManageMatchesPage,
} from "./pages/index.js";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lastNonAuthPathRef = useRef("/");

  // Derive modal state from URL (no setState needed)
  const activeModal =
    location.pathname === "/login"
      ? "login"
      : location.pathname === "/register"
      ? "register"
      : null;

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);

    // Track last non-auth path (using ref to avoid triggering re-renders)
    if (location.pathname !== "/login" && location.pathname !== "/register") {
      lastNonAuthPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  const openLoginModal = () => navigate("/login");
  const openRegisterModal = () => navigate("/register");

  const closeModal = () => {
    // Navigate back to where the user was before the modal opened
    navigate(lastNonAuthPathRef.current, { replace: true });
  };

  const switchToRegister = () => navigate("/register", { replace: true });
  const switchToLogin = () => navigate("/login", { replace: true });

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        onLoginClick={openLoginModal}
        onRegisterClick={openRegisterModal}
      />

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

          {/* User Routes */}
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/my-dashboard" element={<MyDashboardPage />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/claim/:itemId" element={<ClaimItemPage />} />
          <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          <Route path="/report-lost-item" element={<AddLostItemReportPage />} />
          <Route
            path="/update-lost-report/:id"
            element={<UpdateReportPage />}
          />

          {/* Staff/Admin Routes */}
          <Route path="/add-found-item" element={<AddFoundItem />} />
          <Route path="/add-staff" element={<AddStaffPage />} />
          <Route path="/manage-users" element={<ManageUsersPage />} />
          <Route path="/manage-staffs" element={<ManageStaffsPage />} />
          <Route path="/update-staff/:staffId" element={<UpdateStaffPage />} />
          <Route path="/manage-items" element={<ManageItemsPage />} />
          <Route path="/update-item/:itemId" element={<UpdateItemPage />} />
          <Route path="/manage-claims" element={<ManageClaimsPage />} />
          <Route
            path="/manage-lost-reports"
            element={<ManageLostReportsPage />}
          />
          <Route path="/manage-matches" element={<ManageMatchesPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Modals are rendered conditionally based on activeModal state.
          This allows the background page to remain visible if desired.
      */}
      {activeModal === "login" && (
        <LoginModal
          isOpen={true}
          onClose={closeModal}
          onSwitchToRegister={switchToRegister}
        />
      )}

      {activeModal === "register" && (
        <RegisterModal
          isOpen={true}
          onClose={closeModal}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </div>
  );
};

export default App;
