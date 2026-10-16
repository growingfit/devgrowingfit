'use client';

import React from 'react';
import { Users, Trophy, MapPin, Star } from 'lucide-react';
import { SiteStatistic } from '@/types/database';

interface StatisticsSectionProps {
  statistics?: SiteStatistic[];
}

const DEFAULT_STATISTICS: SiteStatistic[] = [
  { id: 'stat-1', label: 'Happy Students', value: '500+', sort_order: 1, is_visible: true },
  { id: 'stat-2', label: 'Sports Programs', value: '10+', sort_order: 2, is_visible: true },
  { id: 'stat-3', label: 'Training Centers', value: '5+', sort_order: 3, is_visible: true },
  { id: 'stat-4', label: 'Parent Satisfaction', value: '95%', sort_order: 4, is_visible: true },
];

export function StatisticsSection({ statistics = [] }: StatisticsSectionProps) {
  const displayStats =
    statistics && statistics.length > 0 ? statistics : DEFAULT_STATISTICS;

  const renderStatIcon = (label: string = '') => {
    const k = label.toLowerCase();
    if (k.includes('student') || k.includes('kid') || k.includes('happy') || k.includes('athlete')) {
      return <Users className="w-7 h-7 sm:w-8 sm:h-8 text-[#E11D2A] stroke-[2]" />;
    }
    if (k.includes('program') || k.includes('sport') || k.includes('trophy')) {
      return <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#E11D2A] stroke-[2]" />;
    }
    if (k.includes('center') || k.includes('centre') || k.includes('location') || k.includes('facility')) {
      return <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-[#E11D2A] stroke-[2]" />;
    }
    return <Star className="w-7 h-7 sm:w-8 sm:h-8 text-[#E11D2A] stroke-[2]" />;
  };

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-white border-b border-[#E8E8EC] overflow-hidden">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Section Header on Top */}
        <div className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8 text-left lg:pl-3 xl:pl-6">
          <div className="flex items-center gap-2.5">
            <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
            <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
              OUR IMPACT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-[#172033] tracking-tight leading-[1.2]">
            Milestones That Drive <span className="text-[#E11D2A]">Excellence</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center py-7 sm:py-9 px-6 sm:px-10 bg-[#FAFAFC] border border-[#E8E8EC]/80 rounded-3xl shadow-xs">
          {displayStats.map((stat) => (
            <div
              key={stat.id}
              className="flex items-center gap-3.5 sm:gap-4 justify-start group"
            >
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                {renderStatIcon(stat.label)}
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl lg:text-[32px] font-black text-[#172033] tracking-tight leading-none">
                  {stat.value}
                </span>
                <span className="block text-xs sm:text-[13.5px] font-semibold text-[#667085] mt-1 leading-tight">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
