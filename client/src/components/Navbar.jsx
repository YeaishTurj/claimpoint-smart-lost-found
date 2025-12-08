import {
  Menu,
  X,
  LogOut,
  User,
  Package,
  ClipboardList,
  Users,
  Settings,
  FileText,
  CheckSquare,
} from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";

const Navbar = ({
  authToken,
  user,
  userRole,
  onLogout,
  onSignInClick,
  onRegisterClick,
  onRecordItemClick,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (!authToken) {
      return [
        { label: "Home", href: "/", icon: null },
        { label: "About", href: "#about", icon: null },
        { label: "Contact", href: "#contact", icon: null },
      ];
    }

    // General User Navigation
    if (userRole === "USER") {
      return [
        { label: "Dashboard", href: "/", icon: null },
        { label: "Browse Items", href: "#items", icon: Package },
        { label: "Report Lost Item", href: "#report-lost", icon: FileText },
        { label: "My Claims", href: "#my-claims", icon: ClipboardList },
      ];
    }

    // Staff Navigation
    if (userRole === "STAFF") {
      return [
        { label: "Found Items", href: "#items", icon: Package },
        {
          label: "Record Found Item",
          action: "recordItem",
          icon: ClipboardList,
        },
        { label: "Review Claims", href: "#review-claims", icon: CheckSquare },
        { label: "My Recordings", href: "#my-recordings", icon: FileText },
      ];
    }

    // Admin Navigation
    if (userRole === "ADMIN") {
      return [
        { label: "Dashboard", href: "#dashboard", icon: Settings },
        { label: "All Items", href: "#items", icon: Package },
        { label: "Add Staff", href: "#add-staff", icon: Users },
        { label: "User Management", href: "#user-management", icon: Users },
        { label: "Claims", href: "#all-claims", icon: CheckSquare },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 bg-slate-900/50">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">ClaimPoint</span>
            {authToken && userRole && (
              <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                {userRole === "USER"
                  ? "User"
                  : userRole === "STAFF"
                  ? "Staff"
                  : "Admin"}
              </span>
            )}
          </div>
          <ul className="hidden lg:flex ml-14 space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.action ? (
                  <button
                    onClick={() => {
                      if (item.action === "recordItem" && onRecordItemClick) {
                        onRecordItemClick();
                      }
                    }}
                    className="flex items-center gap-2 hover:text-blue-400 transition"
                  >
                    {item.icon && <item.icon size={16} />}
                    {item.label}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center gap-2 hover:text-blue-400 transition"
                  >
                    {item.icon && <item.icon size={16} />}
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-3 items-center">
            {authToken ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40">
                  <User size={16} className="text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">
                    {user?.full_name || "User"}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onSignInClick}
                  className="py-2 px-4 border rounded-lg hover:bg-white/10 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={onRegisterClick}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 py-2 px-4 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            {authToken && userRole && (
              <div className="mb-6 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40">
                <span className="text-sm font-semibold text-blue-300">
                  {userRole === "USER"
                    ? "User Account"
                    : userRole === "STAFF"
                    ? "Staff Account"
                    : "Admin Account"}
                </span>
              </div>
            )}
            <ul className="mb-8 w-full">
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  {item.action ? (
                    <button
                      onClick={() => {
                        if (item.action === "recordItem" && onRecordItemClick) {
                          onRecordItemClick();
                        }
                        setMobileDrawerOpen(false);
                      }}
                      className="flex items-center gap-2 hover:text-blue-400 transition w-full text-left"
                    >
                      {item.icon && <item.icon size={16} />}
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center gap-2 hover:text-blue-400 transition"
                      onClick={() => setMobileDrawerOpen(false)}
                    >
                      {item.icon && <item.icon size={16} />}
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            {authToken ? (
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40">
                  <User size={16} className="text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">
                    {user?.full_name || "User"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileDrawerOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    onSignInClick();
                    setMobileDrawerOpen(false);
                  }}
                  className="text-center py-2 px-4 border rounded-lg hover:bg-white/10 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onRegisterClick();
                    setMobileDrawerOpen(false);
                  }}
                  className="text-center bg-gradient-to-r from-blue-500 to-cyan-500 py-2 px-4 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
