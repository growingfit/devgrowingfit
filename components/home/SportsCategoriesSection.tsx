'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
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

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  // Position and physics refs (keeps 60/120 FPS buttery smooth without React re-render overhead)
  const xPosRef = useRef<number>(0);
  const setWidthRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartPosRef = useRef<number>(0);
  const lastDragXRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(0);
  const dragVelocityRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);

  const [isCursorGrabbing, setIsCursorGrabbing] = useState(false);

  const shouldLoop = displayList.length >= 3;

  // Measure single set width with ResizeObserver
  const updateWidth = useCallback(() => {
    if (firstSetRef.current) {
      const measured = firstSetRef.current.offsetWidth;
      if (measured > 0) {
        const oldWidth = setWidthRef.current;
        setWidthRef.current = measured;

        // Initialize position on first measurement to -measured
        if (oldWidth === 0 || xPosRef.current === 0) {
          xPosRef.current = -measured;
          if (trackRef.current) {
            trackRef.current.style.transform = `translate3d(${xPosRef.current.toFixed(2)}px, 0, 0)`;
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    updateWidth();
    const ro = new ResizeObserver(() => updateWidth());
    if (firstSetRef.current) {
      ro.observe(firstSetRef.current);
    }
    return () => ro.disconnect();
  }, [updateWidth, displayList.length]);

  // High-performance continuous infinite marquee loop via requestAnimationFrame
  useEffect(() => {
    if (!shouldLoop) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // clamp delta
      lastTime = currentTime;

      const setWidth = setWidthRef.current;

      if (setWidth > 0 && trackRef.current) {
        let delta = 0;

        // Steady relaxed marquee drift speed (~38px/sec) when not hovered and not dragging
        if (!isHoveredRef.current && !isDraggingRef.current) {
          delta -= 38 * dt;
        }

        // Apply any impulse velocity (from left/right arrows or touch/mouse fling)
        if (Math.abs(velocityRef.current) > 0.5) {
          delta += velocityRef.current * dt;
          // Smooth exponential velocity decay
          velocityRef.current *= Math.pow(0.04, dt);
        } else {
          velocityRef.current = 0;
        }

        if (delta !== 0 && !isDraggingRef.current) {
          xPosRef.current += delta;

          // Infinite seamless wrap-around in both directions (zero visual jump)
          while (xPosRef.current <= -setWidth * 2) {
            xPosRef.current += setWidth;
          }
          while (xPosRef.current > -setWidth) {
            xPosRef.current -= setWidth;
          }

          trackRef.current.style.transform = `translate3d(${xPosRef.current.toFixed(2)}px, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [shouldLoop]);

  // Arrow button navigation: adds a silky smooth surge in the direction of the arrow
  const handleArrowClick = (direction: 'left' | 'right') => {
    if (!shouldLoop) return;
    const impulse = direction === 'left' ? 360 : -360;
    velocityRef.current += impulse * 2.8;
  };

  // Mouse Drag / Touch Swiping handlers
  const handleDragStart = (clientX: number) => {
    if (!shouldLoop) return;
    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
    dragStartPosRef.current = xPosRef.current;
    lastDragXRef.current = clientX;
    lastDragTimeRef.current = performance.now();
    dragVelocityRef.current = 0;
    hasDraggedRef.current = false;
    velocityRef.current = 0;
    setIsCursorGrabbing(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current || !trackRef.current) return;

    const deltaX = clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
    }

    const now = performance.now();
    const dt = (now - lastDragTimeRef.current) / 1000;
    if (dt > 0.01) {
      dragVelocityRef.current = (clientX - lastDragXRef.current) / dt;
      lastDragXRef.current = clientX;
      lastDragTimeRef.current = now;
    }

    const setWidth = setWidthRef.current;
    let nextPos = dragStartPosRef.current + deltaX;

    if (setWidth > 0) {
      while (nextPos <= -setWidth * 2) {
        nextPos += setWidth;
        dragStartPosRef.current += setWidth;
      }
      while (nextPos > -setWidth) {
        nextPos -= setWidth;
        dragStartPosRef.current -= setWidth;
      }
    }

    xPosRef.current = nextPos;
    trackRef.current.style.transform = `translate3d(${nextPos.toFixed(2)}px, 0, 0)`;
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsCursorGrabbing(false);

    // Transfer release fling speed into smooth decay
    if (Math.abs(dragVelocityRef.current) > 40) {
      velocityRef.current = Math.max(-1200, Math.min(1200, dragVelocityRef.current));
    }
  };

  // Prevent navigating when user was dragging
  const handleItemClick = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="categories" className="bg-white py-6 sm:py-8 border-b border-[#F2F4F7] overflow-hidden select-none">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header: Minimal & Centered */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-1.5 sm:mb-2">
            <span className="w-5 sm:w-6 h-[2px] bg-[#172033] rounded-full" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#172033] uppercase">
              EXPLORE SPORTS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#172033] tracking-tight leading-tight">
            Our Sports <span className="text-[#172033]">Categories</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] max-w-xl mx-auto mt-1.5 sm:mt-2 leading-relaxed">
            Discover a wide range of sports programs designed for all age groups and skill levels.
          </p>
        </div>

        {/* Minimal Box-free Slider Row flanked by Small Circular Arrows */}
        <div
          className="relative flex items-center gap-2 sm:gap-3 lg:gap-4"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            handleDragEnd();
          }}
        >
          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={() => handleArrowClick('left')}
            aria-label="Previous sports categories"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md flex items-center justify-center text-[#172033] hover:bg-slate-50 hover:border-black/40 transition-all flex-shrink-0 cursor-pointer active:scale-95 z-20"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#172033]" />
          </button>

          {/* Marquee Viewport with subtle edge gradient fades */}
          <div
            ref={viewportRef}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onTouchStart={(e) => {
              isHoveredRef.current = true;
              if (e.touches[0]) handleDragStart(e.touches[0].clientX);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) handleDragMove(e.touches[0].clientX);
            }}
            onTouchEnd={() => {
              isHoveredRef.current = false;
              handleDragEnd();
            }}
            className={`relative flex-1 overflow-hidden py-2 ${
              isCursorGrabbing ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Subtle soft edge fades for smooth entry/exit */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10" />

            {shouldLoop ? (
              // Continuous Hardware-Accelerated Infinite Marquee Track (4 identical sets for all screens)
              <div
                ref={trackRef}
                className="flex items-center will-change-transform"
                style={{ transform: 'translate3d(0px, 0, 0)' }}
              >
                {[0, 1, 2, 3].map((setIdx) => (
                  <div
                    key={`set-${setIdx}`}
                    ref={setIdx === 0 ? firstSetRef : undefined}
                    className="flex items-center gap-5 sm:gap-7 lg:gap-9 flex-shrink-0 pr-5 sm:pr-7 lg:pr-9"
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
                        <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#172033] group-hover:text-black mt-2 sm:mt-2.5 text-center leading-tight transition-colors whitespace-nowrap">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              // Centered static layout when 1 or 2 items
              <div className="flex items-center justify-center gap-5 sm:gap-7 lg:gap-9 py-2">
                {displayList.map((category) => (
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
                    <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#172033] group-hover:text-black mt-2 sm:mt-2.5 text-center leading-tight transition-colors whitespace-nowrap">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={() => handleArrowClick('right')}
            aria-label="Next sports categories"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md flex items-center justify-center text-[#172033] hover:bg-slate-50 hover:border-black/40 transition-all flex-shrink-0 cursor-pointer active:scale-95 z-20"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#172033]" />
          </button>
        </div>
      </div>
    </section>
  );
}
