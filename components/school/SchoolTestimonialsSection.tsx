'use client';

import React, { useState } from 'react';
import { SchoolTestimonialsSection as SchoolTestimonialsSectionType } from '@/types/database';

interface SchoolTestimonialsSectionProps {
  data: SchoolTestimonialsSectionType;
}

export function SchoolTestimonialsSection({ data }: SchoolTestimonialsSectionProps) {
  const heading = data?.heading || 'TESTIMONIALS';
  const subtitle = data?.subtitle;
  const items = (data?.items || []).filter((i) => i.is_visible !== false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const total = items.length;
  const maxDesktopIndex = Math.max(0, total - 2);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxDesktopIndex : prev - 1));
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-[#F0F1F3]">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#172033] tracking-tight uppercase">
            {heading}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* 2 Testimonials Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {items.slice(currentIndex, currentIndex + 2).map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-6 sm:p-7 rounded-2xl bg-[#FAFAFC] border border-[#E8E8EC] flex items-start gap-4 sm:gap-5 shadow-2xs"
            >
              {/* Round Avatar or Clean Monogram */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-sm text-[#172033]">
                {item.avatar_url ? (
                  <img
                    src={item.avatar_url}
                    alt={item.author_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{item.author_name ? item.author_name.charAt(0) : 'P'}</span>
                )}
              </div>

              {/* Quote & Author Info */}
              <div className="space-y-3 flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-[#475467] leading-relaxed font-normal">
                  {item.quote}
                </p>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#172033] leading-tight">
                    {item.author_name}
                  </h4>
                  {item.author_role && (
                    <span className="text-[11px] sm:text-xs text-[#98A2B3] block mt-0.5 font-medium">
                      {item.author_role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation: Centered Dots + Right Aligned Arrow Controls (Only when more than 2 testimonials) */}
        {items.length > 2 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#F2F4F7]">
            <div className="w-16 hidden sm:block" />

            {/* Centered Dots */}
            <div className="flex items-center justify-center gap-1.5 mx-auto">
              {items.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(Math.min(dotIdx, maxDesktopIndex))}
                  aria-label={`Go to testimonial ${dotIdx + 1}`}
                  className={`transition-all duration-200 rounded-full cursor-pointer ${
                    dotIdx === currentIndex
                      ? 'w-2.5 h-2.5 bg-[#172033]'
                      : 'w-2 h-2 bg-[#D0D5DD] hover:bg-[#98A2B3]'
                  }`}
                />
              ))}
            </div>

            {/* Right Circular Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous testimonial"
                className="w-8 h-8 rounded-full border border-[#D0D5DD] bg-white hover:bg-slate-50 text-[#172033] flex items-center justify-center text-sm font-bold transition-all hover:border-[#172033] active:scale-95 cursor-pointer"
              >
                &#8249;
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="w-8 h-8 rounded-full border border-[#D0D5DD] bg-white hover:bg-slate-50 text-[#172033] flex items-center justify-center text-sm font-bold transition-all hover:border-[#172033] active:scale-95 cursor-pointer"
              >
                &#8250;
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
