import React from "react";

const Footer = () => {
  const apiBase =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  return (
    <footer className="mx-auto max-w-5xl space-y-3 border-t border-white/10 px-7 py-8 text-center text-sm text-gray-400">
      <p>ClaimPoint Smart Lost &amp; Found · secure returns, less friction.</p>
      <div className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
        API base: {apiBase}
      </div>
    </footer>
  );
};

export default Footer;
