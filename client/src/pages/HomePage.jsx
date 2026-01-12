import React from "react";
import { Link } from "react-router";
import {
  Search,
  Package,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Building2,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "../assets/hero.jpg";
import { useAuth } from "../context/auth.context";
import { PageShell } from "../components/layout";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <PageShell
      variant="wide"
      className="relative bg-[#020617]" // Deepest slate for maximum contrast
      containerClassName="max-w-7xl"
    >
      {/* --- High-Visibility Hero Section --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-12 lg:py-24">
        {/* Optimized Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* High-contrast glow spots */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px]" />

          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(100%)", // Removes color noise for better text clarity
            }}
          />
          {/* Vignette overlay to keep focus on center */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]" />
        </div>

        <div className="relative z-10 w-full px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/50 border border-emerald-500/40 backdrop-blur-md mb-8"
            >
              <ShieldCheck size={16} className="text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-50 text-white">
                Trusted Lost & Found Network
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1]"
            >
              Lost it?
              <span className="text-emerald-400"> We’ll help </span>
              find it.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-sm"
            >
              The most reliable platform in Bangladesh for reuniting owners with
              their lost belongings through verified community reporting.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {user && (user.role === "ADMIN" || user.role === "USER") && (
                <Link
                  to="/found-items"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Search size={20} strokeWidth={3} />
                  Find My Item
                </Link>
              )}

              {user && user.role === "USER" && (
                <Link
                  to="/report-lost-item"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-slate-800 text-white font-bold rounded-xl border-2 border-slate-700 hover:bg-slate-700 hover:border-emerald-500/50 transition-all"
                >
                  <Package size={20} />
                  Report a Loss
                </Link>
              )}
            </motion.div>
          </div>

          {/* --- High Visibility Info Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <InfoCard
              icon={<CheckCircle2 className="text-emerald-400" />}
              title="Verified Ownership"
              desc="Our team ensures claims are backed by proof, preventing unauthorized pickups."
            />
            <InfoCard
              icon={<Clock className="text-emerald-400" />}
              title="Real-time Alerts"
              desc="Get instant notifications when an item matching your description is logged."
            />
            <InfoCard
              icon={<Building2 className="text-emerald-400" />}
              title="Partner Hubs"
              desc="Available at major airports, train stations, and shopping malls nationwide."
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
};

const InfoCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-colors backdrop-blur-md">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;
