import React from "react";
import { Loader } from "lucide-react";

export default function LoadingState({ label = "Loading...", className = "" }) {
  return (
    <div
      className={`flex items-center justify-center py-24 ${className}`.trim()}
    >
      <div className="flex flex-col items-center gap-4 text-slate-300">
        <Loader className="w-10 h-10 animate-spin text-emerald-400" />
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}
