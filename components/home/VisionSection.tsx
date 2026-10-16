'use client';

import React, { useState, useEffect } from 'react';
import { VisionSection as VisionSectionType } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface VisionSectionProps {
  data?: VisionSectionType | null;
}

export function VisionSection({ data }: VisionSectionProps) {
  const [visionData, setVisionData] = useState<VisionSectionType | null>(data || null);

  useEffect(() => {
    if (data) setVisionData(data);
  }, [data]);

  // Client-side fetch to ensure newly uploaded admin image appears immediately
  useEffect(() => {
    async function loadFreshVision() {
      try {
        const supabase = createClient();
        const { data: dbData } = await supabase
          .from('vision_sections')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (dbData) {
          setVisionData((prev) => ({ ...prev, ...dbData }));
        }
      } catch (err) {
        console.error('Failed to load fresh vision in VisionSection:', err);
      }
    }
    loadFreshVision();
  }, []);

  const eyebrow = visionData?.eyebrow || 'OUR PURPOSE';
  const heading = visionData?.heading || 'Our Mission & Vision';
  const subtitle =
    visionData?.subtitle ||
    'Inspiring and empowering every child through health, discipline, and active sports.';

  const missionTitle = visionData?.mission_title || 'MISSION';
  const missionDesc =
    visionData?.mission_description ||
    'To inspire and empower children through sports and physical education, promoting health, discipline, and confidence for a stronger, brighter tomorrow.';

  const visionTitle = visionData?.vision_title || 'VISION';
  const visionDesc =
    visionData?.description ||
    'To be a leading sports academy recognized for nurturing healthy, confident, and disciplined individuals who excel in sports and in life.';

  const imageUrl =
    visionData?.image_url && visionData.image_url.trim().length > 0
      ? visionData.image_url.trim()
      : '/images/vision-karate-girl.png?v=4';

  const isVisible = visionData?.is_visible ?? true;
  if (!isVisible) return null;

  const renderHeading = () => {
    if (heading.includes('&')) {
      const parts = heading.split('&');
      return (
        <>
          {parts[0]}&amp; <span className="text-[#E11D2A]">{parts.slice(1).join('&').trim()}</span>
        </>
      );
    }
    return heading;
  };

  return (
    <section id="vision" className="py-8 sm:py-10 lg:py-12 bg-white border-b border-[#E8E8EC] overflow-hidden">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* Section Header on Top of the Card */}
        <div className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8 text-left lg:pl-3 xl:pl-6">
          <div className="flex items-center gap-2.5">
            <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
            <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-[#172033] tracking-tight leading-[1.2]">
            {renderHeading()}
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* The Card - Wide Full Width with Compact Height */}
        <div className="relative w-full rounded-3xl overflow-hidden min-h-[260px] sm:min-h-[280px] md:min-h-[300px] lg:h-[320px] xl:h-[330px] bg-white border border-[#E8E8EC]/80 shadow-xs">

          {/* Background Image Layer: Full wide cover */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
            <img
              src={imageUrl}
              alt="Growing Fit Mission & Vision"
              className="w-full h-full object-cover object-center transition-all duration-300"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/vision-karate-girl.png';
              }}
            />
          </div>

          {/* Foreground Layer: 3-column split (Mission on Left, Centered Girl Spacer, Vision on Right) */}
          <div className="relative z-10 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center py-5 sm:py-6 lg:py-4 px-6 sm:px-10 lg:px-12 xl:px-16">

            {/* Left Column: Mission */}
            <div className="lg:col-span-4 space-y-2 sm:space-y-2.5 bg-white/95 lg:bg-transparent p-5 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none backdrop-blur-xs lg:backdrop-blur-none shadow-sm lg:shadow-none border border-[#E8E8EC]/80 lg:border-0 lg:pr-2">
              {/* Header with circular icon & compact title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {/* Target / Bullseye icon with diagonal arrow */}
                  <svg
                    className="w-5 h-5 text-[#E11D2A]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M19 5l-4.5 4.5" />
                    <path d="M16 5h3v3" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A]" />
                  <h3 className="text-xs sm:text-sm font-black tracking-[0.16em] uppercase text-[#172033]">
                    OUR <span className="text-[#E11D2A]">{missionTitle}</span>
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-[12.5px] text-[#475467] leading-relaxed max-w-xs sm:max-w-sm">
                {missionDesc}
              </p>
            </div>

            {/* Center Column Spacer: Leaves the Karate Girl in Background Unobstructed */}
            <div className="hidden lg:block lg:col-span-4 h-full pointer-events-none" aria-hidden="true" />

            {/* Right Column: Vision */}
            <div className="lg:col-span-4 space-y-2 sm:space-y-2.5 bg-white/95 lg:bg-transparent p-5 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none backdrop-blur-xs lg:backdrop-blur-none shadow-sm lg:shadow-none border border-[#E8E8EC]/80 lg:border-0 lg:pl-6 xl:pl-8">
              {/* Header with circular icon & compact title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {/* Eye / Vision Icon */}
                  <svg
                    className="w-5 h-5 text-[#E11D2A]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A]" />
                  <h3 className="text-xs sm:text-sm font-black tracking-[0.16em] uppercase text-[#172033]">
                    OUR <span className="text-[#E11D2A]">{visionTitle}</span>
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-[12.5px] text-[#475467] leading-relaxed max-w-xs sm:max-w-sm">
                {visionDesc}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
