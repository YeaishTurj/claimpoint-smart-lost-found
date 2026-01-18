import React from "react";

const shellVariants = {
  default: {
    outer:
      "min-h-screen bg-[#020617] selection:bg-emerald-500/30 selection:text-emerald-200",
    padding: "py-12 px-4 sm:px-6 lg:px-8",
    container: "max-w-6xl mx-auto",
  },
  wide: {
    outer: "min-h-screen bg-[#020617] selection:bg-emerald-500/30",
    padding: "py-12 px-4 sm:px-6 lg:px-8",
    container: "max-w-[90rem] mx-auto",
  },
  narrow: {
    outer: "min-h-screen bg-[#020617]",
    padding: "py-12 px-4 sm:px-6 lg:px-8",
    container: "max-w-3xl mx-auto",
  },
  centered: {
    outer: "min-h-screen bg-[#020617] flex items-center justify-center",
    padding: "p-6",
    container: "w-full max-w-md",
  },
};

/**
 * PageShell: The architectural foundation for all views.
 * Added: Subtle noise texture and improved contrast management.
 */
export default function PageShell({
  children,
  variant = "default",
  className = "",
  containerClassName = "",
  withGlow = false, // New prop for ambient background lighting
}) {
  const v = shellVariants[variant] || shellVariants.default;

  return (
    <div className={`relative ${v.outer} ${className}`.trim()}>
      {/* 1. Static Grain Texture (Improves "Deep" Black Perception) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0" />

      {/* 2. Optional Ambient Glow */}
      {withGlow && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>
      )}

      {/* 3. Main Content Wrapper */}
      <main className={`relative z-10 ${v.padding}`.trim()}>
        <div className={`${v.container} ${containerClassName}`.trim()}>
          {children}
        </div>
      </main>

      {/* 4. Footer Spacer (Optional, ensures content doesn't hit the bottom edge) */}
      <div className="h-20 w-full pointer-events-none" />
    </div>
  );
}
