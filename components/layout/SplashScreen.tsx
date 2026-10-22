'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SplashScreen() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Check sessionStorage synchronously so refreshing the page NEVER shows the splash screen again
  const [phase, setPhase] = useState<'loading' | 'exit' | 'done'>(() => {
    if (typeof window !== 'undefined') {
      try {
        if (sessionStorage.getItem('gf_splash_shown') === 'true') {
          return 'done';
        }
      } catch {}
    }
    return 'loading';
  });

  useEffect(() => {
    if (isAdmin) return;

    try {
      if (sessionStorage.getItem('gf_splash_shown') === 'true') {
        setPhase('done');
        return;
      }
      // Mark as shown for the current session so refreshes bypass immediately
      sessionStorage.setItem('gf_splash_shown', 'true');
    } catch {}

    const startTime = Date.now();
    const MIN_DISPLAY_MS = 1000; // Crisp, elegant logo display
    const MAX_DISPLAY_MS = 2200; // Fallback safety timer

    let exitTimeout: NodeJS.Timeout;
    let doneTimeout: NodeJS.Timeout;

    const startExitTransition = () => {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);

      exitTimeout = setTimeout(() => {
        setPhase('exit');
        doneTimeout = setTimeout(() => {
          setPhase('done');
        }, 700); // 700ms matches exit dissolve duration
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

  if (isAdmin || phase === 'done') return null;

  const isExiting = phase === 'exit';

  return (
    <div
      id="gf-splash-screen"
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.04] blur-sm pointer-events-none'
          : 'opacity-100 scale-100 blur-0 pointer-events-auto'
      }`}
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

          {/* Shimmer light sweep beam */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-gf-shimmer pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
