import React from "react";
import { Link } from "react-router";
import {
  Search,
  Package,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "../assets/hero.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
          />
        </div>
        {/* Background image + overlay */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6 backdrop-blur-sm"
            >
              <Shield size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">
                Smart Lost & Found Platform
              </span>
              <Sparkles size={14} className="text-emerald-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Reunite People With Their Belongings
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                Secure. Verified. Community Driven.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              ClaimPoint is Bangladesh's trusted lost & found platform—built for
              stations, airports, hospitals, universities, and malls—to verify,
              match, and return items safely.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/found-items"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all"
                >
                  <Search size={20} />
                  Browse Found Items
                  <ArrowRight size={20} />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/add-found-item"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/80 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-emerald-500/50 hover:border-emerald-400 hover:bg-slate-700/80 transition-all shadow-lg"
                >
                  <Package size={20} />
                  Report Found Item
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10"
              >
                <Search size={26} className="text-emerald-400" />
              </motion.div>
              <h3 className="relative text-xl font-bold text-white mb-3">
                Easy Search
              </h3>
              <p className="relative text-slate-300 leading-relaxed">
                Quickly browse through found items with smart filters and clear,
                verified listings.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/20 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative w-14 h-14 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/10"
              >
                <Package size={26} className="text-teal-400" />
              </motion.div>
              <h3 className="relative text-xl font-bold text-white mb-3">
                Report Items
              </h3>
              <p className="relative text-slate-300 leading-relaxed">
                Staff or public can submit found items with flexible details—no
                rigid templates needed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/10"
              >
                <Shield size={26} className="text-cyan-400" />
              </motion.div>
              <h3 className="relative text-xl font-bold text-white mb-3">
                Secure & Verified
              </h3>
              <p className="relative text-slate-300 leading-relaxed">
                AI-assisted matching plus manual verification ensure returns go
                to rightful owners.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
