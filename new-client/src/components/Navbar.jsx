import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/auth.context";
import { motion, AnimatePresence } from "framer-motion"; // Added for modern feel
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
  LayoutDashboard,
} from "lucide-react";
import logo from "../assets/logo3.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
  }, [isMobileMenuOpen]);

  const navLinks =
    user?.role === "ADMIN"
      ? [
          { to: "/", label: "Home", icon: Home },
          { to: "/found-items", label: "Browse Found Items", icon: Search },
          { to: "/manage-users", label: "Users", icon: User },
          { to: "/manage-staffs", label: "Staffs", icon: LayoutDashboard },
          { to: "/add-staff", label: "Add Staff", icon: User },
        ]
      : user?.role === "STAFF"
      ? [
          { to: "/", label: "Home", icon: Home },
          { to: "/manage-items", label: "Manage Items", icon: LayoutDashboard },
          { to: "/add-found-item", label: "Add Found Item", icon: Search },
        ]
      : [
          { to: "/", label: "Home", icon: Home },
          { to: "/found-items", label: "Browse Found Items", icon: Search },
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
      {/* Floating Navbar Container */}
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="w-full max-w-7xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl pointer-events-auto overflow-visible">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo Area */}
              <Link
                to="/"
                className="flex items-center group transition-transform active:scale-95"
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="h-9 w-auto brightness-110"
                />
                {/* <span className="ml-2 font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 hidden sm:block">
                  ClaimPoint
                </span> */}
              </Link>

              {/* Desktop Nav Links */}
              <ul className="hidden lg:flex items-center bg-slate-800/40 p-1 rounded-xl border border-white/5">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive(to)
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {isActive(to) && (
                        <motion.div
                          layoutId="nav-bg"
                          className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/30 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        />
                      )}
                      <Icon
                        size={15}
                        className={isActive(to) ? "text-emerald-400" : ""}
                      />
                      <span className="relative z-10">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center gap-4">
                {isAuthenticated ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowUserDropdown(true)}
                    onMouseLeave={() => setShowUserDropdown(false)}
                  >
                    <button className="flex items-center gap-2.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group">
                      <div className="w-7 h-7 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-[10px] font-bold text-slate-900">
                        {user?.full_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                        {user?.full_name?.split(" ")[0]}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-slate-500 transition-transform ${
                          showUserDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {showUserDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 origin-top-right overflow-hidden"
                        >
                          <div className="px-3 py-3 mb-2 bg-white/5 rounded-xl">
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                              Signed in as
                            </p>
                            <p className="text-sm text-white truncate font-medium">
                              {user?.full_name}
                            </p>
                            <span className="mt-1 inline-flex text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              {user?.role}
                            </span>
                          </div>
                          <Link
                            to="/my-profile"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <User size={16} /> My Profile
                          </Link>
                          <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      <LogIn size={16} />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                    >
                      Join now
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar (Slide-in) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-slate-900 z-[70] border-l border-white/10 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-white/5 rounded-full"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive(to)
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-rose-500/10 text-rose-400 rounded-xl font-medium"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full p-3 text-slate-300 border border-white/10 rounded-xl"
                    >
                      <LogIn size={18} />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full p-3 bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20"
                    >
                      Get Started
                      <ArrowRight size={18} />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modern Centered Modal for Logout */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <LogOut size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to leave?
              </h3>
              <p className="text-slate-400 text-sm mb-8">
                You'll need to log back in to manage your items.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="p-3 text-sm font-semibold text-slate-400 hover:text-white bg-white/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="p-3 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoggingOut ? "Closing..." : "Logout"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
