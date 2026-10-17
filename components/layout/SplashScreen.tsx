'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SplashScreen() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'enter' | 'loading' | 'ready' | 'exit' | 'done'>('enter');

  // Skip on admin dashboard for rapid CMS workflow
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      setPhase('done');
      return;
    }

    // Step 1: Smooth entry after mount
    const enterTimer = setTimeout(() => {
      setPhase('loading');
    }, 40);

    // Step 2: Smooth easing progress counter from 0 to 100
    const startTime = Date.now();
    const duration = 1150; // 1.15 seconds for smooth counting

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      // Easing out cubic: fast start, smooth deceleration towards 100%
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      const current = Math.round(eased * 100);
      setProgress(current);

      if (rawProgress >= 1) {
        clearInterval(timer);
        setPhase('ready');

        // Step 3: Brief hold at 100% then initiate cinematic dissolve
        setTimeout(() => {
          setPhase('exit');
        }, 180);

        // Step 4: Unmount completely from DOM
        setTimeout(() => {
          setPhase('done');
        }, 880);
      }
    }, 20);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(timer);
    };
  }, [isAdmin]);

  if (isAdmin || phase === 'done') return null;

  const isExiting = phase === 'exit';
  const isLoaded = phase !== 'enter';

  // Dynamic subtle status based on progress
  const statusLabel =
    progress < 35
      ? 'PREPARING ATHLETIC ARENAS'
      : progress < 75
      ? 'SYNCING ACADEMY PROGRAMS'
      : progress < 100
      ? 'FINALIZING EXPERIENCE'
      : 'WELCOME TO GROWING FIT';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] bg-[#050608] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.04] blur-sm pointer-events-none'
          : 'opacity-100 scale-100 blur-0 pointer-events-auto'
      }`}
    >
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] opacity-70 pointer-events-none" />

      {/* Brand Ambient Aurora Glow (Subtle hints of brand purple & crimson) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-[radial-gradient(circle,rgba(103,35,138,0.18)_0%,rgba(225,29,42,0.08)_40%,transparent_70%)] rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />

      {/* Center Cinematic Container */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md w-full">
        
        {/* Top Minimal Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold tracking-[0.22em] text-neutral-300 uppercase">
            School of Health &amp; Physical Education
          </span>
        </div>

        {/* Brand Logo with Ambient Glow and Shimmer Reflection */}
        <div
          className={`relative transition-all duration-700 ease-out transform mb-8 ${
            isLoaded
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          {/* Logo Reflection Glow */}
          <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-xl opacity-50 pointer-events-none" />

          {/* Actual White Logo with Light Sweep Shimmer */}
          <div className="relative overflow-hidden p-2">
            <img
              src="/growingfit-whitelogo.png"
              alt="Growing Fit"
              className="w-56 sm:w-72 md:w-80 h-auto object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.8)]"
            />
            
            {/* Shimmer light beam gliding across the logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
          </div>
        </div>

        {/* Sleek Progress Track & Ticker */}
        <div
          className={`w-full max-w-[260px] sm:max-w-[300px] space-y-3 transition-all duration-700 delay-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Progress Bar with Glowing Head */}
          <div className="w-full h-[2.5px] bg-white/[0.08] rounded-full overflow-hidden relative border border-white/[0.04]">
            <div
              className="h-full bg-gradient-to-r from-neutral-400 via-white to-white transition-all duration-75 ease-out rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing leading dot */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full blur-[2px] shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>

          {/* Numeric Percentage & Dynamic Status Text */}
          <div className="flex items-center justify-between text-[11px] font-mono tracking-wider">
            <span className="text-neutral-500 font-semibold text-[10px] tracking-[0.2em] uppercase font-sans">
              {statusLabel}
            </span>
            <span className="text-white font-bold tabular-nums">
              {String(progress).padStart(2, '0')}%
            </span>
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
          animation: shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
