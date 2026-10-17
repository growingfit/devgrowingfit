import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getHomePageData } from '@/lib/queries/public';
import {
  ChevronRight,
  Trophy,
  Medal,
  Heart,
  BookOpen,
  Users,
  GraduationCap,
  MapPin,
  Star,
  ArrowRight,
} from 'lucide-react';

// Synchronize images from the conversation assets into public/images
function ensureAboutAssets() {
  try {
    const destDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const brainDir = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\6846eb9f-70d4-4ef3-97a5-4d9aacd8ef54';
    const uploadDir = path.join(brainDir, '.user_uploaded');

    // 1. Hero Punching Girl Banner (Third uploaded image)
    const heroSrc = path.join(uploadDir, 'media_1792061878032.png');
    if (fs.existsSync(heroSrc)) {
      fs.copyFileSync(heroSrc, path.join(destDir, 'about-hero-banner.png'));
    }

    // 2. Philosophy Punching Boy Card (First uploaded image)
    const boySrc = path.join(uploadDir, 'media_1792061863544.jpg');
    if (fs.existsSync(boySrc)) {
      fs.copyFileSync(boySrc, path.join(destDir, 'about-philosophy-card.jpg'));
    }

    // 3. CTA High Kick Girl Banner (Second uploaded image)
    const ctaSrc = path.join(uploadDir, 'media_1792061869855.png');
    if (fs.existsSync(ctaSrc)) {
      fs.copyFileSync(ctaSrc, path.join(destDir, 'about-cta-banner.png'));
    }

    // Reference Mockup
    const refSrc = path.join(uploadDir, 'media_1792057275733.jpg');
    if (fs.existsSync(refSrc)) {
      fs.copyFileSync(refSrc, path.join(destDir, 'about-us-reference.jpg'));
    }
  } catch (err) {
    // Non-blocking in read-only environments
  }
}

ensureAboutAssets();

export const metadata = {
  title: 'About Us — Growing Fit Sports Academy',
  description:
    'Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals.',
};

