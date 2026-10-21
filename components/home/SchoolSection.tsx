'use client';

import React from 'react';
import Link from 'next/link';
import { SchoolSectionData } from '@/types/database';
import { optimizeImageUrl } from '@/lib/utils/image';

interface SchoolSectionProps {
  data?: SchoolSectionData | null;
}

export function SchoolSection({ data }: SchoolSectionProps) {
  if (data?.is_visible === false) return null;

  const heading = data?.heading?.trim() || '';
  const description = data?.description?.trim() || '';
  const buttonText = data?.button_text?.trim() || '';
  const buttonUrl = data?.button_url?.trim() || '';
  const rawImageSrc =
    data?.image_url && data.image_url.trim().length > 0
      ? data.image_url.trim()
      : null;
  const imageSrc = rawImageSrc
    ? optimizeImageUrl(rawImageSrc, { width: 900, quality: 'auto', format: 'auto' })
    : null;
  const imageAlt = data?.image_alt || heading || 'School sports';

  if (!heading && !description && !imageSrc) return null;

  return (
    <section
      id="schools"
      className="w-full bg-[#F4F4F6] py-14 sm:py-20 lg:py-24 border-t border-[#E8E8EC]"
    >
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, description, Learn More button */}
          <div className={`space-y-6 lg:pr-6 ${imageSrc ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
            {heading && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#172033] tracking-tight">
                {heading}
              </h2>
            )}

            {description && (
              <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-normal">
                {description}
              </p>
            )}

            {buttonText && buttonUrl && (
              <div className="pt-2">
                <Link
                  href={buttonUrl}
                  className="inline-flex items-center justify-center px-7 py-2.5 sm:px-8 sm:py-3 rounded-full bg-white hover:bg-slate-50 text-[#172033] hover:text-black border border-[#D0D5DD] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-xs hover:shadow-sm"
                >
                  {buttonText}
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Sports photograph */}
          {imageSrc && (
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white/50 border border-slate-200/60 aspect-[4/3] sm:aspect-[16/10]">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
