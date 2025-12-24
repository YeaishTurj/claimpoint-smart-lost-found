import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import { AuthSection } from "./components/AuthSection";
import { OTPVerification } from "./components/OTPVerification";
import { RecordFoundItemForm } from "./components/RecordFoundItemForm";
import { ItemsList } from "./components/ItemsList";
import { StaffDashboard } from "./components/StaffDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { UserDashboard } from "./components/UserDashboard";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { BrowseFoundItemsPage } from "./pages/BrowseFoundItemsPage";
import { AddStaffPage } from "./pages/AddStaffPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { AllClaimsPage } from "./pages/AllClaimsPage";
import { ReportLostItemPage } from "./pages/ReportLostItemPage";
import api from "./services/api";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || null
  );
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null
  );
  const [user, setUser] = useState(null);
  const [foundItems, setFoundItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [showRecordItemForm, setShowRecordItemForm] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "home";
      setCurrentPage(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Fetch found items on component mount or when auth token changes
  useEffect(() => {
    fetchFoundItems();
  }, [authToken]);

  // Verify user is still logged in
  useEffect(() => {
    if (authToken) {
      verifyToken();
    }
  }, []);

  const verifyToken = async () => {
    try {
      const profileData = await api.getProfile(authToken);
      setUser(profileData.user);
      setUserRole(profileData.user.role);
    } catch (error) {
      console.error("Token verification failed:", error);
      handleLogout();
    }
  };

  const fetchFoundItems = async () => {
    setItemsLoading(true);
    try {
      const items = await api.getAllFoundItems(authToken);
      setFoundItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Failed to fetch found items:", error);
      setFoundItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleLogin = async (formData) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await api.login(formData.email, formData.password);
      const token = response.token;

      setAuthToken(token);
      localStorage.setItem("authToken", token);

      // Get user profile
      const profileData = await api.getProfile(token);
      setUser(profileData.user);
      setUserRole(profileData.user.role);
      localStorage.setItem("userRole", profileData.user.role);

      setLoginForm({ email: "", password: "" });
      setAuthError(null);
      setShowAuthModal(false);
      setCurrentPage("home");
      window.location.hash = "#home";
    } catch (error) {
      setAuthError(error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await api.register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // Show OTP verification screen
      setPendingEmail(formData.email);
      setShowOTPVerification(true);
      setAuthError(null);
    } catch (error) {
      setAuthError(error.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await api.verifyEmail(otp, pendingEmail);

      // Auto-login after email verification
      const loginResponse = await api.login(
        pendingEmail,
        registerForm.password
      );
      const token = loginResponse.token;

      setAuthToken(token);
      localStorage.setItem("authToken", token);

      // Get user profile
      const profileData = await api.getProfile(token);
      setUser(profileData.user);
      setUserRole(profileData.user.role);
      localStorage.setItem("userRole", profileData.user.role);

      // Reset forms and close modal
      setShowOTPVerification(false);
      setShowAuthModal(false);
      setRegisterForm({
        full_name: "",
        email: "",
        phone: "",
        password: "",
      });
      setPendingEmail("");
      setCurrentPage("home");
      window.location.hash = "#home";
    } catch (error) {
      setAuthError(
        error.message || "Email verification failed. Please try again."
      );
      console.error("OTP verification error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendOTP = async (email) => {
    try {
      await api.resendVerificationCode(email);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUserRole(null);
    setUser(null);
    setAuthError(null);
    setLoginForm({ email: "", password: "" });
    setRegisterForm({
      full_name: "",
      email: "",
      phone: "",
      password: "",
    });
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setCurrentPage("home");
    window.location.hash = "#home";
  };

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
    setAuthError(null);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthError(null);
  };

  // Page Rendering Logic
  const renderPage = () => {
    // Different pages
    if (currentPage === "how-it-works") {
      return (
        <HowItWorksPage
          authToken={authToken}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          onSignInClick={() => openAuthModal("login")}
          onRegisterClick={() => openAuthModal("register")}
          onRecordItemClick={() => setShowRecordItemForm(true)}
        />
      );
    }

    if (currentPage === "about") {
      return (
        <AboutPage
          authToken={authToken}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          onSignInClick={() => openAuthModal("login")}
          onRegisterClick={() => openAuthModal("register")}
          onRecordItemClick={() => setShowRecordItemForm(true)}
        />
      );
    }

    if (currentPage === "contact") {
      return (
        <ContactPage
          authToken={authToken}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          onSignInClick={() => openAuthModal("login")}
          onRegisterClick={() => openAuthModal("register")}
          onRecordItemClick={() => setShowRecordItemForm(true)}
        />
      );
    }

    if (currentPage === "browse-items") {
      return (
        <BrowseFoundItemsPage
          authToken={authToken}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          onSignInClick={() => openAuthModal("login")}
          onRegisterClick={() => openAuthModal("register")}
          onRecordItemClick={() => setShowRecordItemForm(true)}
        />
      );
    }

    if (currentPage === "add-staff") {
      return (
        <AddStaffPage
          authToken={authToken}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          onSignInClick={() => openAuthModal("login")}
          onRegisterClick={() => openAuthModal("register")}
          onRecordItemClick={() => setShowRecordItemForm(true)}
        />
      );
    }

    if (currentPage === "user-management") {
      return (
        <UserManagementPage
          authToken={authToken}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          onSignInClick={() => openAuthModal("login")}
          onRegisterClick={() => openAuthModal("register")}
          onRecordItemClick={() => setShowRecordItemForm(true)}
        />
      );
    }

    if (currentPage === "all-claims") {
      return (
        <AllClaimsPage
          authToken={authToken}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          onSignInClick={() => openAuthModal("login")}
          onRegisterClick={() => openAuthModal("register")}
          onRecordItemClick={() => setShowRecordItemForm(true)}
        />
      );
    }

    if (currentPage === "report-lost-item") {
      return (
        <ReportLostItemPage
          authToken={authToken}
          onBack={() => setCurrentPage("user-dashboard")}
        />
      );
    }

    // Default home page
    return (
      <>
        <Navbar
          authToken={authToken}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          onSignInClick={() => openAuthModal("login")}
          onRegisterClick={() => openAuthModal("register")}
          onRecordItemClick={() => setShowRecordItemForm(true)}
        />
        <div className="max-w-7xl mx-auto pt-20 px-6">
          {!authToken && <HeroSection />}

          <div className="mt-20 mb-10" id="items">
            {authToken ? (
              <div className="space-y-8">
                {/* Role-based Dashboard */}
                {userRole === "STAFF" && (
                  <StaffDashboard
                    foundItems={foundItems}
                    onRecordItemClick={() => setShowRecordItemForm(true)}
                    authToken={authToken}
                  />
                )}
                {userRole === "ADMIN" && (
                  <AdminDashboard
                    foundItems={foundItems}
                    authToken={authToken}
                  />
                )}
                {userRole === "USER" && (
                  <UserDashboard
                    foundItems={foundItems}
                    authToken={authToken}
                    onNavigate={setCurrentPage}
                  />
                )}

                {/* Items List Section */}
                <ItemsList
                  items={foundItems}
                  loading={itemsLoading}
                  userRole={userRole}
                  authToken={authToken}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {renderPage()}

      {/* Auth Modal */}
      {showAuthModal && !authToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-xl border border-white/10 w-full max-w-4xl shadow-2xl shadow-black/50 relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
            >
              ✕
            </button>
            <div className="p-8">
              {showOTPVerification ? (
                <OTPVerification
                  email={pendingEmail}
                  onVerify={handleVerifyOTP}
                  onResend={handleResendOTP}
                  loading={authLoading}
                  error={authError}
                  onBack={() => {
                    setShowOTPVerification(false);
                    setAuthError(null);
                  }}
                />
              ) : (
                <AuthSection
                  authToken={authToken}
                  authError={authError}
                  authLoading={authLoading}
                  loginForm={loginForm}
                  setLoginForm={setLoginForm}
                  onLogin={handleLogin}
                  registerForm={registerForm}
                  setRegisterForm={setRegisterForm}
                  onRegister={handleRegister}
                  initialMode={authModalMode}
                  onClose={closeAuthModal}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Record Found Item Form Modal */}
      {showRecordItemForm && authToken && userRole === "STAFF" && (
        <RecordFoundItemForm
          authToken={authToken}
          onSuccess={() => {
            setShowRecordItemForm(false);
            fetchFoundItems(); // Refresh items list
          }}
          onClose={() => setShowRecordItemForm(false)}
        />
      )}
    </>
  );
}

export default App;
