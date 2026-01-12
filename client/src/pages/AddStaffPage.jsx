import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  UserPlus,
  Mail,
  User,
  Phone,
  ArrowLeft,
  Loader,
  Save,
  AlertCircle,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import { PageShell } from "../components/layout";
import { AccessCard } from "../components/ui";

const AddStaffPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  if (!isAuthenticated) {
    return (
      <PageShell variant="centered">
        <AccessCard />
      </PageShell>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = "Full name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post("/admin/staffs", formData);
      toast.success("Staff member added successfully!");
      setTimeout(() => navigate("/manage-staffs"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add staff member"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <UserPlus size={24} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Add Staff Member
            </h1>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 overflow-hidden">
          {/* Notice Banner */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-l-4 border-emerald-500 px-6 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-emerald-400 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-100 text-sm mb-1">
                  Staff Account Creation
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Staff members will have elevated privileges to manage found
                  items and assist users. A default password will be assigned.
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <User size={16} className="text-emerald-400" />
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all bg-slate-950/50 text-white placeholder:text-slate-500 ${
                  errors.full_name
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700/50 focus:border-emerald-500"
                }`}
              />
              {errors.full_name && (
                <p className="text-xs text-red-400 mt-1">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Mail size={16} className="text-emerald-400" />
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all bg-slate-950/50 text-white placeholder:text-slate-500 ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700/50 focus:border-emerald-500"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Phone size={16} className="text-emerald-400" />
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all bg-slate-950/50 text-white placeholder:text-slate-500 ${
                  errors.phone
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700/50 focus:border-emerald-500"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-800/50">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3.5 border-2 border-slate-700/50 text-slate-300 font-semibold rounded-xl hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Add Staff Member</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Need help? Contact your system administrator for assistance.
          </p>
        </div>
      </div>
    </PageShell>
  );
};

export default AddStaffPage;
