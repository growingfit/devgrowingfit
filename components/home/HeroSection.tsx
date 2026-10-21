'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeroSection as HeroSectionType, HeroSlide } from '@/types/database';

interface HeroSectionProps {
  data?: HeroSectionType | null;
  benefits?: any[];
}

export function HeroSection({ data }: HeroSectionProps) {
  const [heroData, setHeroData] = useState<HeroSectionType | null>(data || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (data) setHeroData(data);
  }, [data]);

  const currentHero = heroData || data;
  const singleHeading =
    currentHero?.heading !== undefined
      ? (typeof currentHero.heading === 'string' ? currentHero.heading.trim() : '')
      : 'Fun Fitness Sports';

  // Compute active slides - strictly only slides with actual uploaded banner images
  const rawSlides: HeroSlide[] = Array.isArray(currentHero?.slides) && currentHero.slides.length > 0
    ? currentHero.slides
    : [];

  const activeSlides = rawSlides.filter(
    (s) =>
      s.is_visible !== false &&
      Boolean(
        (typeof s.image_url === 'string' && s.image_url.trim().length > 0) ||
        (typeof s.mobile_image_url === 'string' && s.mobile_image_url.trim().length > 0)
      )
  );

  const topImage = typeof currentHero?.image_url === 'string' ? currentHero.image_url.trim() : '';
  const topMobileImage = typeof currentHero?.mobile_image_url === 'string' ? currentHero.mobile_image_url.trim() : '';

  // Fallback: If no valid slides in slides array, use top-level hero banner image if present
  const displaySlides: HeroSlide[] =
    activeSlides.length > 0
      ? activeSlides
      : topImage || topMobileImage
      ? [
          {
            id: 'fallback-1',
            image_url: topImage,
            mobile_image_url: topMobileImage,
            heading: singleHeading,
            is_visible: true,
          },
        ]
      : [];

  const totalSlides = displaySlides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-slide effect
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const intervalTime = currentHero?.slide_interval || 5000;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused, currentHero?.slide_interval, nextSlide]);

  // Touch gestures for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
  };

  if (displaySlides.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Homepage Banners Carousel"
      className="relative w-full overflow-hidden bg-[#121316] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding Carousel Track Container (9:16 Portrait on Mobile, Landscape on Desktop) */}
      <div className="relative w-full aspect-[9/16] max-h-[85vh] md:aspect-auto md:h-[520px] lg:h-[600px] xl:h-[660px] overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displaySlides.map((slide, idx) => {
            const isActive = currentIndex === idx;

            return (
              <div
                key={slide.id || idx}
                className="relative w-full h-full flex-shrink-0 overflow-hidden"
              >
                {/* Responsive Banner: Mobile picture tag picks mobile_image_url on mobile screens */}
                <picture className="w-full h-full block">
                  {slide.mobile_image_url && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={slide.mobile_image_url}
                    />
                  )}
                  <img
                    src={(slide.image_url || slide.mobile_image_url) || ''}
                    alt={singleHeading || `Growing Fit Banner ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                    style={{
                      objectPosition: currentHero?.image_focal_position || 'center',
                    }}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </picture>

                {/* Subtle dark gradient overlay for optimal readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 pointer-events-none" />

                {/* Centered Typography Overlay - Single Heading Only */}
                {singleHeading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center pointer-events-none">
                    <div
                      className={`max-w-4xl mx-auto transition-all duration-700 delay-100 ${
                        isActive
                          ? 'opacity-100 translate-y-0 scale-100'
                          : 'opacity-0 translate-y-3 scale-95'
                      }`}
                    >
                      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] uppercase sm:capitalize">
                        {singleHeading}
                      </h1>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>



        {/* Carousel Indicators / Pagination Dots (Only when > 1 slide) */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2.5">
            {displaySlides.map((_, dotIdx) => {
              const isCurrent = currentIndex === dotIdx;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => goToSlide(dotIdx)}
                  aria-label={`Go to Slide ${dotIdx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    isCurrent
                      ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/45 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
