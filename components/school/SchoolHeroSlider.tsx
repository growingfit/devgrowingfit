'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SchoolHeroSection } from '@/types/database';

interface SchoolHeroSliderProps {
  data: SchoolHeroSection;
}

export function SchoolHeroSlider({ data }: SchoolHeroSliderProps) {
  const slides = (data?.slides || []).filter((s) => s.is_published !== false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = slides.length;

  const nextSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Autoplay
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, currentIndex]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full bg-[#1A1D20] overflow-hidden select-none">
      {/* Slider Viewport */}
      <div
        className="relative w-full h-[280px] sm:h-[400px] md:h-[480px] lg:h-[540px] xl:h-[600px] 2xl:h-[640px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {slide.image_url && (
                <img
                  src={slide.image_url}
                  alt={slide.title || 'Growing Fit School Sports'}
                  className="w-full h-full object-cover object-center"
                />
              )}
              {/* Subtle top/bottom gradient overlay for clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
            </div>
          );
        })}

        {/* Circular Left Chevron Button (no icons, pure accessible text entity '<') */}
        {total > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#172033] shadow-md flex items-center justify-center font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            &#8249;
          </button>
        )}

        {/* Circular Right Chevron Button (pure text entity '>') */}
        {total > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#172033] shadow-md flex items-center justify-center font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            &#8250;
          </button>
        )}

        {/* Bottom Pagination Dots */}
        {total > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-2">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === currentIndex
                    ? 'w-2.5 h-2.5 bg-white shadow-sm ring-1 ring-black/20'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
