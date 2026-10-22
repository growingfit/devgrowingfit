import React from 'react';

export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[999998] bg-black flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Soft ambient back glow for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Center Cinematic Container - Logo Only */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-md w-full">
        <div className="relative overflow-hidden p-3 rounded-2xl">
          <img
            src="/growingfit-whitelogo.png"
            alt="Growing Fit"
            className="w-64 sm:w-80 md:w-96 h-auto object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)] filter brightness-105"
            loading="eager"
            decoding="sync"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-gf-shimmer pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
