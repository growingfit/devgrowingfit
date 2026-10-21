import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { getHomePageData } from '@/lib/queries/public';
import { Quote } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Us — Growing Fit Sports Academy',
  description:
    'Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals.',
};

export default async function AboutPage() {
  const data = await getHomePageData();

  // About Us Data
  const aboutEyebrow = data.about?.eyebrow || 'ABOUT US';
  const aboutHeading = data.about?.heading || 'About Us';
  const highlightQuote =
    (data.about as any)?.highlight_quote ||
    '“Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals”';
  const aboutDescription =
    data.about?.description ||
    'Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals. We offer a wide range of sports programs, including Kung Fu, Muay Thai, Boxing, Roller Skating, Football, Swimming, and Badminton, to help our members stay active, healthy, and achieve their full potential.';

  // Sports program tags extracted from the second image text
  const sportsPrograms = [
    'Kung Fu',
    'Muay Thai',
    'Boxing',
    'Roller Skating',
    'Football',
    'Swimming',
    'Badminton',
  ];

  // Hero Banner data reused from herobanner section for single about us banner
  const firstHeroSlide =
    data.hero?.slides && data.hero.slides.length > 0
      ? data.hero.slides[0]
      : null;

  const aboutBannerImage =
    (data.about as any)?.banner_image_url ||
    firstHeroSlide?.image_url ||
    data.hero?.image_url ||
    'https://res.cloudinary.com/nvho1sss/image/upload/v1792563443/growing_fit/lmupafbyumygrqjz7jcg.png';

  const aboutBannerMobileImage =
    (data.about as any)?.banner_mobile_image_url ||
    firstHeroSlide?.mobile_image_url ||
    data.hero?.mobile_image_url ||
    'https://res.cloudinary.com/nvho1sss/image/upload/v1792564706/growing_fit/osjliaabzcwpmicfnmo6.png';

  const aboutHeroData = {
    ...data.hero,
    heading: '',
    slides: [
      {
        id: 'about-hero-banner-1',
        title: 'About Us',
        image_url: aboutBannerImage,
        mobile_image_url: aboutBannerMobileImage,
        heading: '',
        is_visible: true,
      },
    ],
  };

  // Mission & Vision Data
  const visionEyebrow = data.vision?.eyebrow || 'OUR PURPOSE';
  const visionHeading = data.vision?.heading || 'Mission & Vision';
  const missionEyebrow = (data.vision as any)?.mission_eyebrow || 'OUR MISSION';
  const missionTitle = (data.vision as any)?.mission_title || 'Mission';
  const missionDescription =
    (data.vision as any)?.mission_description ||
    'Our mission at Growing Fit is to empower individuals of all ages and abilities to lead healthy, active, and fulfilling lives. We strive to achieve this mission by providing high-quality sports training programs, promoting physical fitness and mental well-being, and fostering a supportive and inclusive community.';
  const visionColumnEyebrow = (data.vision as any)?.vision_eyebrow || 'OUR VISION';
  const visionTitle = (data.vision as any)?.vision_title || 'Vision';
  const visionDescription =
    data.vision?.description ||
    'Our vision at Growing Fit is to be a leading sports academy that empowers individuals to achieve their full potential, both on and off the field. We envision a future where individuals of all ages and abilities have access to high-quality sports training programs that promote physical fitness and mental well-being, and where a supportive and inclusive community fosters personal growth and success.';

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172033] relative overflow-hidden font-sans">
      <Header headerSettings={data.headerSettings} />

      <main className="flex-grow relative z-10">
        {/* Full-width Hero Banner reused from Hero Banner section */}
        {aboutBannerImage && (
          <HeroSection data={aboutHeroData as any} />
        )}

        <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-6 sm:pt-8 pb-20 sm:pb-28">
          {/* Breadcrumbs - all red lines and red text changed to black */}
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold mb-8 sm:mb-12" aria-label="Breadcrumb">
            <Link href="/" className="text-[#667085] hover:text-[#172033] transition-colors">
              Home
            </Link>
            <span className="text-[#172033] px-1 font-bold">/</span>
            <span className="text-[#172033] font-bold">About Us</span>
          </nav>

          {/* ========================================================
              SECTION 1: ABOUT US (CARD LAYOUT)
          ======================================================== */}
          <section className="space-y-8">
            {/* Header: Eyebrow + Title in solid Black */}
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="w-8 sm:w-10 h-[2.5px] bg-[#172033] rounded-full" />
                <span className="text-xs sm:text-[13px] font-bold tracking-[0.2em] text-[#172033] uppercase">
                  {aboutEyebrow}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.08] text-[#172033]">
                {aboutHeading}
              </h1>
            </div>

            {/* About Us Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch pt-2">
              {/* Card 1: Highlight Statement Card (from Image 2) */}
              <div className="lg:col-span-6 flex flex-col justify-between bg-gradient-to-br from-[#F8F9FA] to-white border border-[#E8E8EC] rounded-3xl p-8 sm:p-10 shadow-xs relative overflow-hidden">
                <div className="space-y-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#172033] text-white shadow-xs">
                    <Quote className="w-6 h-6" />
                  </div>
                  <blockquote className="text-xl sm:text-2xl lg:text-[28px] font-black text-[#172033] tracking-tight leading-snug">
                    {highlightQuote}
                  </blockquote>
                </div>
                <div className="pt-8 border-t border-[#F0F1F3] mt-8 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                    Growing Fit Sports Academy
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#172033]" />
                </div>
              </div>

              {/* Card 2: Narrative Overview & Programs Card (from Image 2) */}
              <div className="lg:col-span-6 flex flex-col justify-between bg-white border border-[#E8E8EC] rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#172033]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                      Our Academy Overview
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#475467] leading-[1.8] font-normal">
                    {aboutDescription}
                  </p>
                </div>

                {/* Sports Programs Pills */}
                <div className="pt-6 border-t border-[#F0F1F3]">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-3">
                    Featured Sports Programs
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sportsPrograms.map((program) => (
                      <span
                        key={program}
                        className="inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#F4F5F7] border border-[#E8E8EC] text-[#172033] hover:bg-[#172033] hover:text-white transition-colors"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              SECTION 2: MISSION & VISION (CARD LAYOUT)
          ======================================================== */}
          <section id="vision" className="mt-16 sm:mt-24 lg:mt-28 space-y-8">
            {/* Header: Eyebrow + Title in solid Black */}
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="w-8 sm:w-10 h-[2.5px] bg-[#172033] rounded-full" />
                <span className="text-xs sm:text-[13px] font-bold tracking-[0.2em] text-[#172033] uppercase">
                  {visionEyebrow}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#172033] tracking-tight leading-tight">
                {visionHeading}
              </h2>
            </div>

            {/* Mission & Vision Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch pt-2">
              {/* Mission Card (from Image 3) */}
              <div className="bg-white border border-[#E8E8EC] rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold tracking-[0.16em] text-[#172033] uppercase block mb-2">
                      {missionEyebrow}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
                      {missionTitle}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#475467] leading-[1.8] font-normal pt-1">
                    {missionDescription}
                  </p>
                </div>
              </div>

              {/* Vision Card (from Image 3) */}
              <div className="bg-white border border-[#E8E8EC] rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold tracking-[0.16em] text-[#172033] uppercase block mb-2">
                      {visionColumnEyebrow}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
                      {visionTitle}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#475467] leading-[1.8] font-normal pt-1">
                    {visionDescription}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer
        footerSettings={data.footer}
        contactSettings={data.contact}
        centres={data.centres}
        socialLinks={data.socialLinks}
      />
    </div>
  );
}
