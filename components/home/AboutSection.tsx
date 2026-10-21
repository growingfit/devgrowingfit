'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAboutSectionAction } from '@/lib/actions/cms';
import { AboutSection as AboutSectionType, AboutFeature } from '@/types/database';
import { optimizeImageUrl } from '@/lib/utils/image';

interface AboutSectionProps {
  data?: AboutSectionType | null;
  features?: AboutFeature[];
}

const DEFAULT_FEATURES: AboutFeature[] = [
  {
    id: 'feat-1',
    title: 'Experienced Coaches',
    description: 'Learn from qualified and passionate trainers.',
    icon: 'coaches',
    sort_order: 1,
    is_visible: true,
  },
  {
    id: 'feat-2',
    title: 'Safe & Supportive Environment',
    description: 'A positive space for every child.',
    icon: 'environment',
    sort_order: 2,
    is_visible: true,
  },
  {
    id: 'feat-3',
    title: 'Quality Training Programs',
    description: 'Structured programs for all age groups.',
    icon: 'programs',
    sort_order: 3,
    is_visible: true,
  },
  {
    id: 'feat-4',
    title: 'Focus on Overall Well-being',
    description: 'Building stronger, happier and healthier kids.',
    icon: 'wellbeing',
    sort_order: 4,
    is_visible: true,
  },
];

