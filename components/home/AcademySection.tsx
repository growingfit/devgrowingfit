'use client';

import React from 'react';
import Link from 'next/link';
import { AcademySectionData } from '@/types/database';

interface AcademySectionProps {
  data?: AcademySectionData | null;
}

export function AcademySection({ data }: AcademySectionProps) {
  if (data?.is_visible === false) return null;

  const heading = data?.heading?.trim() || '';
  const description = data?.description?.trim() || '';
  const buttonText = data?.button_text?.trim() || '';
  const buttonUrl = data?.button_url?.trim() || '';
  const imageSrc =
    data?.image_url && data.image_url.trim().length > 0
      ? data.image_url.trim()
      : null;
  const imageAlt = data?.image_alt || heading || 'Academy sports';

  const thumbnails =
    data?.thumbnails && data.thumbnails.length > 0
      ? data.thumbnails.filter((t) => t.is_visible !== false)
      : [];

  return (
    <section
      id="academy"
      className="w-full bg-[#191C20] py-14 sm:py-20 lg:py-24 text-white border-t border-slate-800"
    >
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Sports team photograph */}
          {imageSrc && (
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-md bg-black/40 border border-slate-700/50 aspect-[4/3] sm:aspect-[16/10]">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>
          )}

          {/* Right Column: Heading, description, Learn More, and thumbnails */}
          <div className={`space-y-6 order-1 lg:order-2 ${imageSrc ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
            {heading && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
                {heading}
              </h2>
            )}

            {description && (
              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-normal">
                {description}
              </p>
            )}

            {buttonText && buttonUrl && (
              <div className="pt-2">
                <Link
                  href={buttonUrl}
                  className="inline-flex items-center justify-center px-7 py-2.5 sm:px-8 sm:py-3 rounded-full bg-white hover:bg-slate-100 text-[#172033] hover:text-black text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md border border-white/40"
                >
                  {buttonText}
                </Link>
              </div>
            )}

            {/* Admin Sports Thumbnails Grid */}
            {thumbnails && thumbnails.length > 0 && (
              <div className="pt-6 border-t border-slate-800/80">
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {thumbnails.map((item) => {
                    const content = (
                      <div className="group cursor-pointer text-center">
                        {/* Thumbnail image with subtle border and red underline bar */}
                        <div className="relative rounded-lg overflow-hidden border border-slate-700/80 bg-slate-900/60 aspect-[4/3] mb-1.5 shadow-sm group-hover:border-slate-500 transition-all">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-800" />
                          )}
                          {/* Thin white accent line at bottom of thumbnail */}
                          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-medium text-slate-300 group-hover:text-white transition-colors block truncate">
                          {item.title}
                        </span>
                      </div>
                    );

                    return item.url ? (
                      <Link key={item.id} href={item.url}>
                        {content}
                      </Link>
                    ) : (
                      <div key={item.id}>{content}</div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
