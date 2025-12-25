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
  onNavigate,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (!authToken) {
      return [
        { label: "Home", href: "#home", icon: null },
        { label: "Browse Found Items", href: "#browse-items", icon: Package },
        { label: "How It Works", href: "#how-it-works", icon: FileText },
        { label: "About", href: "#about", icon: null },
        { label: "Contact", href: "#contact", icon: null },
      ];
    }

    // General User Navigation
    if (userRole === "USER") {
      return [
        { label: "Dashboard", action: "dashboard", icon: null },
        {
          label: "Browse Found Items",
          action: "browseFoundItems",
          icon: Package,
        },
        { label: "Report Lost Item", action: "reportLostItem", icon: FileText },
        {
          label: "My Reports",
          action: "myReports",
          icon: ClipboardList,
        },
        {
          label: "My Claims",
          action: "myClaims",
          icon: ClipboardList,
        },
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
          <div className="flex items-center shrink-0">
            <img className="h-10 w-auto mr-2" src={logo} alt="Logo" />
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

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex ml-14 space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.action ? (
                  <button
                    onClick={() => {
                      // ...existing code...
                      if (item.action === "dashboard" && typeof onNavigate === "function") {
                        onNavigate("dashboard");
                        window.location.hash = "#dashboard";
                      }
                      if (item.action === "recordItem" && onRecordItemClick) {
                        onRecordItemClick();
                      }
                      if (item.action === "browseFoundItems" && typeof onNavigate === "function") {
                        onNavigate("browsefounditems");
                        window.location.hash = "#browsefounditems";
                      }
                      if (item.action === "reportLostItem" && typeof onNavigate === "function") {
                        onNavigate("reportlostitem");
                        window.location.hash = "#reportlostitem";
                      }
                      if (item.action === "myReports" && typeof onNavigate === "function") {
                        onNavigate("myreports");
                        window.location.hash = "#myreports";
                      }
                      if (item.action === "myClaims" && typeof onNavigate === "function") {
                        onNavigate("myclaims");
                        window.location.hash = "#myclaims";
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-500/10 hover:text-blue-400 transition font-medium"
                  >
                    {item.icon && <item.icon size={18} />}
                    {item.label}
                  </button>
                ) : (
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof onNavigate === "function") {
                        onNavigate(item.href.replace("#", ""));
                      }
                    }}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-500/10 hover:text-blue-400 transition font-medium"
                  >
                    {item.icon && <item.icon size={18} />}
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            {authToken ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40">
                  <User size={18} className="text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">
                    {user?.full_name || "User"}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
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
                  className="bg-linear-to-r from-blue-500 to-cyan-500 py-2 px-4 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex">
            <button onClick={toggleNavbar} className="text-white">
              {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={toggleNavbar}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-slate-900/95 backdrop-blur-lg border-l border-neutral-700/80 p-6 transform transition-transform duration-300 ease-in-out z-50 ${
              mobileDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center shrink-0">
                <img className="h-10 w-auto mr-2" src={logo} alt="Logo" />
                <span className="text-xl tracking-tight">ClaimPoint</span>
              </div>
              <button
                onClick={toggleNavbar}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            <ul className="mb-8 w-full">
              {navItems.map((item, index) => (
                <li key={index} className="py-2">
                  {item.action ? (
                    <button
                      onClick={() => {
                        if (item.action === "recordItem" && onRecordItemClick) {
                          onRecordItemClick();
                        }
                        if (
                          item.action === "browseFoundItems" &&
                          typeof onNavigate === "function"
                        ) {
                          onNavigate("browseFoundItems");
                        }
                        if (
                          item.action === "myReports" &&
                          typeof onNavigate === "function"
                        ) {
                          onNavigate("myReports");
                        }
                        if (
                          item.action === "myClaims" &&
                          typeof onNavigate === "function"
                        ) {
                          onNavigate("myClaims");
                        }
                        setMobileDrawerOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-500/10 hover:text-blue-400 transition w-full text-left font-medium"
                    >
                      {item.icon && <item.icon size={18} />}
                      {item.label}
                    </button>
                  ) : (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof onNavigate === "function") {
                          onNavigate(item.href.replace("#", ""));
                        }
                        setMobileDrawerOpen(false);
                      }}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-500/10 hover:text-blue-400 transition w-full font-medium"
                    >
                      {item.icon && <item.icon size={18} />}
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            {authToken ? (
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40">
                  <User size={18} className="text-blue-400" />
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
                  <LogOut size={18} />
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
                  className="text-center bg-linear-to-r from-blue-500 to-cyan-500 py-2 px-4 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
