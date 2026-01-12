import React from "react";

const variants = {
  primary:
    "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20",
  secondary:
    "bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10",
  danger:
    "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20",
  ghost: "bg-transparent hover:bg-white/5 text-slate-200",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const v = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${v} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
