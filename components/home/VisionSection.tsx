'use client';

import React, { useState, useEffect } from 'react';
import { getVisionSectionAction } from '@/lib/actions/cms';
import { VisionSection as VisionSectionType } from '@/types/database';

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
        const res = await getVisionSectionAction();
        if (res) {
          setVisionData((prev) => ({ ...prev, ...res }));
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
      : null;

  const isVisible = visionData?.is_visible ?? true;
  if (!isVisible) return null;

  const renderHeading = () => {
    if (heading.includes('&')) {
      const parts = heading.split('&');
      return (
        <>
          {parts[0]}&amp; <span className="text-[#172033]">{parts.slice(1).join('&').trim()}</span>
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
            <span className="h-[2px] w-6 bg-[#172033] rounded-full" />
            <span className="text-xs font-black tracking-[0.18em] text-[#172033] uppercase">
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

        {/* The Card - Enlarged Prominent Card */}
        <div className="relative w-full rounded-3xl lg:rounded-[36px] overflow-hidden bg-white border border-[#E8E8EC] shadow-sm hover:shadow-md transition-shadow">

          {/* ========================================================
              MOBILE & TABLET VIEW (< lg):
              Vertical format: Vision Text on Top -> Image on Center -> Mission Text on Bottom
          ======================================================== */}
          <div className="block lg:hidden p-6 sm:p-8 space-y-6">
            
            {/* 1. TOP: Vision Text */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <svg
                    className="w-5 h-5 text-[#172033]"
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
                  <span className="w-2 h-2 rounded-full bg-[#172033]" />
                  <h3 className="text-sm font-black tracking-[0.16em] uppercase text-[#172033]">
                    OUR <span className="text-[#172033]">{visionTitle}</span>
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475467] leading-relaxed pl-1">
                {visionDesc}
              </p>
            </div>

            {/* 2. CENTER: Image */}
            {imageUrl && (
              <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-[#E8E8EC] bg-slate-50 shadow-xs">
                <img
                  src={imageUrl}
                  alt="Growing Fit Karate Girl"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}

            {/* 3. BOTTOM: Mission Text */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <svg
                    className="w-5 h-5 text-[#172033]"
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
                  <span className="w-2 h-2 rounded-full bg-[#172033]" />
                  <h3 className="text-sm font-black tracking-[0.16em] uppercase text-[#172033]">
                    OUR <span className="text-[#172033]">{missionTitle}</span>
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475467] leading-relaxed pl-1">
                {missionDesc}
              </p>
            </div>

          </div>

          {/* ========================================================
              DESKTOP VIEW (>= lg):
              Clean 3-column split with NO box cards on text
          ======================================================== */}
          <div className="hidden lg:block relative min-h-[440px] xl:min-h-[470px]">
            {/* Background Image Layer: Centered Karate Girl */}
            {imageUrl && (
              <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Growing Fit Mission & Vision"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}

            {/* Foreground Content: Mission on Left, Karate Girl Spacer, Vision on Right */}
            <div className="relative z-10 w-full h-full min-h-[440px] xl:min-h-[470px] grid grid-cols-12 gap-6 xl:gap-8 items-center py-10 xl:py-14 px-8 lg:px-12 xl:px-16">

              {/* Left Column: Mission Text (Clean & Clear, NO Card Container) */}
              <div className="col-span-4 space-y-3.5 pr-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <svg
                      className="w-6 h-6 text-[#172033]"
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
                    <span className="w-2 h-2 rounded-full bg-[#172033]" />
                    <h3 className="text-sm font-black tracking-[0.16em] uppercase text-[#172033]">
                      OUR <span className="text-[#172033]">{missionTitle}</span>
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-[13.5px] xl:text-sm text-[#334155] font-medium leading-relaxed max-w-sm">
                  {missionDesc}
                </p>
              </div>

              {/* Center Column Spacer: Karate Girl in full view */}
              <div className="col-span-4 h-full pointer-events-none" aria-hidden="true" />

              {/* Right Column: Vision Text (Clean & Clear, NO Card Container) */}
              <div className="col-span-4 space-y-3.5 pl-4 xl:pl-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <svg
                      className="w-6 h-6 text-[#172033]"
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
                    <span className="w-2 h-2 rounded-full bg-[#172033]" />
                    <h3 className="text-sm font-black tracking-[0.16em] uppercase text-[#172033]">
                      OUR <span className="text-[#172033]">{visionTitle}</span>
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-[13.5px] xl:text-sm text-[#334155] font-medium leading-relaxed max-w-sm">
                  {visionDesc}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
