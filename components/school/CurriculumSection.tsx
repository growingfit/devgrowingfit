'use client';

import React from 'react';
import { CurriculumSection as CurriculumSectionType } from '@/types/database';

interface CurriculumSectionProps {
  data: CurriculumSectionType;
}

export function CurriculumSection({ data }: CurriculumSectionProps) {
  if (data?.is_visible === false) return null;

  const heading = data?.heading || 'CURRICULUM';
  const description =
    data?.description ||
    'Growing Fit’s curriculum is scientifically structured into sequential developmental stages, ensuring that every student progresses through age-appropriate motor skills, agility, sport fundamentals, and character-building disciplines.';
  const stages = data?.stages || [];

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-[#F0F1F3]">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#172033] tracking-tight uppercase">
            {heading}
          </h2>
          {description && (
            <p className="text-sm sm:text-base text-[#475467] leading-relaxed max-w-3xl mt-2 font-normal">
              {description}
            </p>
          )}
        </div>

        {/* Structured Stages Breakdown (Clean typography, black and white editorial style) */}
        {stages && stages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {stages.map((stg, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#FAFAFC] border border-[#E8E8EC] space-y-2.5 hover:border-black/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-[2px] bg-[#172033]" />
                  <span className="text-xs font-black tracking-widest text-[#172033] uppercase block">
                    Stage 0{idx + 1}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#172033] leading-snug">
                  {stg.stage}
                </h3>
                <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                  {stg.detail}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
