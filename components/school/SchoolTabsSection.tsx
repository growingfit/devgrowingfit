'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SchoolTabsSection as SchoolTabsSectionType } from '@/types/database';
import { optimizeImageUrl } from '@/lib/utils/image';

interface SchoolTabsSectionProps {
  data: SchoolTabsSectionType;
}

export function SchoolTabsSection({ data }: SchoolTabsSectionProps) {
  const tabs = data?.tabs || [];
  const [activeTabId, setActiveTabId] = useState<string>(
    data?.activeTab || (tabs[0]?.id ?? 'health-and-fitness')
  );

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const items = currentTab?.items || [];

  return (
    <section className="w-full bg-white pt-8 sm:pt-10 pb-14 sm:pb-20 border-b border-[#F0F1F3]">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Centered Horizontal Text Tab Navigation */}
        <div className="flex items-center justify-center border-b border-[#E5E7EB] mb-8 sm:mb-12 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-8 sm:gap-12 md:gap-16 px-4">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`relative py-3.5 text-xs sm:text-sm md:text-base font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#172033] font-bold'
                      : 'text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  {tab.label}
                  {/* Active Black Underline Indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#172033] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Box: Soft light-grey / ice-tint background container */}
        <div className="bg-[#F2F6FC] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E2E8F0]/70 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="space-y-4 flex flex-col justify-between">
                <div>
                  {/* Column Image - only show when image is added */}
                  {item.image_url && item.image_url.trim().length > 0 && (
                    <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-200 mb-4 shadow-2xs">
                      <img
                        src={optimizeImageUrl(item.image_url, { width: 600, quality: 'auto', format: 'auto' })}
                        alt={item.title}
                        className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#172033] tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>

                {/* Optional Action / SHOW MORE Link in pure Black and White */}
                {item.link_text && (
                  <div className="pt-1">
                    <Link
                      href={item.link_url || '#contact'}
                      className="text-xs font-black tracking-wider uppercase text-[#172033] hover:text-black hover:opacity-75 underline underline-offset-4 decoration-2 transition-all inline-block"
                    >
                      {item.link_text}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
