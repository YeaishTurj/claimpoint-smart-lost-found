import React from "react";
import { Users, Target, Award, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 relative overflow-hidden">
      {/* Animaound elements */}
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Users size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">
              About ClaimPoint
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Reuniting People With
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Their Lost Belongings
            </span>
          </h1>

          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            ClaimPoint is a smart lost and found management system designed to
            help people recover their lost items and enable finders to return
            found items to their rightful owners through a secure and efficient
            platform.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
              <Target size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              To create a trustworthy platform that connects people with their
              lost belongings, making the process of reporting and claiming
              items simple, secure, and efficient. We believe every lost item
              deserves a chance to find its way home.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
              <Award size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-slate-300 leading-relaxed">
              To become the leading lost and found platform that empowers
              communities to help each other. We envision a world where losing
              something doesn't mean it's gone forever, and finding something
              means making someone's day better.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-lg mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Core Values</h2>
            <p className="text-slate-300">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Community First
              </h3>
              <p className="text-sm text-slate-300">
                We build tools that strengthen community bonds and encourage
                people to help each other.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target size={24} className="text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Transparency
              </h3>
              <p className="text-sm text-slate-300">
                Every action is tracked and verified, ensuring accountability
                and trust in the system.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award size={24} className="text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Excellence</h3>
              <p className="text-sm text-slate-300">
                We strive for the highest quality in our service, technology,
                and user experience.
              </p>
            </div>
          </div>
        </div>

        {/* How We Help Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">How We Help</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            ClaimPoint bridges the gap between those who have lost something
            precious and those who have found it. We provide the tools,
            security, and platform to make returns happen efficiently.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-emerald-100">Platform Availability</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-emerald-100">Secure & Private</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Fast</div>
              <p className="text-emerald-100">Item Matching</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
