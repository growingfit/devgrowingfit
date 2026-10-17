'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getHeroSectionAction } from '@/lib/actions/cms';
import { HeroSection as HeroSectionType } from '@/types/database';

interface HeroSectionProps {
  data?: HeroSectionType | null;
  benefits?: any[];
}

export function HeroSection({ data }: HeroSectionProps) {
  const [heroData, setHeroData] = useState<HeroSectionType | null>(data || null);

  useEffect(() => {
    if (data) setHeroData(data);
  }, [data]);

  // Client-side fetch to ensure newly uploaded admin image appears immediately
  useEffect(() => {
    async function loadFreshHero() {
      try {
        const res = await getHeroSectionAction();
        if (res?.hero) {
          setHeroData((prev) => ({ ...prev, ...res.hero }));
        }
      } catch (err) {
        console.error('Failed to load fresh hero in HeroSection:', err);
      }
    }
    loadFreshHero();
  }, []);

  const heading = heroData?.heading?.trim() || '';
  const tagline = (heroData?.description || heroData?.eyebrow)?.trim() || '';
  const heroImageSrc =
    heroData?.image_url && heroData.image_url.trim().length > 0
      ? heroData.image_url.trim()
      : null;

  const ctaText = heroData?.primary_cta_text;
  const ctaUrl = heroData?.primary_cta_url;

  return (
    <section className="relative w-full overflow-hidden bg-[#121316]">
      {/* Full-width sports banner image container */}
      <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[580px] xl:h-[640px]">
        {heroImageSrc ? (
          <img
            src={heroImageSrc}
            alt={heading || 'Growing Fit'}
            className="w-full h-full object-cover object-center"
            style={{
              objectPosition: heroData?.image_focal_position || 'center',
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#1A1D21]" />
        )}

        {/* Subtle dark gradient overlay for optimal text contrast */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Centered Typography Overlay matching reference screenshot */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center select-none">
          <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
            {/* Elegant serif heading */}
            {heading && (
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-wide drop-shadow-md">
                {heading}
              </h1>
            )}

            {/* Tagline / Subtitle */}
            {tagline && (
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.22em] sm:tracking-[0.28em] text-white/95 uppercase drop-shadow-sm">
                {tagline}
              </p>
            )}

            {/* Optional CTA if configured in Admin */}
            {ctaText && ctaUrl && (
              <div className="pt-4">
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#172033] hover:text-black text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg border border-white/40"
                >
                  {ctaText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
