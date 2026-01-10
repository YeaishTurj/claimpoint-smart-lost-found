import React from "react";
import { Users, Target, Award, Heart } from "lucide-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
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
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <Users size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">
              About ClaimPoint
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            AI-Powered Lost & Found
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Built for Busy Venues
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-slate-300 max-w-3xl mx-auto"
          >
            ClaimPoint connects admins, staff, and guests with a secure, AI-
            assisted flow that turns chaos at stations, airports, and campuses
            into a predictable handover: dynamic item fields, dual public vs
            hidden details, email notifications, and role-based dashboards.
          </motion.p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/30 transition-all cursor-default"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20"
            >
              <Target size={28} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              Help frontline teams close the loop faster by pairing structured
              data with human review. Every lost item gets tracked, matched, and
              reunited with evidence-based verification.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg hover:shadow-teal-500/20 hover:border-teal-500/30 transition-all cursor-default"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20"
            >
              <Award size={28} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-slate-300 leading-relaxed">
              A world where reporting, matching, and pickup are transparent—AI
              suggests, staff approves, owners get notified, and handovers are
              logged end-to-end.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Core Values</h2>
            <p className="text-slate-300">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard
              icon={<Heart size={24} className="text-emerald-400" />}
              title="Role Clarity"
              desc="Admins govern, staff verify, and users self-serve with the right access at every step."
              color="emerald"
            />
            <ValueCard
              icon={<Target size={24} className="text-teal-400" />}
              title="Traceability"
              desc="Public vs hidden details, approvals, and pickups are recorded for auditability."
              color="teal"
            />
            <ValueCard
              icon={<Award size={24} className="text-cyan-400" />}
              title="Reliability"
              desc="AI scoring (details + location), email alerts, and resilient workflows reduce misses."
              color="cyan"
            />
          </div>
        </motion.div>

        {/* How We Help Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">How We Help</h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              AI suggests matches (70% details, 30% location). Staff confirm,
              owners get notified, and handovers are logged—no more spreadsheets
              or guesswork.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <StatItem value="70/30" label="Details + Location scoring" />
              <StatItem value="Dual" label="Public & hidden proofs" />
              <StatItem value="End-to-end" label="From report to pickup" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Sub-components to keep code clean
const ValueCard = ({ icon, title, desc, color }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="text-center p-6 rounded-xl hover:bg-slate-800/30 transition-all group"
  >
    <motion.div
      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
      transition={{ duration: 0.5 }}
      className={`w-12 h-12 bg-${color}-500/10 border border-${color}-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-${color}-500/20 group-hover:border-${color}-500/40 transition-colors`}
    >
      {icon}
    </motion.div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
  </motion.div>
);

const StatItem = ({ value, label }) => (
  <motion.div whileHover={{ scale: 1.1 }} className="cursor-default">
    <div className="text-4xl font-bold mb-2">{value}</div>
    <p className="text-emerald-100 font-medium">{label}</p>
  </motion.div>
);

export default AboutPage;
