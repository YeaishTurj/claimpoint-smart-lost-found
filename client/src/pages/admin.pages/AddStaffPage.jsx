import { useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { AlertCircle, CheckCircle } from "lucide-react";

export function AddStaffPage({
  authToken,
  user,
  userRole,
  onLogout,
  onSignInClick,
  onRegisterClick,
}) {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validation
    if (!formData.email || !formData.full_name || !formData.phone) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const result = await api.addStaff(formData, authToken);
      setMessage(
        `Staff member "${formData.full_name}" added successfully! They can login with: ${formData.email}`
      );
      setFormData({ email: "", full_name: "", phone: "" });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setError(err.message || "Failed to add staff member");
    } finally {
      setLoading(false);
    }
  };

  const navbarProps = {
    authToken,
    user,
    userRole,
    onLogout,
    onSignInClick,
    onRegisterClick,
  };

  return (
    <>
      <Navbar {...navbarProps} />
      <div className="max-w-4xl mx-auto pt-20 px-6 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Add Staff Member
          </h1>
          <p className="text-gray-400 text-lg">
            Create a new staff account with default credentials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertCircle
                      className="text-red-400 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <p className="text-red-200">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {message && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <CheckCircle
                      className="text-green-400 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <p className="text-green-200">{message}</p>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="staff@example.com"
                    className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900"
                    disabled={loading}
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Ahmed Hassan"
                    className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900"
                    disabled={loading}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1234 567890"
                    className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900"
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition duration-200"
                >
                  {loading ? "Adding Staff..." : "Add Staff Member"}
                </button>
              </form>
            </div>
          </div>

          {/* Info Box */}
          <div className="lg:col-span-1">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-200 mb-4">
                Default Credentials
              </h3>
              <p className="text-sm text-blue-100 mb-4">
                The staff member will receive a default password via their email
                or can use the password set in your environment.
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Email:</p>
                  <p className="text-white font-mono bg-slate-900/50 p-2 rounded">
                    {formData.email || "staff@example.com"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Default Password:</p>
                  <p className="text-blue-300 text-xs">
                    Set in environment configuration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
