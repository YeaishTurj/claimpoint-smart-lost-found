import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl " +
        className
      }
    >
      {children}
    </div>
  );
}
