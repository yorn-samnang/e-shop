"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      role="status"
      aria-label="Loading admin interface"
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-primary opacity-10" />
        <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-primary opacity-20 [animation-delay:300ms]" />
        <img
          src="/logo.png"
          alt=""
          className="relative h-16 w-16 animate-[logoBreath_1.6s_ease-in-out_infinite] object-contain drop-shadow-lg"
        />
      </div>

      <div className="mt-10 h-1 w-40 overflow-hidden rounded-full bg-orange-100">
        <div className="h-full w-1/2 animate-[slideBar_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
      <p className="mt-4 animate-pulse text-sm font-medium uppercase tracking-widest text-primary/70">
        Loading…
      </p>

      <style>{`
        @keyframes logoBreath {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.85; }
        }
        @keyframes slideBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
