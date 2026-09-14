'use client';

import React from 'react';

export default function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      {/* Pulsing logo */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-primary opacity-10" />
        {/* Inner ring */}
        <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-primary opacity-20 [animation-delay:300ms]" />
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Loading…"
          className="relative h-16 w-16 animate-[logoBreath_1.6s_ease-in-out_infinite] drop-shadow-lg"
        />
      </div>

      {/* Animated bar */}
      <div className="mt-10 h-1 w-40 overflow-hidden rounded-full bg-orange-100">
        <div className="h-full w-1/2 animate-[slideBar_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>

      <p className="mt-4 text-sm font-medium tracking-widest text-primary/70 uppercase animate-pulse">
        Loading…
      </p>

      <style>{`
        @keyframes logoBreath {
          0%, 100% { transform: scale(1);   opacity: 1;    }
          50%       { transform: scale(1.1); opacity: 0.85; }
        }
        @keyframes slideBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%);  }
        }
      `}</style>
    </div>
  );
}