export function AboutSection({ data, features = [] }: AboutSectionProps) {
  const [aboutData, setAboutData] = useState<AboutSectionType | null>(data || null);

  // Sync if props update
  useEffect(() => {
    if (data) setAboutData(data);
  }, [data]);

  // Client-side fetch to ensure newly uploaded admin image appears immediately
  useEffect(() => {
    async function loadFreshAbout() {
      try {
        const res = await getAboutSectionAction();
        if (res) {
          setAboutData((prev) => ({ ...prev, ...res }));
        }
      } catch (err) {
        console.error('Failed to load fresh about in AboutSection:', err);
      }
    }
    loadFreshAbout();
  }, []);

  const eyebrow = aboutData?.eyebrow || 'ABOUT GROWING FIT';
  const heading = aboutData?.heading || 'More Than Just';
  const highlightedText =
    aboutData?.highlighted_text && aboutData.highlighted_text !== 'Sports.'
      ? aboutData.highlighted_text
      : 'Martial Arts.';
  const description =
    aboutData?.description && !aboutData.description.includes('dedicated sports academy')
      ? aboutData.description
      : 'Growing Fit is a dedicated martial arts academy focused on the holistic development of children. Our professional training programs in Karate, Kung Fu, Muay Thai, Boxing, and more, help every child stay active, confident and disciplined in life.';
  const buttonText = aboutData?.button_text || 'Know More';
  const buttonUrl = aboutData?.button_url || '#contact';
  const rawAboutImageSrc =
    aboutData?.image_url && aboutData.image_url.trim().length > 0
      ? aboutData.image_url.trim()
      : null;
  const aboutImageSrc = rawAboutImageSrc
    ? optimizeImageUrl(rawAboutImageSrc, { width: 1400, quality: 'auto', format: 'auto' })
    : null;

  const displayFeatures =
    features && features.filter((f) => f.is_visible).length > 0
      ? features.filter((f) => f.is_visible)
      : DEFAULT_FEATURES;

  const renderIcon = (iconName: string = '', title: string = '') => {
    const key = `${iconName} ${title}`.toLowerCase();

    // 1. Experienced Coaches
    if (key.includes('coach') || key.includes('user') || key.includes('trainer')) {
      return (
        <svg
          className="w-5 h-5 text-[#172033]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    }

    // 2. Safe & Supportive Environment
    if (key.includes('safe') || key.includes('shield') || key.includes('environment')) {
      return (
        <svg
          className="w-5 h-5 text-[#172033]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    }

    // 3. Quality Training Programs (Dumbbell)
    if (
      key.includes('dumbbell') ||
      key.includes('quality') ||
      key.includes('training') ||
      key.includes('program') ||
      key.includes('fitness')
    ) {
      return (
        <svg
          className="w-5 h-5 text-[#172033]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 5v14" />
          <path d="M18 5v14" />
          <path d="M4 8v8" />
          <path d="M20 8v8" />
          <line x1="6" y1="12" x2="18" y2="12" strokeWidth="2.5" />
        </svg>
      );
    }

    // 4. Focus on Overall Well-being
    return (
      <svg
        className="w-5 h-5 text-[#172033]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    );
  };

  return (
    <section id="about" className="py-10 sm:py-14 lg:py-16 bg-white border-b border-[#E8E8EC] overflow-hidden">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Unified Horizontal About Growing Fit Card */}
        <div className="relative w-full rounded-3xl lg:rounded-[36px] bg-white border border-[#E8E8EC] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          
          {/* Mobile & Tablet Header Image (< lg): Positioned to the left with NO fade effect */}
          {aboutImageSrc && (
            <div className="block lg:hidden relative w-full h-56 sm:h-72 overflow-hidden bg-slate-50 border-b border-[#E8E8EC]">
              <img
                src={aboutImageSrc}
                alt="About Growing Fit Martial Arts"
                className="w-full h-full object-cover object-left"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}

          {/* Desktop Full-card Left-aligned Background Image (>= lg) with NO fade effect */}
          {aboutImageSrc && (
            <div
              className="hidden lg:block absolute inset-0 bg-no-repeat pointer-events-none z-0"
              style={{
                backgroundImage: `url('${aboutImageSrc}')`,
                backgroundPosition: 'left center',
                backgroundSize: 'cover',
              }}
            />
          )}

          {/* Content Container */}
          <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10 xl:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 items-center min-h-0 lg:min-h-[440px]">
              
              {/* Left transparent spacer column (Columns 1-5 on desktop): Preserves 100% full view of martial arts photograph */}
              <div className="hidden lg:block lg:col-span-5 xl:col-span-5 pointer-events-none" />

              {/* Middle Column: Blank Space Text Content */}
              <div className="lg:col-span-4 xl:col-span-4 space-y-3.5 sm:space-y-4 relative z-10">
                {/* Faint Martial Arts Flying Kick Silhouette Watermark */}
                <div className="absolute top-0 right-0 w-36 h-36 sm:w-44 sm:h-44 opacity-[0.05] pointer-events-none select-none z-0">
                  <svg
                    viewBox="0 0 100 100"
                    fill="currentColor"
                    className="w-full h-full text-slate-800"
                  >
                    <circle cx="50" cy="18" r="6" />
                    <path d="M 44 26 C 48 24, 54 28, 56 34 L 54 44 L 62 48 L 74 46 C 78 45, 82 48, 80 52 C 78 55, 72 54, 66 54 L 54 52 L 48 58 L 44 72 L 42 85 C 41 89, 36 90, 35 86 L 38 72 L 42 56 L 36 50 L 26 58 C 22 62, 18 58, 20 54 L 32 44 L 40 32 L 44 26 Z" />
                    <path d="M 52 46 L 70 36 L 86 26 C 92 22, 96 26, 92 31 L 76 42 L 58 50 Z" />
                  </svg>
                </div>

                {/* Eyebrow */}
                <div className="flex items-center gap-2">
                  <span className="h-[2px] w-5 bg-[#172033] rounded-full inline-block" />
                  <span className="text-[11px] sm:text-xs font-black tracking-[0.18em] text-[#172033] uppercase">
                    {eyebrow}
                  </span>
                </div>

                {/* 2-line Headline */}
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-black text-[#172033] tracking-tight leading-[1.18]">
                  More Than <br />
                  Just <span className="text-[#172033]">{highlightedText.endsWith('.') ? highlightedText : `${highlightedText}.`}</span>
                </h2>

                {/* Paragraph in blank space */}
                <p className="text-xs sm:text-[13.5px] text-[#556477] leading-relaxed max-w-[420px]">
                  {description}
                </p>

                {/* White "Know More" CTA Button */}
                <div className="pt-2">
                  <Link
                    href={buttonUrl}
                    className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-[#172033] hover:text-black font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 rounded-xl sm:rounded-2xl border border-[#D0D5DD] shadow-xs hover:shadow-sm transition-all duration-200 group"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column: 4 Feature Cards (1-col on desktop, 2-col on tablet, 1-col on mobile) */}
              <div className="lg:col-span-3 xl:col-span-3 relative z-10 pt-5 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-3.5 xl:gap-4">
                  {displayFeatures.slice(0, 4).map((feature, idx) => (
                    <div
                      key={feature.id || idx}
                      className="flex items-start gap-3 sm:gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-[#FAFAFC] lg:bg-transparent border border-[#E8E8EC]/60 lg:border-0 group hover:bg-[#F0F2F5] lg:hover:bg-transparent transition-colors"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 xl:w-12 xl:h-12 rounded-2xl bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center text-[#172033] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        {renderIcon(feature.icon, feature.title)}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="text-xs sm:text-[13.5px] xl:text-[14px] font-bold text-[#172033] leading-snug">
                          {feature.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
