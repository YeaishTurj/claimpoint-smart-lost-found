import React from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className = "",
}) {
  return (
    <div className={`mb-8 ${className}`.trim()}>
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm mb-5">
          {Icon ? <Icon size={16} className="text-emerald-400" /> : null}
          <span className="text-sm font-semibold text-emerald-300">
            {eyebrow}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          {title ? (
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="text-slate-400 mt-2 max-w-2xl">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}
