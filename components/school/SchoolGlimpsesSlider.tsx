'use client';

import React, { useState } from 'react';
import { SchoolGlimpsesSection } from '@/types/database';
import { optimizeImageUrl } from '@/lib/utils/image';

interface SchoolGlimpsesSliderProps {
  data: SchoolGlimpsesSection;
}

export function SchoolGlimpsesSlider({ data }: SchoolGlimpsesSliderProps) {
  const heading = data?.heading || 'GLIMPSES OF PREVIOUS YEAR';
  const images = (data?.images || []).filter(
    (img) =>
      img.is_published !== false &&
      Boolean(img.image_url && typeof img.image_url === 'string' && img.image_url.trim().length > 0)
  );

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeCaption, setActiveCaption] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = images.length;
  const maxDesktopIndex = Math.max(0, total - 4);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxDesktopIndex : prev - 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-[#F0F1F3]">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#172033] tracking-tight uppercase">
            {heading}
          </h2>
        </div>

        {/* 4 Images Slider Row */}
        <div className="relative flex items-center gap-2 sm:gap-3">
          {/* Left Arrow Button */}
          {total > 4 && (
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous glimpses"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D0D5DD] bg-white hover:bg-slate-50 text-[#172033] flex items-center justify-center text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex-shrink-0 z-10"
            >
              &#8249;
            </button>
          )}

          {/* Grid Viewport */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {images.slice(currentIndex, currentIndex + 4).map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={() => {
                    setActiveImage(img.image_url);
                    setActiveCaption(img.title);
                  }}
                  className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={optimizeImageUrl(img.image_url, { width: 600, quality: 'auto', format: 'auto' })}
                    alt={img.title || 'Growing Fit School Glimpse'}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          {total > 4 && (
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next glimpses"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D0D5DD] bg-white hover:bg-slate-50 text-[#172033] flex items-center justify-center text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex-shrink-0 z-10"
            >
              &#8250;
            </button>
          )}
        </div>

        {/* Pagination Dots */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(Math.min(dotIdx, maxDesktopIndex))}
                aria-label={`Go to glimpse ${dotIdx + 1}`}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  dotIdx === currentIndex
                    ? 'w-2.5 h-2.5 bg-[#172033]'
                    : 'w-2 h-2 bg-[#D0D5DD] hover:bg-[#98A2B3]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Enlarged View Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-neutral-300 text-sm font-bold tracking-wider uppercase cursor-pointer"
            >
              Close [x]
            </button>
            <img
              src={optimizeImageUrl(activeImage, { width: 1400, quality: 'auto', format: 'auto' })}
              alt={activeCaption || 'School Glimpse'}
              className="w-auto h-auto max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
              decoding="async"
            />
            {activeCaption && (
              <p className="text-white text-xs sm:text-sm mt-3 text-center font-medium">
                {activeCaption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
