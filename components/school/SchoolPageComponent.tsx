'use client';

import React from 'react';
import { SchoolPageData } from '@/types/database';
import { Header } from '@/components/layout/Header';
import { SchoolHeroSlider } from '@/components/school/SchoolHeroSlider';
import { WhyGrowingFitSlider } from '@/components/school/WhyGrowingFitSlider';
import { SchoolIntroSection } from '@/components/school/SchoolIntroSection';
import { WhatsInForKidsSection } from '@/components/school/WhatsInForKidsSection';
import { SchoolTabsSection } from '@/components/school/SchoolTabsSection';
import { CurriculumSection } from '@/components/school/CurriculumSection';
import { SchoolGlimpsesSlider } from '@/components/school/SchoolGlimpsesSlider';
import { SchoolTestimonialsSection } from '@/components/school/SchoolTestimonialsSection';
import { SchoolFooter } from '@/components/school/SchoolFooter';

interface SchoolPageComponentProps {
  data: SchoolPageData;
}

export function SchoolPageComponent({ data }: SchoolPageComponentProps) {
  // Ensure header has navigation with 'School' set to current path
  const headerSettings = data.headerSettings || {
    logo_url: '/growfit logo.png',
    tagline: 'Sports for a Stronger Tomorrow',
    nav_links: [
      { label: 'Home', href: '/', is_visible: true },
      { label: 'School', href: '/schools', is_visible: true },
      { label: 'About Us', href: '/about', is_visible: true },
      { label: 'Contact', href: '/contact', is_visible: true },
    ],
    show_location: true,
    location_name: 'Bangalore',
    show_login: true,
    show_cart: false,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172033] font-sans selection:bg-black selection:text-white">
      {/* 1. Header and Navigation matching reference with active black underline */}
      <Header headerSettings={headerSettings} />

      <main className="flex-grow">
        {/* 2. Top Hero Image Slider */}
        <SchoolHeroSlider data={data.hero} />

        {/* 3. Why Growing Fit — Horizontal Content Slider */}
        <WhyGrowingFitSlider data={data.whyGrowingFit} />

        {/* 4. Introduction Content Section */}
        <SchoolIntroSection data={data.introduction} />

        {/* 5. What's in for Kids — 4 Image Cards */}
        <WhatsInForKidsSection data={data.whatsInForKids} />

        {/* 6. Health and Fitness / Skill Development / Sports Training Tabs */}
        <SchoolTabsSection data={data.tabsSection} />

        {/* 7. Curriculum Section */}
        <CurriculumSection data={data.curriculum} />

        {/* 8. Glimpses of Previous Year — Gallery Slider with Lightbox */}
        <SchoolGlimpsesSlider data={data.glimpses} />

        {/* 9. Testimonials */}
        <SchoolTestimonialsSection data={data.testimonials} />
      </main>

      {/* 10. Footer matching reference design */}
      <SchoolFooter />
    </div>
  );
}
