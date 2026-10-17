'use client';

import React, { useState } from 'react';
import { WhyGrowingFitSection } from '@/types/database';

interface WhyGrowingFitSliderProps {
  data: WhyGrowingFitSection;
}

export function WhyGrowingFitSlider({ data }: WhyGrowingFitSliderProps) {
  const heading = data?.heading || 'WHY GROWING FIT';
  const subtitle = data?.subtitle || '5 Reasons You Should Join';
  const items = (data?.items || []).filter((i) => i.is_visible !== false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Desktop shows 3 items at a time; total pages = Math.max(1, items.length - 2)
  // Mobile shows 1 item at a time; total pages = items.length
  const total = items.length;
  const maxDesktopIndex = Math.max(0, total - 3);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxDesktopIndex : prev - 1));
  };

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
    if (distance > 40) {
      setCurrentIndex((prev) => (prev >= total - 1 ? 0 : prev + 1));
    } else if (distance < -40) {
      setCurrentIndex((prev) => (prev <= 0 ? total - 1 : prev - 1));
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-[#F0F1F3]">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#172033] tracking-tight uppercase">
            {heading}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content Slider Container */}
        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Desktop 3-column view */}
          <div className="hidden lg:grid grid-cols-3 gap-0 divide-x divide-[#E5E7EB]">
            {items.slice(currentIndex, currentIndex + 3).map((item, idx) => (
              <div
                key={item.id || idx}
                className={`flex items-start gap-4 sm:gap-5 ${
                  idx === 0 ? 'pr-6 xl:pr-8' : idx === 1 ? 'px-6 xl:px-8' : 'pl-6 xl:pl-8'
                }`}
              >
                {/* Large light-grey sequence number */}
                <span className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#CBD5E1] tracking-tighter leading-none select-none flex-shrink-0">
                  {item.sequence || `#${currentIndex + idx + 1}`}
                </span>

                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#172033] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile & Tablet 1-column view */}
          <div className="lg:hidden">
            {items.map((item, idx) => {
              if (idx !== currentIndex) return null;
              return (
                <div key={item.id || idx} className="flex items-start gap-4 p-2 animate-in fade-in-50 duration-200">
                  <span className="text-4xl font-black text-[#CBD5E1] tracking-tighter leading-none select-none flex-shrink-0">
                    {item.sequence || `#${idx + 1}`}
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-base font-bold text-[#172033] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#667085] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Controls Row: Centered Dots + Right Side Circular Arrows */}
        <div className="flex items-center justify-between mt-8 sm:mt-10 pt-4 border-t border-[#F2F4F7]">
          {/* Left spacer for optical balance */}
          <div className="w-16 hidden sm:block" />

          {/* Centered Dots */}
          <div className="flex items-center justify-center gap-1.5 mx-auto">
            {items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(Math.min(dotIdx, maxDesktopIndex))}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  dotIdx === currentIndex
                    ? 'w-2.5 h-2.5 bg-[#172033]'
                    : 'w-2 h-2 bg-[#D0D5DD] hover:bg-[#98A2B3]'
                }`}
              />
            ))}
          </div>

          {/* Circular Previous / Next Arrows (Right Aligned) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous reason"
              className="w-8 h-8 rounded-full border border-[#D0D5DD] bg-white hover:bg-slate-50 text-[#172033] flex items-center justify-center text-sm font-bold transition-all hover:border-[#172033] active:scale-95 cursor-pointer"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next reason"
              className="w-8 h-8 rounded-full border border-[#D0D5DD] bg-white hover:bg-slate-50 text-[#172033] flex items-center justify-center text-sm font-bold transition-all hover:border-[#172033] active:scale-95 cursor-pointer"
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
