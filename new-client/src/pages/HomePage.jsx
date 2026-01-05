import React from "react";
import { Link } from "react-router";
import { Search, Package, Shield, ArrowRight } from "lucide-react";
import heroImage from "../assets/hero.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background image + overlay */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">
                Smart Lost & Found Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Reunite People With Their Belongings
              <br />
              <span className="text-emerald-400">
                Secure. Verified. Community Driven.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              ClaimPoint is Bangladesh's trusted lost & found platform—built for
              stations, airports, hospitals, universities, and malls—to verify,
              match, and return items safely.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/found-items"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all"
              >
                <Search size={20} />
                Browse Found Items
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/add-found-item"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg border-2 border-emerald-500/50 hover:border-emerald-400 hover:bg-slate-700 transition-all shadow-sm"
              >
                <Package size={20} />
                Report Found Item
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <Search size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Easy Search
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Quickly browse through found items with smart filters and clear,
                verified listings.
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                <Package size={24} className="text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Report Items
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Staff or public can submit found items with flexible details—no
                rigid templates needed.
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <Shield size={24} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Secure & Verified
              </h3>
              <p className="text-slate-300 leading-relaxed">
                AI-assisted matching plus manual verification ensure returns go
                to rightful owners.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
