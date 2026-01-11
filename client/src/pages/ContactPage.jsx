import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.", {
        position: "top-center",
        autoClose: 3000,
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "2s" }}
        />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <Mail size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">
              Get In Touch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Contact
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              ClaimPoint Team
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-slate-300 max-w-3xl mx-auto"
          >
            Lost an item, need to verify a pickup, or have a staff request?
            Reach the operations desk and we will respond quickly.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-lg text-center hover:border-emerald-500/30 hover:shadow-emerald-500/20 transition-all"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Mail size={28} className="text-white" />
            </motion.div>
            <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
            <p className="text-slate-300 text-sm mb-2">
              Priority response within 4 business hours
            </p>
            <a
              href="mailto:support@claimpoint.app"
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              support@claimpoint.app
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-lg text-center hover:border-teal-500/30 hover:shadow-teal-500/20 transition-all"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Phone size={28} className="text-white" />
            </motion.div>
            <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
            <p className="text-slate-300 text-sm mb-2">
              Hotline (lost & found desk): 08:00–22:00, 7 days
            </p>
            <a
              href="tel:+8809611222333"
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              +880 9611-222333
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-lg text-center hover:border-cyan-500/30 hover:shadow-cyan-500/20 transition-all"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <MapPin size={28} className="text-white" />
            </motion.div>
            <h3 className="text-lg font-bold text-white mb-2">Visit Us</h3>
            <p className="text-slate-300 text-sm mb-2">On-site handovers</p>
            <p className="text-cyan-400 font-medium">
              Kamalapur Railway Station — Lost & Found Desk
              <br />
              Station Road, Dhaka 1205, Bangladesh
            </p>
          </motion.div>
        </div>

        {/* Service expectations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-lg mb-12"
        >
          <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-200">
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-white">Response times</div>
              <div className="text-slate-300">
                Email: under 4 business hours. Hotline: immediate during desk
                hours.
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-white">What to include</div>
              <div className="text-slate-300">
                Item type, date/time, location, and any hidden identifiers
                (IMEI, engravings, card initials).
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-white">Urgent cases</div>
              <div className="text-slate-300">
                For ID documents or medical devices, call the hotline and mark
                “Urgent” in the subject.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Send Us a Message
            </h2>
            <p className="text-slate-300">
              We typically reply within the same business day. For urgent
              handovers, call the hotline after submitting.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 bg-slate-900/50 border-2 rounded-xl text-white placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700 hover:bg-slate-900/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 bg-slate-900/50 border-2 rounded-xl text-white placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700 hover:bg-slate-900/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                className={`w-full px-4 py-3 bg-slate-900/50 border-2 rounded-xl text-white placeholder:text-slate-400 focus:outline-none transition-all ${
                  errors.subject
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700 hover:bg-slate-900/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.subject && (
                <p className="text-xs text-red-400 mt-1.5">{errors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows="6"
                className={`w-full px-4 py-3 bg-slate-900/50 border-2 rounded-xl text-white placeholder:text-slate-400 focus:outline-none transition-all resize-none ${
                  errors.message
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700 hover:bg-slate-900/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.message && (
                <p className="text-xs text-red-400 mt-1.5">{errors.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
