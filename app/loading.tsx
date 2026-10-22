import React from 'react';

export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[999998] bg-[#050608] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-80 pointer-events-none" />

      {/* Brand Ambient Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] bg-[radial-gradient(circle,rgba(103,35,138,0.28)_0%,rgba(225,29,42,0.12)_45%,transparent_70%)] rounded-full blur-3xl pointer-events-none animate-gf-aura" />

      {/* Center Cinematic Container - Logo & Micro Loader */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-md w-full">
        {/* Logo Container */}
        <div className="relative mb-6">
          <div className="absolute -inset-6 bg-[#67238A]/20 rounded-3xl blur-2xl opacity-70 pointer-events-none" />
          <div className="relative overflow-hidden p-2 rounded-2xl">
            <img
              src="/growingfit-whitelogo.png"
              alt="Growing Fit"
              className="w-64 sm:w-80 md:w-96 h-auto object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.85)] filter brightness-105"
              loading="eager"
              decoding="sync"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-gf-shimmer pointer-events-none" />
          </div>
        </div>

        {/* Brand Tagline */}
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white/60 mb-5 pl-[0.28em]">
          School of Health &amp; Physical Education
        </p>

        {/* Animated Progress Bar Track */}
        <div className="relative w-40 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
          <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-[#67238A] via-[#F21F2B] to-[#67238A] rounded-full animate-gf-progress shadow-[0_0_12px_rgba(242,31,43,0.8)]" />
        </div>
      </div>
    </div>
  );
}
