import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/auth.context";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Home,
  Info,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";
import logo from "../assets/logo2.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
  }, [isMobileMenuOpen]);

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setShowUserDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowUserDropdown(false);
    }, 150); // 150ms delay to allow moving mouse to dropdown
    setDropdownTimeout(timeout);
  };

  // Conditional navigation links based on user role
  const navLinks =
    user?.role === "ADMIN"
      ? [
          { to: "/", label: "Home", icon: Home },
          { to: "/found-items", label: "Browse Items", icon: Search },
          { to: "/manage-users", label: "Manage Users", icon: User },
          { to: "/add-staff", label: "Add Staff", icon: User },
        ]
      : [
          { to: "/", label: "Home", icon: Home },
          { to: "/found-items", label: "Browse Items", icon: Search },
          { to: "/how-it-works", label: "How It Works", icon: HelpCircle },
          { to: "/about", label: "About", icon: Info },
          { to: "/contact", label: "Contact", icon: Mail },
        ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setShowLogoutConfirm(false);
    setIsLoggingOut(true);
    await logout();
    setIsMobileMenuOpen(false);
    setIsLoggingOut(false);
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR - Professional SaaS Style */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="ClaimPoint Logo" className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(to)
                        ? "text-primary-600 bg-primary-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div
                  className="relative"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
                    <User size={16} className="text-primary-600" />
                    <span className="text-slate-800 line-clamp-1">
                      {user?.full_name || "Account"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-600 transition-transform ${
                        showUserDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">
                          {user?.full_name || "Account"}
                        </p>
                        {user?.role && (
                          <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 border border-primary-100 px-2 py-1 rounded-full inline-block mt-1">
                            {user.role}
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <Link
                        to="/my-profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-all"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all text-left"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all shadow-sm hover:shadow-md"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white shadow-2xl z-50 lg:hidden transform transition-transform">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <span className="text-lg font-semibold text-slate-900">
                  ClaimPoint
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <ul className="flex-1 overflow-y-auto p-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(to)
                        ? "text-primary-600 bg-primary-50"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Auth Buttons */}
            <div className="p-4 border-t border-slate-200 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 rounded-lg text-sm font-medium text-slate-800">
                    <User size={18} className="text-primary-600" />
                    <div className="flex flex-col">
                      <span className="line-clamp-1">
                        {user?.full_name || "Account"}
                      </span>
                      {user?.role && (
                        <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full w-fit mt-1">
                          {user.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    disabled={isLoading || isLoggingOut}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-95 rounded-lg shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <LogOut size={18} />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all shadow-sm"
                  >
                    Get Started
                    <ArrowRight size={18} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut size={20} />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">
                  Confirm logout
                </p>
                <p className="text-sm text-slate-600">
                  You will be signed out of your session.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
              >
                Stay signed in
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading || isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-95 rounded-lg shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "Signing out..." : "Yes, logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
