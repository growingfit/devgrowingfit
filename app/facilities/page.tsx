import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getHomePageData } from '@/lib/queries/public';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building,
  Award,
} from 'lucide-react';

export const metadata = {
  title: 'Training Facilities & Centres — Growing Fit Academy',
  description:
    'Explore our state-of-the-art sports facilities, synthetic courts, roller skating rinks, and training centres in Calicut, Kochi, and Kerala.',
};

export default async function FacilitiesPage() {
  const data = await getHomePageData();

  const arenas = [
    {
      title: 'Synthetic Badminton Arenas',
      subtitle: 'International BWF-Standard Flooring',
      desc: 'Shock-absorbent multi-layer synthetic court mats designed to minimize joint stress, paired with shadowless overhead LED sports lighting.',
      features: ['Anti-slip surface traction', 'High ceiling clearance (9+ meters)', 'Dedicated warm-up zone'],
    },
    {
      title: 'Professional Roller Skating Track',
      subtitle: 'Banked Speed & Artistic Rink',
      desc: 'Seamless acrylic-coated banked track engineered for optimal wheel grip, high-speed cornering stability, and padded safety perimeter rails.',
      features: ['Precision banked curve geometry', 'Continuous safety crash barriers', 'Junior training lane separation'],
    },
    {
      title: 'FIFA-Quality Artificial Football Turf',
      subtitle: 'All-Weather Astro Turf Ground',
      desc: 'High-density monofilament artificial grass with eco-friendly shock pad infill for authentic ball roll, slide safety, and night floodlit play.',
      features: ['Rain-permeable sub-drainage system', 'High-intensity LED floodlights', 'Regulation small-sided goalposts'],
    },
    {
      title: 'Martial Arts Kumite Dojo',
      subtitle: 'Safety Tatami High-Density Mats',
      desc: 'Dedicated Japanese-standard 40mm interlocking tatami puzzle mats offering superior impact cushioning for judo throws, high kicks, and Kata practice.',
      features: ['Full perimeter wall impact padding', 'Heavy punch bag suspension rigs', 'Mirror-lined form correction walls'],
    },
    {
      title: 'Temperature-Regulated Swimming Pools',
      subtitle: 'Ozone-Treated Aquatic Facility',
      desc: 'Crystal-clear 25-meter semi-Olympic pools featuring automated multi-stage filtration, gentle water heating, and dedicated non-swimmer wading bays.',
      features: ['Certified continuous lifeguard monitoring', 'Anti-wave lane dividers', 'Hygienic poolside shower & locker suites'],
    },
    {
      title: 'Athletic Conditioning & Agility Zone',
      subtitle: 'Functional Movement Ground',
      desc: 'Dedicated speed-ladder lanes, plyometric jump boxes, agility cones, and youth-safe resistance equipment to build foundational stamina.',
      features: ['Shock-absorbent rubber flooring', 'Youth-calibrated resistance bands', 'Electronic sprint timing gates'],
    },
  ];

  const defaultCentres = [
    {
      name: 'Growing Fit — Calicut Central Hub',
      address: 'Near Indoor Stadium, Rajaji Road, Kozhikode, Kerala 673004',
      phone: '+91 702 581 0722',
      email: 'calicut@growingfit.in',
      hours: 'Mon – Sat: 6:00 AM – 7:30 PM | Sun: 6:30 AM – 11:00 AM',
      sports: ['Badminton', 'Roller Skating', 'Football', 'Martial Arts', 'Fitness'],
    },
    {
      name: 'Growing Fit — Kochi Sports Arena',
      address: 'Kaloor Stadium Link Road, Kaloor, Kochi, Kerala 682017',
      phone: '+91 702 581 0723',
      email: 'kochi@growingfit.in',
      hours: 'Mon – Sat: 6:00 AM – 8:00 PM | Sun: 7:00 AM – 12:00 PM',
      sports: ['Badminton', 'Football', 'Swimming', 'Martial Arts', 'Cricket'],
    },
    {
      name: 'Growing Fit — Thrissur Training Academy',
      address: 'Civil Lines Road, West Fort, Thrissur, Kerala 680004',
      phone: '+91 702 581 0724',
      email: 'thrissur@growingfit.in',
      hours: 'Mon – Sat: 6:00 AM – 7:00 PM',
      sports: ['Roller Skating', 'Badminton', 'Football', 'Fitness'],
    },
  ];

  const displayCentres =
    data.centres && data.centres.length > 0
      ? data.centres.map((c) => ({
          name: c.name,
          address: c.address || 'Kerala, India',
          phone: c.phone || data.contact?.phone || '+91 702 581 0722',
          email: c.email || data.contact?.email || 'admissions@growingfit.in',
          hours: c.opening_hours || data.contact?.opening_hours || 'Mon – Sat: 6:00 AM – 7:30 PM',
          sports: ['Badminton', 'Football', 'Roller Skating', 'Martial Arts'],
        }))
      : defaultCentres;

  return (
    <>
      <Header />

      <main className="flex-grow bg-white">
        {/* Breadcrumb Navigation & Header Hero */}
        <div className="bg-[#FAFAFC] border-b border-[#E8E8EC] py-10 sm:py-14">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#667085] mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E11D2A] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#172033] font-bold">Facilities &amp; Centres</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  OUR TRAINING INFRASTRUCTURE
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172033] tracking-tight leading-tight">
                World-Class Arenas Built For <br className="hidden sm:inline" />
                <span className="text-[#E11D2A]">Safety &amp; Athletic Excellence</span>
              </h1>
              <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                Explore our purpose-built training grounds engineered to provide young athletes with optimal shock absorption, precision lighting, and international standard sports surfaces.
              </p>
            </div>
          </div>
        </div>

        {/* Arenas Feature Grid */}
        <section className="py-12 sm:py-16 border-b border-[#E8E8EC]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-2 mb-10 text-left">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  TRAINING ARENAS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033]">
                Specialized Sports Infrastructure
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {arenas.map((arena, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E8E8EC] bg-[#FAFAFC] hover:bg-white hover:border-[#E11D2A]/30 hover:shadow-md transition-all duration-300 p-6 space-y-4"
                >
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFF1F2] border border-[#FFE4E6] text-[#E11D2A] uppercase tracking-wider">
                    {arena.subtitle}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#172033]">{arena.title}</h3>
                    <p className="text-xs sm:text-sm text-[#667085] mt-1.5 leading-relaxed">
                      {arena.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E8E8EC]">
                    {arena.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-[#172033] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D2A] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Training Centres Directory */}
        <section id="centres-list" className="py-12 sm:py-16 bg-[#FAFAFC] border-b border-[#E8E8EC]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-2 mb-10 text-left">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  LOCATE US
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033]">
                Our Training Centres
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                Conveniently located training hubs with dedicated parking, waiting lounges for parents, and certified equipment desks.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {displayCentres.map((centre, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#E8E8EC] bg-white p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A]">
                      <Building className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#172033]">{centre.name}</h3>
                      <div className="flex items-start gap-2.5 mt-2 text-xs text-[#667085]">
                        <MapPin className="w-4 h-4 text-[#E11D2A] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{centre.address}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#F2F4F7] text-xs text-[#667085]">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-[#E11D2A]" />
                        <a href={`tel:${centre.phone.replace(/\s+/g, '')}`} className="font-semibold text-[#172033] hover:text-[#E11D2A]">
                          {centre.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-[#E11D2A]" />
                        <span>{centre.hours}</span>
                      </div>
                    </div>

                    {/* Sports pills */}
                    <div className="pt-2">
                      <h4 className="text-[11px] font-bold text-[#172033] uppercase tracking-wider mb-2">Available Sports:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {centre.sports.map((sp, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-semibold bg-[#FAFAFC] border border-[#E8E8EC] text-[#172033] px-2.5 py-0.5 rounded-full"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/contact?centre=${encodeURIComponent(centre.name)}`}
                    className="w-full text-center bg-[#E11D2A] hover:bg-[#C9141F] text-white text-xs font-bold py-3 px-4 rounded-full shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Schedule Centre Visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety & Protocol Banner */}
        <section className="py-12 sm:py-16 bg-[#172033] text-white">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#E11D2A] mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              Safety, Cleanliness &amp; Medical Readiness
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Every facility adheres strictly to automated sanitization schedules, professional first-aid emergency stations, certified coaching supervision, and full CCTV monitoring.
            </p>
            <div className="pt-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-full shadow-md transition-all"
              >
                <span>Book a Guided Facility Tour</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer
        footerSettings={data.footer}
        contactSettings={data.contact}
        centres={data.centres}
        socialLinks={data.socialLinks}
      />
    </>
  );
}
