'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SplashScreen() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Starts in 'loading' phase by default so it renders immediately on initial HTML/page opening
  // with ZERO flash of content underneath.
  const [phase, setPhase] = useState<'loading' | 'exit' | 'done'>('loading');

  useEffect(() => {
    if (isAdmin) return;

    // Clean up any old localStorage key from past versions
    try {
      localStorage.removeItem('gf_splash_seen_v1');
    } catch {
      // Ignore in restricted environments
    }

    const startTime = Date.now();
    const MIN_DISPLAY_MS = 1400; // Elegant display time so the animated brand logo is visible
    const MAX_DISPLAY_MS = 2500; // Safety timeout so slow connections never stall the user

    let exitTimeout: NodeJS.Timeout;
    let doneTimeout: NodeJS.Timeout;

    const startExitTransition = () => {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);

      exitTimeout = setTimeout(() => {
        setPhase('exit');
        doneTimeout = setTimeout(() => {
          setPhase('done');
        }, 600); // 600ms matches exit transition duration
      }, delay);
    };

    if (document.readyState === 'complete') {
      startExitTransition();
    } else {
      window.addEventListener('load', startExitTransition, { once: true });
      const maxTimer = setTimeout(startExitTransition, MAX_DISPLAY_MS);
      return () => {
        window.removeEventListener('load', startExitTransition);
        clearTimeout(maxTimer);
        clearTimeout(exitTimeout);
        clearTimeout(doneTimeout);
      };
    }

    return () => {
      clearTimeout(exitTimeout);
      clearTimeout(doneTimeout);
    };
  }, [isAdmin]);

  // Don't render on admin routes or once exit sequence has finished
  if (isAdmin || phase === 'done') return null;

  const isExiting = phase === 'exit';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] bg-[#050608] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.03] blur-sm pointer-events-none'
          : 'opacity-100 scale-100 blur-0 pointer-events-auto'
      }`}
    >
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-80 pointer-events-none" />

      {/* Brand Ambient Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] bg-[radial-gradient(circle,rgba(103,35,138,0.28)_0%,rgba(225,29,42,0.12)_45%,transparent_70%)] rounded-full blur-3xl pointer-events-none animate-gf-aura" />

      {/* Center Cinematic Container - Logo & Micro Loader */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-md w-full">
        {/* Logo Container */}
        <div className="relative mb-6">
          {/* Logo Reflection Glow */}
          <div className="absolute -inset-6 bg-[#67238A]/20 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

          {/* Actual White Logo with Light Sweep Shimmer */}
          <div className="relative overflow-hidden p-2 rounded-2xl">
            <img
              src="/growingfit-whitelogo.png"
              alt="Growing Fit"
              className="w-64 sm:w-80 md:w-96 h-auto object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.85)] filter brightness-105"
              loading="eager"
              decoding="sync"
            />

            {/* Shimmer light sweep beam */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-gf-shimmer pointer-events-none" />
          </div>
        </div>

        {/* Brand Tagline */}
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white/60 mb-5 pl-[0.28em]">
          School of Health &amp; Physical Education
        </p>

        {/* Elegant Animated Progress Bar Track */}
        <div className="relative w-40 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
          <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-[#67238A] via-[#F21F2B] to-[#67238A] rounded-full animate-gf-progress shadow-[0_0_12px_rgba(242,31,43,0.8)]" />
        </div>
      </div>
    </div>
  );
}

