import React from "react";
import { Search, Plus } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Lost & Found
        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
          {" "}
          Made Simple
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-400 max-w-4xl">
        Never lose track of your belongings. Report lost items, claim found
        items, and reunite people with what matters most. ClaimPoint is your
        smart solution for managing lost and found items effortlessly.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 my-10">
        <a
          href="#"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition"
        >
          <Search size={20} />
          Search Items
        </a>
        <a
          href="#"
          className="bg-gradient-to-r from-purple-500 to-pink-500 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition"
        >
          <Plus size={20} />
          Report Item
        </a>
      </div>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="text-center">
          <div className="text-blue-400 text-4xl mb-3">📍</div>
          <h3 className="text-xl font-semibold mb-2">Smart Location Tags</h3>
          <p className="text-neutral-400">
            Tag items with exact locations for easy tracking
          </p>
        </div>
        <div className="text-center">
          <div className="text-cyan-400 text-4xl mb-3">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Quick Search</h3>
          <p className="text-neutral-400">
            Find your lost items in seconds with advanced filters
          </p>
        </div>
        <div className="text-center">
          <div className="text-purple-400 text-4xl mb-3">🔗</div>
          <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
          <p className="text-neutral-400">
            Our AI helps match lost items with found items
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
