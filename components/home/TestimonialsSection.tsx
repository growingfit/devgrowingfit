'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '@/types/database';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author_name: 'Fathima M',
    author_title: 'Parent (Karate Academy)',
    avatar_url: '/images/cta-skating-banner.png',
    quote:
      'Growing Fit has been an amazing place for my child. The coaches are supportive and the environment is very positive. I have seen great improvement in my child\'s confidence, focus, and fitness.',
    rating: 5,
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'test-2',
    author_name: 'Azhar Ali',
    author_title: 'Parent (Roller Skating)',
    avatar_url: '/images/about-martial-arts.png',
    quote:
      'The training at Growing Fit is excellent. The coaches are knowledgeable and create a motivating environment. My child looks forward to every single session with huge excitement.',
    rating: 5,
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'test-3',
    author_name: 'Dr. Priya Ramesh',
    author_title: 'Parent (Swimming Academy)',
    avatar_url: '/images/gallery-item-8.png',
    quote:
      'The attention to safety and foundational technique is outstanding. My daughter conquered her fear of water and now swims with complete confidence and enthusiasm.',
    rating: 5,
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'test-4',
    author_name: 'Mohammed Shafi',
    author_title: 'Parent (Football Academy)',
    avatar_url: '/images/gallery-item-4.png',
    quote:
      'Structured coaching, disciplined agility drills, and wonderful encouragement from the staff. It has completely transformed my son\'s stamina, teamwork, and health.',
    rating: 5,
    sort_order: 4,
    is_published: true,
  },
  {
    id: 'test-5',
    author_name: 'Sunitha Krishnan',
    author_title: 'Parent (Badminton Academy)',
    avatar_url: '/images/vision-karate-girl.png',
    quote:
      'The best sports academy in the region. The trainers give personal attention to each kid\'s strengths, making daily physical fitness fun, active, and rewarding.',
    rating: 5,
    sort_order: 5,
    is_published: true,
  },
  {
    id: 'test-6',
    author_name: 'Rahul Varma',
    author_title: 'Parent (Athletics & Fitness)',
    avatar_url: '/images/cta-skating-banner.png',
    quote:
      'The dedicated instructors and world-class athletic facilities make all the difference. My child has built tremendous speed, endurance, and self-belief.',
    rating: 5,
    sort_order: 6,
    is_published: true,
  },
];

export function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine user database testimonials with curated defaults
  const displayList =
    testimonials && testimonials.length >= 6
      ? testimonials
      : testimonials && testimonials.length > 0
      ? [...testimonials, ...DEFAULT_TESTIMONIALS.slice(0, Math.max(0, 6 - testimonials.length))]
      : DEFAULT_TESTIMONIALS;

  // Dynamically calculate the exact scroll step (1 card width + gap)
  const getScrollStep = () => {
    if (!scrollRef.current) return 380;
    const firstCard = scrollRef.current.querySelector('[data-testimonial-card]') as HTMLElement;
    if (firstCard) {
      const style = window.getComputedStyle(scrollRef.current);
      const gap = parseFloat(style.columnGap || style.gap || '20') || 20;
      return firstCard.offsetWidth + gap;
    }
    return scrollRef.current.clientWidth / 3;
  };

  // Auto-sliding interval: smoothly scrolls by 1 card every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const step = getScrollStep();

      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Track active index based on scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const step = getScrollStep();
    const idx = Math.round(scrollRef.current.scrollLeft / step);
    setActiveIndex(Math.min(Math.max(0, idx), displayList.length - 1));
  };

  const scrollDirection = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const step = getScrollStep();
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-white border-b border-[#E8E8EC] overflow-hidden">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Header with Title & Arrow Controls */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div className="space-y-3 sm:space-y-3.5 lg:pl-3 xl:pl-6">
            <div className="flex items-center gap-2.5">
              <span className="h-[2px] w-6 bg-[#172033] rounded-full" />
              <span className="text-xs font-black tracking-[0.18em] text-[#172033] uppercase">
                TESTIMONIALS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-[#172033] tracking-tight leading-[1.2]">
              What Parents <span className="text-[#172033]">Say</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Real feedback from families whose children train and grow with us.
            </p>
          </div>

          {/* Navigation Controls with Active Pagination Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1.5 tabular-nums">
              {activeIndex + 1}/{displayList.length}
            </span>
            <button
              type="button"
              onClick={() => scrollDirection('left')}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#172033] hover:text-black hover:border-black/40 transition-colors shadow-2xs"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollDirection('right')}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#172033] hover:text-black hover:border-black/40 transition-colors shadow-2xs"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3-Cards-at-a-time Auto-Sliding Carousel Track with soft edge gradient fades */}
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Subtle edge fades for smooth visual immersion */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Horizontal scroll container: exactly 3 cards visible on desktop, 2 on tablet, 1 on mobile */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-stretch gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {displayList.map((item) => (
              <div
                key={item.id}
                data-testimonial-card="true"
                className="w-[88%] sm:w-[calc(50%-10px)] lg:w-[calc((100%-40px)/3)] shrink-0 bg-[#FAFAFC] border border-[#E8E8EC]/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 group select-none min-h-[230px]"
              >
                <div className="space-y-3.5">
                  {/* Quote Mark in rounded square */}
                  <div className="w-9 h-9 rounded-xl bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center text-[#172033] font-serif text-2xl font-black shadow-2xs group-hover:scale-105 transition-transform">
                    &ldquo;
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#475467] leading-relaxed line-clamp-4">
                    {item.quote}
                  </p>
                </div>

                {/* Author & Designation with Avatar & 5 Stars */}
                <div className="pt-4 border-t border-[#E8E8EC]/80 mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center font-bold text-xs sm:text-sm text-[#172033] overflow-hidden shrink-0 shadow-2xs">
                    {item.avatar_url ? (
                      <img
                        src={item.avatar_url}
                        alt={item.author_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{item.author_name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#172033] leading-tight truncate">
                      {item.author_name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[11px] font-medium text-[#667085] truncate">
                        {item.author_title || 'Parent'}
                      </p>
                      <div className="flex items-center text-amber-400 text-xs gap-0.5 shrink-0">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
