'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  enquireUrl?: string;
  imageUrl?: string | null;
}

export function CTASection({ enquireUrl = '#contact', imageUrl }: CTASectionProps) {
  const bgImage = imageUrl || '/images/cta-skating-banner.png?v=2';

  return (
    <section id="cta" className="py-8 sm:py-10 lg:py-14 bg-white border-b border-[#E8E8EC] overflow-hidden">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Full Image Card as Background with Content in the Left Blank Space - Compact Height */}
        <div className="relative w-full rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[240px] md:min-h-[250px] lg:min-h-[260px] xl:min-h-[275px] lg:max-h-[300px] bg-white border border-[#E8E8EC]/80 shadow-xs">
          
          {/* Background Image Layer: Red geometric accents on far left, blank white area in left-center, coach & young skaters on right */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
            <img
              src={bgImage}
              alt="Join Growing Fit"
              className="w-full h-full object-cover object-[78%_center] sm:object-[72%_center] lg:object-center transition-all duration-300"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/cta-skating-banner.png';
              }}
            />
          </div>

          {/* Foreground Layer: Content Placed Exactly Inside the Blank Left Space */}
          <div className="relative z-10 w-full h-full min-h-[220px] sm:min-h-[240px] md:min-h-[250px] lg:min-h-[260px] xl:min-h-[275px] flex items-center py-5 sm:py-6 lg:py-0 px-4 sm:px-6 lg:px-0">
            
            {/* Text & Action Column:
                - lg:ml-[11%] xl:ml-[12%] 2xl:ml-[13%] ensures text stays clear of far-left red angles and dot grid
                - lg:w-[38%] xl:w-[36%] 2xl:w-[34%] ensures text stays within the white blank zone before the kids & coach
                - Compact spacing for sleek, small height
            */}
            <div className="w-full max-w-md lg:max-w-none lg:w-[38%] xl:w-[36%] 2xl:w-[34%] lg:ml-[11%] xl:ml-[12%] 2xl:ml-[13%] space-y-2.5 sm:space-y-3 xl:space-y-3.5 bg-white/95 lg:bg-transparent p-5 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none backdrop-blur-xs lg:backdrop-blur-none shadow-sm lg:shadow-none border border-[#E8E8EC]/80 lg:border-0">
              
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-4 bg-[#E11D2A] rounded-full inline-block" />
                <span className="text-[10px] sm:text-[11px] font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  JOIN GROWING FIT
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl lg:text-[26px] xl:text-[28px] font-black text-[#172033] tracking-tight leading-[1.24]">
                Take the First Step <br className="hidden sm:inline" />
                Towards a <span className="text-[#E11D2A]">Healthier</span> You.
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-[12.5px] text-[#475467] leading-relaxed max-w-sm sm:max-w-md lg:max-w-none">
                Be a part of a supportive community. Explore our programs and find the right sport for your child&apos;s growth.
              </p>

              {/* Action Button */}
              <div className="pt-1">
                <Link
                  href={enquireUrl}
                  className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white font-bold text-xs sm:text-sm px-6 py-2 sm:px-7 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
