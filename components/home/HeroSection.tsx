'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HeroSection as HeroSectionType, HeroBenefit } from '@/types/database';

interface HeroSectionProps {
  data?: HeroSectionType | null;
  benefits?: HeroBenefit[];
}

export function HeroSection({ data, benefits = [] }: HeroSectionProps) {
  const [heroData, setHeroData] = useState<HeroSectionType | null>(data || null);

  // Sync if props update
  useEffect(() => {
    if (data) setHeroData(data);
  }, [data]);

  // Client-side fetch to ensure newly uploaded admin image appears immediately
  useEffect(() => {
    async function loadFreshHero() {
      try {
        const supabase = createClient();
        const { data: dbData } = await supabase
          .from('hero_sections')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (dbData) {
          setHeroData((prev) => ({ ...prev, ...dbData }));
        }
      } catch (err) {
        console.error('Failed to load fresh hero in HeroSection:', err);
      }
    }
    loadFreshHero();
  }, []);

  const eyebrow = heroData?.eyebrow || 'SCHOOL OF HEALTH & PHYSICAL EDUCATION';
  const heading = heroData?.heading || 'Stronger Kids. Brighter';
  const highlightedText = heroData?.highlighted_text || 'Futures.';
  const description =
    heroData?.description ||
    'At Growing Fit, we help children build strength, confidence and discipline through sports and physical education.';
  const primaryCtaText = heroData?.primary_cta_text || 'Explore Programs';
  const primaryCtaUrl = heroData?.primary_cta_url || '#programs';
  const secondaryCtaText = heroData?.secondary_cta_text || 'Enquire Now';
  const secondaryCtaUrl = heroData?.secondary_cta_url || '#contact';
  const heroImageSrc =
    heroData?.image_url && heroData.image_url.trim().length > 0
      ? heroData.image_url.trim()
      : '/images/hero-martial-arts.png';

  const items =
    benefits && benefits.length > 0
      ? benefits
      : [
          { id: '1', title: 'Physical Fitness', icon: 'fitness' },
          { id: '2', title: 'Confidence & Discipline', icon: 'discipline' },
          { id: '3', title: 'Healthy Lifestyle', icon: 'lifestyle' },
          { id: '4', title: 'Lifelong Skills', icon: 'skills' },
        ];

  const renderBenefitIcon = (iconType: string) => {
    const key = iconType.toLowerCase();

    // 1. Physical Fitness
    if (key.includes('fitness') || key.includes('physical') || key.includes('runner') || key.includes('activity')) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-7 h-7 stroke-[#E11D2A] stroke-linecap-round stroke-linejoin-round"
        >
          <circle cx="13" cy="4.5" r="2" stroke="#E11D2A" strokeWidth="2.2" />
          <path d="M11.5 8c-2.3-.2-3.8 1-4.8 2.5" stroke="#E11D2A" strokeWidth="2.3" />
          <path d="M11.8 8l-2.3 5.5" stroke="#E11D2A" strokeWidth="2.3" />
          <path d="M11.8 8.2c2.2.5 3.5 1.8 4.8 1" stroke="#E11D2A" strokeWidth="2.3" />
          <path d="M9.5 13.5c-1.5 1.5-2.8 2.5-4.8 3.3" stroke="#E11D2A" strokeWidth="2.3" />
          <path d="M9.5 13.5l2.8 2.5v4" stroke="#E11D2A" strokeWidth="2.3" />
        </svg>
      );
    }

    // 2. Confidence & Discipline
    if (key.includes('discipline') || key.includes('confidence') || key.includes('award') || key.includes('medal')) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E11D2A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    }

    // 3. Healthy Lifestyle
    if (key.includes('lifestyle') || key.includes('health') || key.includes('heart') || key.includes('apple')) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E11D2A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    }

    // 4. Lifelong Skills
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E11D2A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    );
  };

  const formatTitle = (title: string) => {
    if (title.includes('&')) {
      const parts = title.split('&');
      return (
        <>
          {parts[0].trim()}
          <br />&amp; {parts[1].trim()}
        </>
      );
    }
    const words = title.split(' ');
    if (words.length === 2) {
      return (
        <>
          {words[0]}
          <br />
          {words[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-[#E8E8EC]">
      {/* Full-width Background Image Layer */}
      <div
        className="absolute inset-0 bg-no-repeat pointer-events-none z-0"
        style={{
          backgroundImage: `url('${heroImageSrc}')`,
          backgroundPosition: heroData?.image_focal_position || 'right center',
          backgroundSize: 'cover',
        }}
      />

      {/* Desktop/Tablet: Smooth horizontal white fade from left covering text area */}
      <div className="hidden sm:block absolute inset-y-0 left-0 w-full sm:w-[75%] lg:w-[62%] xl:w-[55%] bg-gradient-to-r from-white via-white/95 sm:via-white/90 via-75% to-transparent pointer-events-none z-0" />

      {/* Mobile: Gentle white background tint ensuring 100% text readability */}
      <div className="block sm:hidden absolute inset-0 bg-white/88 pointer-events-none z-0" />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-12 sm:py-16 lg:py-20 min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex items-center">
        <div className="max-w-[560px] lg:max-w-[620px] space-y-6 lg:pl-3 xl:pl-6">
          
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-3.5 sm:mb-4.5">
            <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
            <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
              {eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-black text-[#172033] tracking-tight leading-[1.22] sm:leading-[1.24] mb-4 sm:mb-5">
            Stronger Kids.
            <br />
            Brighter <span className="text-[#E11D2A]">{highlightedText}</span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-[15px] text-[#5A687D] leading-relaxed max-w-[480px] mb-7 sm:mb-8">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-6 sm:mb-8">
            <Link
              href={primaryCtaUrl}
              className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white text-sm font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#E11D2A] text-[#172033] hover:text-[#E11D2A] text-sm font-bold px-6 py-3.5 rounded-full shadow-2xs hover:shadow-sm transition-all duration-200 group"
            >
              <span>Join Program</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#E11D2A]" />
            </Link>
          </div>

          {/* 4 Feature Pillars with exact red icons & vertical dividers */}
          <div className="flex items-center max-w-[480px] pt-1">
            {items.slice(0, 4).map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="w-[1px] h-8 bg-[#E2E8F0] shrink-0" />
                )}
                <div className="flex-1 flex flex-col items-center text-center space-y-1.5 px-1 sm:px-2 group">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    {renderBenefitIcon(item.icon || item.title)}
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E293B] leading-tight">
                    {formatTitle(item.title)}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
