'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SplashScreen() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Default to 'done' so returning visitors and reloads experience ZERO delay and ZERO flash
  const [phase, setPhase] = useState<'enter' | 'loading' | 'exit' | 'done'>('done');

  useEffect(() => {
    if (isAdmin) return;

    try {
      const alreadySeen = localStorage.getItem('gf_splash_seen_v1');
      if (alreadySeen) {
        // Already shown once when first opened -> do not show again
        return;
      }

      // First time opening the website: mark as seen and trigger animation
      localStorage.setItem('gf_splash_seen_v1', 'true');
      setPhase('enter');

      // Step 1: Smooth fade & scale entry
      const enterTimer = setTimeout(() => {
        setPhase('loading');
      }, 30);

      // Step 2: Show logo elegantly, then initiate smooth dissolve exit
      const exitTimer = setTimeout(() => {
        setPhase('exit');
      }, 1000);

      // Step 3: Unmount completely from DOM
      const doneTimer = setTimeout(() => {
        setPhase('done');
      }, 1500);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(exitTimer);
        clearTimeout(doneTimer);
      };
    } catch {
      // Graceful fallback for restricted environments
      setPhase('done');
    }
  }, [isAdmin]);

  if (isAdmin || phase === 'done') return null;

  const isExiting = phase === 'exit';
  const isLoaded = phase !== 'enter';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] bg-[#050608] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.04] blur-sm pointer-events-none'
          : 'opacity-100 scale-100 blur-0 pointer-events-auto'
      }`}
    >
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] opacity-70 pointer-events-none" />

      {/* Brand Ambient Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-[radial-gradient(circle,rgba(103,35,138,0.18)_0%,rgba(225,29,42,0.08)_40%,transparent_70%)] rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />

      {/* Center Cinematic Container - Logo Only */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-md w-full">
        <div
          className={`relative transition-all duration-500 ease-out transform ${
            isLoaded
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          {/* Logo Reflection Glow */}
          <div className="absolute -inset-6 bg-white/5 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

          {/* Actual White Logo with Light Sweep Shimmer */}
          <div className="relative overflow-hidden p-2">
            <img
              src="/growingfit-whitelogo.png"
              alt="Growing Fit"
              className="w-64 sm:w-80 md:w-96 h-auto object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.8)]"
            />
            
            {/* Shimmer light beam */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          60%, 100% {
            transform: translateX(200%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
