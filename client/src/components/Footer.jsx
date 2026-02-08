import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  ShieldCheck,
  Bell,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Define which routes are implemented
  const implementedRoutes = [
    "/found-items",
    "/how-it-works",
    "/register",
    "/contact",
  ];

  const handleLinkClick = (to) => {
    if (!implementedRoutes.includes(to)) {
      toast.info("🚀 This feature will be implemented soon!", {
        position: "bottom-right",
        theme: "dark",
      });
    } else {
      navigate(to);
    }
  };

  const footerLinks = {
    platform: [
      { label: "Browse Items", to: "/found-items" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Success Stories", to: "/stories" },
      { label: "Get Started", to: "/register" },
    ],
    support: [
      { label: "Help Center", to: "/help" },
      { label: "Safety Tips", to: "/safety" },
      { label: "Contact Us", to: "/contact" },
      { label: "FAQ", to: "/faq" },
    ],
    legal: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Decorative Top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-12">
        {/* Top Section - Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2.5 rounded-xl group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300"
              >
                <ShieldCheck size={28} className="text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white">
                  Claim<span className="text-emerald-400">Point</span>
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Sparkles size={10} className="text-emerald-400" />
                  Smart Lost & Found
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 mb-8">
              Bangladesh's trusted lost & found platform connecting people with
              their lost belongings through secure community verification and
              innovative technology.
            </p>

            {/* Contact Cards */}
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="p-2 bg-slate-800/60 border border-emerald-500/20 rounded-lg backdrop-blur-sm">
                  <Phone size={16} className="text-emerald-400" />
                </div>
                <a
                  href="tel:+8801700000000"
                  className="hover:text-emerald-400 transition-colors"
                >
                  +880 1700-000000
                </a>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="p-2 bg-slate-800/60 border border-emerald-500/20 rounded-lg backdrop-blur-sm">
                  <Mail size={16} className="text-emerald-400" />
                </div>
                <a
                  href="mailto:support@claimpoint.com.bd"
                  className="hover:text-emerald-400 transition-colors"
                >
                  support@claimpoint.com.bd
                </a>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 text-sm"
              >
                <div className="p-2 bg-slate-800/60 border border-emerald-500/20 rounded-lg backdrop-blur-sm mt-0.5">
                  <MapPin size={16} className="text-emerald-400" />
                </div>
                <span className="leading-relaxed">
                  Dhaka, Bangladesh
                  <br />
                  <span className="text-xs text-slate-500">
                    Serving Nationwide
                  </span>
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-10">
            {/* Platform */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">
                Platform
              </h4>
              <ul className="space-y-3.5">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.to)}
                      className="text-sm text-slate-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">
                Support
              </h4>
              <ul className="space-y-3.5">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.to)}
                      className="text-sm text-slate-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">
                Legal
              </h4>
              <ul className="space-y-3.5">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.to)}
                      className="text-sm text-slate-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-emerald-500/10 p-8 md:p-12 mb-16 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bell size={20} className="text-emerald-400" />
                <h5 className="text-lg font-semibold text-white">
                  Stay Updated
                </h5>
              </div>
              <p className="text-sm text-slate-400">
                Get notified when items matching your lost belongings are found.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="relative shrink-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full md:w-80 bg-slate-900/60 border-2 border-slate-700 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 p-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
              {subscribed && (
                <div className="absolute -bottom-8 left-0 text-xs text-emerald-400 font-medium">
                  ✓ Thanks for subscribing!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700/50 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Copyright & Social */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <p className="text-xs text-slate-500">
              © {currentYear} ClaimPoint. Registered under ICT Division,
              Bangladesh.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Instagram, label: "Instagram" },
              ].map(
                (
                  { icon: Icon, label }, // eslint-disable-line no-unused-vars
                ) => (
                  <button
                    key={label}
                    onClick={() =>
                      toast.info(`🚀 ${label} link coming soon!`, {
                        position: "bottom-right",
                        theme: "dark",
                      })
                    }
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/40 bg-gradient-to-br from-slate-900/80 to-slate-800/70 hover:from-emerald-600 hover:to-teal-600 text-slate-300 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40"
                  >
                    <Icon size={18} />
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-4 px-4 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <span className="text-xs text-slate-500 font-medium">
              Accepted Payments:
            </span>
            <div className="flex items-center gap-3">
              {["bKash", "Nagad", "SSL"].map((method) => (
                <span
                  key={method}
                  className="text-[11px] font-bold text-slate-300 tracking-wider"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </footer>
  );
};

export default Footer;
