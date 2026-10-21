'use client';

import React from 'react';
import { WhatsInForKidsSection as WhatsInForKidsSectionType } from '@/types/database';

interface WhatsInForKidsSectionProps {
  data: WhatsInForKidsSectionType;
}

export function WhatsInForKidsSection({ data }: WhatsInForKidsSectionProps) {
  const heading = data?.heading || "WHAT'S IN FOR KIDS";
  const cards = (data?.cards || []).filter(
    (c) =>
      c.is_visible !== false &&
      Boolean(c.image_url && typeof c.image_url === 'string' && c.image_url.trim().length > 0)
  );

  if (!cards || cards.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-[#F0F1F3]">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#172033] tracking-tight uppercase">
            {heading}
          </h2>
        </div>

        {/* 4 Image Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 xl:gap-6">
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] bg-slate-900 shadow-xs hover:shadow-md transition-all duration-300"
            >
              {/* Background Image */}
              {card.image_url && (
                <img
                  src={card.image_url}
                  alt={card.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              )}

              {/* Bottom Subtle Dark Gradient for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Title Directly on Bottom Left */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide block drop-shadow-sm">
                  {card.title}
                </span>
                {card.description && (
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 hidden group-hover:block transition-all">
                    {card.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
