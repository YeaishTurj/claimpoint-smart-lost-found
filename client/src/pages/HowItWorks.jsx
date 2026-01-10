import React from "react";
import {
  Search,
  FileText,
  CheckCircle,
  Package,
  UserCheck,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
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
            <Package size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">
              Simple Process
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            How ClaimPoint
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Works For You
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-slate-300 max-w-3xl mx-auto"
          >
            Two clear paths: AI auto-matching for lost reports and a verified
            claims path for found items. Staff stay in control, owners stay
            informed.
          </motion.p>
        </motion.div>

        {/* For Those Who Lost Items */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl font-bold text-white mb-8 text-center"
          >
            Lost Something? (Auto-Match Path)
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg relative hover:border-emerald-500/30 hover:shadow-emerald-500/20 transition-all"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
              >
                1
              </motion.div>
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4 mt-4">
                <Search size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Report Your Loss
              </h3>
              <p className="text-slate-300">
                Log item type, where and when it went missing, and the details
                only you know. Public vs hidden fields keep verification tight.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg relative hover:border-teal-500/30 hover:shadow-teal-500/20 transition-all"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
              >
                2
              </motion.div>
              <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center mb-4 mt-4">
                <UserCheck size={28} className="text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Let AI Suggest Matches
              </h3>
              <p className="text-slate-300">
                When staff add a matching found item, our 70/30 scoring (details
                vs location) proposes the best candidates so staff can review
                faster.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg relative hover:border-cyan-500/30 hover:shadow-cyan-500/20 transition-all"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
              >
                3
              </motion.div>
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-4 mt-4">
                <CheckCircle size={28} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Get Approved & Collect
              </h3>
              <p className="text-slate-300">
                Staff approve matches, you receive an email, and pickup is
                recorded with proper ID verification.
              </p>
            </motion.div>
          </div>
        </div>

        {/* For Those Who Found Items */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Found Something? (Claims Path)
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4 mt-4">
                <FileText size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Register the Item
              </h3>
              <p className="text-slate-300">
                Capture public details (safe to show) and hidden details
                (verification only), plus photos and location. AI compares these
                against open reports automatically.
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center mb-4 mt-4">
                <Bell size={28} className="text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Review AI Suggestions or Claims
              </h3>
              <p className="text-slate-300">
                Staff see AI matches and user-submitted claims. They approve or
                reject with full context—public details, hidden proofs, and
                score.
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-4 mt-4">
                <Package size={28} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Hand Over Confidently
              </h3>
              <p className="text-slate-300">
                Approved matches move to pickup. Collection is logged, statuses
                update to RESOLVED/RETURNED, and everyone gets a clear record.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Choose ClaimPoint?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-2">AI + Human Review</h3>
                <p className="text-emerald-100">
                  70/30 scoring plus staff approval keeps speed without giving
                  up accuracy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Dual Detail System</h3>
                <p className="text-emerald-100">
                  Public details help identify; hidden details verify ownership
                  without exposing sensitive info.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Clear Statuses</h3>
                <p className="text-emerald-100">
                  OPEN → MATCHED → RESOLVED for reports, FOUND → RETURNED for
                  items, with email updates along the way.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Auditable Handoffs</h3>
                <p className="text-emerald-100">
                  Every approval, rejection, and collection is tracked for
                  accountability and reporting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
