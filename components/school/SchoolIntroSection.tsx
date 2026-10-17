'use client';

import React from 'react';
import { SchoolIntroSection as SchoolIntroSectionType } from '@/types/database';

interface SchoolIntroSectionProps {
  data: SchoolIntroSectionType;
}

export function SchoolIntroSection({ data }: SchoolIntroSectionProps) {
  if (data?.is_visible === false) return null;

  const content =
    data?.content ||
    "At Growing Fit, we believe in the power of sports and physical education to shape healthier, happier and more confident children. Our programs are designed to nurture each child's unique potential through expert training, fun learning and a supportive environment.";

  return (
    <section className="w-full bg-white py-14 sm:py-20 border-b border-[#F0F1F3]">
      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 text-center">
        <p className="text-base sm:text-lg md:text-xl lg:text-[21px] text-[#333F51] leading-[1.7] sm:leading-[1.75] font-normal tracking-normal select-none">
          {content}
        </p>
      </div>
    </section>
  );
}
