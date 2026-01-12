import React from "react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={
        "text-center p-12 sm:p-14 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl " +
        className
      }
    >
      {Icon ? (
        <div className="w-16 h-16 bg-slate-800/60 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Icon size={30} className="text-slate-400" />
        </div>
      ) : null}
      {title ? (
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      ) : null}
      {description ? (
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
