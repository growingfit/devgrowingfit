'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SportsCategory } from '@/types/database';
import { DEFAULT_REFERENCE_SPORTS, getSportIconUrl } from '@/lib/sports';

export { DEFAULT_REFERENCE_SPORTS, getSportIconUrl };

interface SportsCategoriesSectionProps {
  categories?: SportsCategory[];
}

export function SportsCategoriesSection({ categories = [] }: SportsCategoriesSectionProps) {
  // Load categories dynamically from Admin / Database
  const activeDb = (categories && categories.length > 0)
    ? categories
        .filter((c) => c && c.is_active !== false)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    : [];

  // Use admin categories directly if available; otherwise show default reference sports
  const displayList: SportsCategory[] =
    activeDb.length > 0 ? activeDb : DEFAULT_REFERENCE_SPORTS;

  const sliderRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Enable seamless loop when multiple categories exist
  const shouldLoop = displayList.length >= 3;

  // Initialize scroll position to the middle set for seamless infinite gliding
  useEffect(() => {
    if (!shouldLoop || !sliderRef.current || !firstSetRef.current) return;
    const setWidth = firstSetRef.current.offsetWidth;
    if (setWidth > 0) {
      sliderRef.current.scrollLeft = setWidth;
    }
  }, [shouldLoop, displayList.length]);

  // Continuous silky smooth auto-sliding transition (60FPS requestAnimationFrame)
  useEffect(() => {
    if (!shouldLoop) return;

    let animId: number;
    let lastTime = performance.now();

    const stepAnimate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // clamp delta
      lastTime = currentTime;

      if (!isHovered && !isMouseDown && sliderRef.current && firstSetRef.current) {
        const setWidth = firstSetRef.current.offsetWidth;
        if (setWidth > 0) {
          // Smooth, relaxed gliding pace: ~35px per second
          const moveBy = 35 * dt;
          sliderRef.current.scrollLeft += moveBy;

          // Seamless wrap-around with zero jump
          if (sliderRef.current.scrollLeft >= setWidth * 2) {
            sliderRef.current.scrollLeft -= setWidth;
          }
        }
      }

      animId = requestAnimationFrame(stepAnimate);
    };

    animId = requestAnimationFrame(stepAnimate);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, isMouseDown, shouldLoop]);

  // Smooth scroll using navigation arrows (with wrap-around support)
  const handleScrollArrow = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 240;

    if (!shouldLoop || !firstSetRef.current) {
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      return;
    }

    const setWidth = firstSetRef.current.offsetWidth;
    if (setWidth > 0) {
      if (direction === 'left' && sliderRef.current.scrollLeft <= setWidth * 0.3) {
        sliderRef.current.scrollLeft += setWidth;
      } else if (direction === 'right' && sliderRef.current.scrollLeft >= setWidth * 1.8) {
        sliderRef.current.scrollLeft -= setWidth;
      }
    }

    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Mouse Drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftPos(sliderRef.current.scrollLeft);
    setHasDragged(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    sliderRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  // Prevent link click when dragging
  const handleItemClick = (e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="categories" className="bg-white py-7 sm:py-9 border-b border-[#F2F4F7] overflow-hidden">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header: Minimal & Centered */}
        <div className="text-center mb-5 sm:mb-7">
          <div className="flex items-center justify-center gap-2 mb-1.5 sm:mb-2">
            <span className="w-5 sm:w-6 h-[2px] bg-[#E11D2A] rounded-full" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#E11D2A] uppercase">
              EXPLORE SPORTS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#172033] tracking-tight leading-tight">
            Our Sports <span className="text-[#E11D2A]">Categories</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] max-w-xl mx-auto mt-1.5 sm:mt-2 leading-relaxed">
            Discover a wide range of sports programs designed for all age groups and skill levels.
          </p>
        </div>

        {/* Minimal Box-free Slider Row flanked by Small Circular Arrows */}
        <div
          className="relative flex items-center gap-2 sm:gap-3 lg:gap-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsMouseDown(false);
          }}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={() => handleScrollArrow('left')}
            aria-label="Previous sports categories"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md flex items-center justify-center text-[#E11D2A] hover:bg-red-50/70 hover:border-[#E11D2A]/30 transition-all flex-shrink-0 cursor-pointer active:scale-95 z-10"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#E11D2A]" />
          </button>

          {/* Horizontal Slider Track - Continuous Silky-Smooth Auto-Sliding */}
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            className={`flex-1 overflow-x-auto no-scrollbar flex items-center ${
              !shouldLoop ? 'justify-center' : 'justify-start'
            } gap-4 sm:gap-6 lg:gap-8 py-2 select-none touch-pan-x ${
              isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {shouldLoop ? (
              // 3 Sets for seamless, infinite gliding without jumps or snaps
              [0, 1, 2].map((setIdx) => (
                <div
                  key={`set-${setIdx}`}
                  ref={setIdx === 0 ? firstSetRef : undefined}
                  className="flex items-center gap-4 sm:gap-6 lg:gap-8 flex-shrink-0"
                  aria-hidden={setIdx > 0}
                >
                  {displayList.map((category, catIdx) => (
                    <Link
                      key={`cat-${setIdx}-${category.id || category.slug}-${catIdx}`}
                      href={category.slug ? `/programs/${category.slug}` : '/programs'}
                      onClick={handleItemClick}
                      tabIndex={setIdx > 0 ? -1 : undefined}
                      className="group flex flex-col items-center justify-start flex-shrink-0 cursor-pointer select-none transition-transform duration-200 hover:-translate-y-1 w-[82px] xs:w-[92px] sm:w-[108px] md:w-[118px] lg:w-[126px] xl:w-[132px]"
                      title={`Explore ${category.name}`}
                    >
                      {/* Stickman / Category Graphic: 55-70px tall on desktop, proportionally smaller on mobile */}
                      <div className="h-[48px] xs:h-[54px] sm:h-[62px] md:h-[68px] w-full flex items-center justify-center pointer-events-none">
                        <img
                          src={getSportIconUrl(category.icon, category.slug)}
                          alt={category.name}
                          className="h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none select-none"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>

                      {/* Clean, medium-weight font directly beneath */}
                      <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#172033] group-hover:text-[#E11D2A] mt-2 sm:mt-2.5 text-center leading-tight transition-colors whitespace-nowrap">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ))
            ) : (
              // Centered static layout when 1 or 2 items
              displayList.map((category) => (
                <Link
                  key={category.id || category.slug}
                  href={category.slug ? `/programs/${category.slug}` : '/programs'}
                  onClick={handleItemClick}
                  className="group flex flex-col items-center justify-start flex-shrink-0 cursor-pointer select-none transition-transform duration-200 hover:-translate-y-1 w-[82px] xs:w-[92px] sm:w-[108px] md:w-[118px] lg:w-[126px] xl:w-[132px]"
                  title={`Explore ${category.name}`}
                >
                  <div className="h-[48px] xs:h-[54px] sm:h-[62px] md:h-[68px] w-full flex items-center justify-center pointer-events-none">
                    <img
                      src={getSportIconUrl(category.icon, category.slug)}
                      alt={category.name}
                      className="h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none select-none"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#172033] group-hover:text-[#E11D2A] mt-2 sm:mt-2.5 text-center leading-tight transition-colors whitespace-nowrap">
                    {category.name}
                  </span>
                </Link>
              ))
            )}
          </div>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={() => handleScrollArrow('right')}
            aria-label="Next sports categories"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md flex items-center justify-center text-[#E11D2A] hover:bg-red-50/70 hover:border-[#E11D2A]/30 transition-all flex-shrink-0 cursor-pointer active:scale-95 z-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#E11D2A]" />
          </button>
        </div>
      </div>
    </section>
  );
}