export default async function AboutPage() {
  const data = await getHomePageData();

  const heroImage = data.about?.hero_image_url;
  const philosophyImage = data.about?.philosophy_image_url;
  const ctaImage = data.about?.cta_image_url;

  const coreValues = [
    {
      icon: Trophy,
      title: 'Discipline & Focus',
      description: 'Developing responsible and resilient individuals.',
    },
    {
      icon: Medal,
      title: 'Athletic Excellence',
      description: 'Structured curricula to build strong skills.',
    },
    {
      icon: Heart,
      title: 'Safety & Inclusivity',
      description: 'A positive and welcoming environment for all.',
    },
    {
      icon: BookOpen,
      title: 'Expert Mentorship',
      description: 'Guidance from certified and experienced coaches.',
    },
  ];

  const statistics = [
    {
      icon: Users,
      value: '5,000+',
      label: 'Happy Enrolled Students',
      desc: 'Across multiple sports programs',
    },
    {
      icon: GraduationCap,
      value: '40+',
      label: 'Certified Coaches',
      desc: 'National athletes & sports experts',
    },
    {
      icon: MapPin,
      value: '8+',
      label: 'Training Centres',
      desc: 'State-of-the-art facilities in Calicut & Kerala',
    },
    {
      icon: Star,
      value: '98%',
      label: 'Parent Satisfaction',
      desc: 'Rated for safety, excellence & discipline',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172033]">
      <Header />

      <main className="flex-grow">
        {/* ========================================================
            1. TOP HERO SECTION
        ======================================================== */}
        <section className="relative overflow-hidden bg-white pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pb-20 border-b border-[#F0F1F3]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#667085] font-medium mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#172033] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#98A2B3]" />
              <span className="text-[#172033] font-semibold">About Us</span>
            </nav>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-none mb-8 sm:mb-10 text-[#172033]">
              About <span className="text-[#E11D2A]">Us</span>
            </h1>

            {/* Hero Grid: Left Content (Proportional 2-column text block) + Right Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
              {/* Left Content Area: 2 Sub-Columns */}
              <div className="lg:col-span-7 xl:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
                  {/* Left Column: Bold Italic Pull-Quote (Editorial Style) */}
                  <div className="md:col-span-5 flex flex-col justify-start">
                    <blockquote className="text-lg sm:text-xl lg:text-[21px] font-bold italic text-[#172033] leading-[1.38] tracking-tight">
                      &ldquo;Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals&rdquo;
                    </blockquote>
                    <div className="w-14 h-[3px] bg-[#E11D2A] rounded-full mt-4 sm:mt-5" />
                  </div>

                  {/* Right Column: Detailed Narrative Paragraph */}
                  <div className="md:col-span-7 pt-0.5 sm:pt-1">
                    <p className="text-sm sm:text-[15px] lg:text-[15.5px] text-[#475467] leading-[1.72] font-normal">
                      Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals. We offer a wide range of sports programs, including Kung Fu, Muay Thai, Boxing, Roller Skating, Football, Swimming, and Badminton, to help our members stay active, healthy, and confident.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Hero Image: Young Girl Punching Forward with Seamless Left Blend */}
              {heroImage && (
                <div className="lg:col-span-5 xl:col-span-5 relative flex items-center justify-center lg:justify-start">
                  <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[430px] overflow-hidden flex items-center">
                    {/* Base Photo with focal position at 78% to pull subject left into full view */}
                    <img
                      src={heroImage}
                      alt="Young martial arts student punching forward at Growing Fit Academy"
                      className="w-full h-full object-cover object-[78%_center] select-none"
                    />
                    {/* Seamless Left Gradient Fade */}
                    <div className="absolute inset-y-0 left-0 w-20 sm:w-32 lg:w-40 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            2. OUR PHILOSOPHY SECTION
        ======================================================== */}
        <section className="relative overflow-hidden bg-white py-14 sm:py-18 lg:py-22 border-b border-[#F0F1F3]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
              {/* Left Text Narrative */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                {/* Eyebrow */}
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-6 h-[2.5px] bg-[#E11D2A] rounded-full" />
                  <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                    OUR PHILOSOPHY
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-black text-[#172033] tracking-tight leading-[1.2] mb-4">
                  Beyond The Field:<br className="hidden sm:inline" />
                  <span className="sm:block sm:mt-1">
                    Transforming <span className="text-[#E11D2A]">Mind, Body &amp; Spirit</span>
                  </span>
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#475467] leading-[1.75] max-w-xl">
                  In an era dominated by screens and sedentary habits, Growing Fit bridges the gap by making physical fitness an enjoyable, empowering habit for children. We believe sports training is not just about winning medals — it is about cultivating self-esteem, motor coordination, emotional resilience, and lifelong camaraderie.
                </p>
              </div>

              {/* Right Philosophy Image: Boy in Dark Uniform Punching Forward */}
              {philosophyImage && (
                <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-start">
                  <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden flex items-center">
                    <img
                      src={philosophyImage}
                      alt="Martial arts philosophy and youth physical empowerment"
                      className="w-full h-full object-cover object-[78%_center] select-none"
                    />
                    {/* Seamless Left Fade */}
                    <div className="absolute inset-y-0 left-0 w-20 sm:w-32 lg:w-36 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            3. OUR CORE VALUES SECTION
        ======================================================== */}
        <section className="bg-white py-14 sm:py-18 lg:py-20">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
            {/* Section Header */}
            <div className="mb-10 sm:mb-14">
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="w-6 h-[2.5px] bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  OUR CORE VALUES
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#172033] tracking-tight">
                Values That Guide Every Batch
              </h2>
              <p className="text-xs sm:text-sm text-[#667085] mt-1.5">
                We instill more than just sports skills — we build character, confidence and lifelong values.
              </p>
            </div>

            {/* 4 Horizontal Columns with Clean Divider Lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={idx}
                    className={`py-6 sm:py-6 lg:py-4 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center group
                      ${/* Divider logic: borders on tablet 2x2 and desktop 4-cols */ ''}
                      border-[#E8E8EC]
                      ${idx < 3 ? 'lg:border-r' : ''}
                      ${idx % 2 === 0 ? 'sm:border-r lg:border-r' : 'sm:border-r-0'}
                      ${idx < 2 ? 'border-b sm:border-b lg:border-b-0' : 'border-b sm:border-b-0'}
                    `}
                  >
                    {/* Centered Red Icon */}
                    <div className="w-12 h-12 flex items-center justify-center text-[#E11D2A] mb-3.5 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 stroke-[1.8]" />
                    </div>
                    {/* Title */}
                    <h3 className="text-base sm:text-[17px] font-bold text-[#172033] mb-2 tracking-tight min-h-[26px] flex items-center justify-center">
                      {val.title}
                    </h3>
                    {/* Subtitle / Description */}
                    <p className="text-xs sm:text-[13px] text-[#667085] leading-relaxed max-w-[210px] mx-auto">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            4. STATISTICS BAR (DARK NAVY BAND)
        ======================================================== */}
        <section className="bg-[#0B1528] text-white py-12 sm:py-16">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {statistics.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`py-6 sm:py-4 px-4 sm:px-6 text-center flex flex-col items-center justify-center
                      border-slate-800/80
                      ${idx < 3 ? 'lg:border-r' : ''}
                      ${idx % 2 === 0 ? 'sm:border-r lg:border-r' : 'sm:border-r-0'}
                      ${idx < 2 ? 'border-b sm:border-b lg:border-b-0' : 'border-b sm:border-b-0'}
                      last:border-b-0
                    `}
                  >
                    {/* Icon */}
                    <div className="text-slate-300 mb-3 flex items-center justify-center">
                      <IconComponent className="w-7 h-7 stroke-[1.8]" />
                    </div>
                    {/* Value */}
                    <div className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#E11D2A] tracking-tight leading-none mb-2">
                      {stat.value}
                    </div>
                    {/* Label */}
                    <div className="text-sm sm:text-[15px] font-bold text-white mb-1">
                      {stat.label}
                    </div>
                    {/* Description */}
                    <p className="text-xs sm:text-[13px] text-slate-400 max-w-[210px] mx-auto leading-normal">
                      {stat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            5. CALL TO ACTION BANNER (SOFT BLUSH CARD)
        ======================================================== */}
        <section className="bg-white py-12 sm:py-16">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF5F6] via-[#FFF0F2] to-[#FFEBEF] border border-[#FFE4E8] shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[320px]">
                {/* Left Action Copy */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 space-y-3.5 sm:space-y-4">
                  {/* Eyebrow */}
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-[2.5px] bg-[#E11D2A] rounded-full" />
                    <span className="text-xs font-black tracking-widest text-[#E11D2A] uppercase">
                      EXPERIENCE GROWING FIT
                    </span>
                  </div>

                  {/* Heading */}
                  <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black text-[#172033] tracking-tight leading-tight">
                    Ready to See <span className="text-[#E11D2A]">Your Child Thrive?</span>
                  </h2>

                  {/* Paragraph */}
                  <p className="text-sm sm:text-[15px] text-[#475467] leading-relaxed max-w-lg">
                    Book a complimentary trial session at your nearest Growing Fit training centre and let our certified coaches evaluate your child&apos;s athletic potential.
                  </p>

                  {/* Pill Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <span>Book Free Trial Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/programs"
                      className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-[#172033] border border-[#D0D5DD] text-xs sm:text-sm font-bold px-7 py-3 rounded-full transition-all duration-200 shadow-2xs"
                    >
                      <span>Explore All Programs</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side: Karate Girl High Side Kick */}
                {ctaImage && (
                  <div className="lg:col-span-5 relative h-[280px] sm:h-[320px] lg:h-[360px] overflow-hidden flex items-center justify-start">
                    <img
                      src={ctaImage}
                      alt="Martial arts student performing side kick at Growing Fit"
                      className="w-full h-full object-cover object-[78%_center] select-none pointer-events-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          6. FOOTER
      ======================================================== */}
      <Footer
        footerSettings={data.footer}
        contactSettings={data.contact}
        centres={data.centres}
        socialLinks={data.socialLinks}
      />
    </div>
  );
}
