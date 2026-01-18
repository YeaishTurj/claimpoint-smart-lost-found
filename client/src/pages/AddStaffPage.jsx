import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  UserPlus,
  Mail,
  User,
  Phone,
  ArrowLeft,
  Loader2,
  Save,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import { PageShell } from "../components/layout";
import { AccessCard } from "../components/ui";

const AddStaffPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  // Security Guard: Only Admins should ideally reach this
  if (!isAuthenticated) {
    return (
        <AccessCard
          icon={Fingerprint}
          title="Security Clearance Required"
          description="Administrative authentication is required to onboard new personnel."
        />
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim())
      newErrors.full_name = "Identity string required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid digital address";
    if (formData.phone.trim().length < 10)
      newErrors.phone = "Invalid telemetry sequence";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post("/admin/staffs", formData);
      toast.success("Personnel registered successfully", { theme: "dark" });
      setTimeout(() => navigate("/manage-staffs"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registry update failed", {
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto pt-15">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-400 transition-all mb-10"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Management Center
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Onboarding Form */}
          <div className="lg:col-span-8 space-y-8">
            <header>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Personnel <span className="text-emerald-500">Onboarding.</span>
              </h1>
              <p className="text-slate-400 font-medium">
                Register a new staff member with elevated operational
                privileges.
              </p>
            </header>

            <form id="staff-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-[#0b1120] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="px-8 py-5 border-b border-slate-800 bg-slate-900/30 flex items-center gap-3">
                  <UserPlus size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Identity Parameters
                  </span>
                </div>
                <div className="p-8 space-y-8">
                  <FormInput
                    label="Full Legal Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g., Jonathan Wick"
                    icon={User}
                    error={errors.full_name}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Corporate Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@portal.com"
                      icon={Mail}
                      error={errors.email}
                    />
                    <FormInput
                      label="Contact Telemetry"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      icon={Phone}
                      error={errors.phone}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-10">
            <div className="bg-[#0b1120] border border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={14} className="text-emerald-500" />
                System Permissions
              </h3>
              <ul className="space-y-4">
                <GuidelineItem text="Staff accounts inherit Found Item Management rights." />
                <GuidelineItem text="A temporary system password will be generated automatically." />
                <GuidelineItem text="Credentials should be rotated upon initial login." />
              </ul>
            </div>

            {/* Sticky Actions */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                form="staff-form"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    Commit Personnel Registry
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-4 bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-white transition-all"
              >
                Abort Onboarding
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

// --- Local Sub-Components ---

const FormInput = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className={`w-full bg-slate-950 border-2 pl-14 pr-6 py-4 rounded-2xl text-white font-bold transition-all focus:outline-none placeholder:text-slate-800 ${
          error
            ? "border-rose-500/50 focus:border-rose-500"
            : "border-slate-800 focus:border-emerald-500"
        }`}
      />
    </div>
    {error && (
      <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-4">
        {error}
      </p>
    )}
  </div>
);

const GuidelineItem = ({ text }) => (
  <li className="flex items-start gap-3">
    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
    <span className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
      {text}
    </span>
  </li>
);

export default AddStaffPage;
