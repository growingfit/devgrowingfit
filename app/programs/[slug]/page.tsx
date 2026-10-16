import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getHomePageData } from '@/lib/queries/public';
import { getSportIconUrl } from '@/lib/sports';
import { ALL_PROGRAMS } from '@/app/programs/page';
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  Shield,
  Trophy,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ProgramDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return ALL_PROGRAMS.map((prog) => ({
    slug: prog.slug,
  }));
}

export async function generateMetadata({ params }: ProgramDetailPageProps) {
  const program = ALL_PROGRAMS.find((p) => p.slug.toLowerCase() === params.slug.toLowerCase());
  if (!program) {
    return { title: 'Program — Growing Fit Academy' };
  }
  return {
    title: `${program.name} — Growing Fit Academy`,
    description: program.description,
  };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const program = ALL_PROGRAMS.find((p) => p.slug.toLowerCase() === params.slug.toLowerCase());

  if (!program) {
    // If not in hardcoded reference list, check if it exists in other standard sports or notFound
    notFound();
  }

  const data = await getHomePageData();

  const curriculumLevels = [
    {
      level: 'Level 1',
      title: 'Foundations & Body Mechanics',
      description:
        'Fundamental stance, grip, hand-eye coordination, balance drills, and safety rules of the sport.',
      skills: ['Proper posture & stance', 'Basic equipment handling', 'Court/ground spatial awareness', 'Dynamic stretching routines'],
    },
    {
      level: 'Level 2',
      title: 'Technical Mastery & Footwork',
      description:
        'Focused stroke/kick/stride mechanics, explosive directional agility, and energy-conserving movement patterns.',
      skills: ['Precision drill execution', 'High-speed footwork & turns', 'Power generation mechanics', 'Defensive reaction time'],
    },
    {
      level: 'Level 3',
      title: 'Tactical Play & Match Scenarios',
      description:
        'Transitioning technical skills into active match situations, pressure resistance, and situational tactical awareness.',
      skills: ['Match sparring simulations', 'Opponent analysis & anticipation', 'Team communication / doubles play', 'Mental focus routines'],
    },
    {
      level: 'Level 4',
      title: 'Tournament Excellence & Belt/Badge Ranking',
      description:
        'Advanced competitive conditioning, tournament strategy, performance analysis, and district/state preparation.',
      skills: ['Official tournament rules mastery', 'Under-pressure shot making', 'Comprehensive physical benchmarking', 'Medal pathway coaching'],
    },
  ];

  const gearChecklist = [
    { name: 'Academy Official Jersey', status: 'Provided upon Enrollment' },
    { name: 'Standard Athletic Sport Shoes', status: 'Student to Bring' },
    { name: 'Safety Protective Gear (Helmets/Pads)', status: 'Provided by Academy' },
    { name: 'Hydration Bottle & Sweat Towel', status: 'Student to Bring' },
  ];

  const otherPrograms = ALL_PROGRAMS.filter((p) => p.slug !== program.slug).slice(0, 4);

  return (
    <>
      <Header />

      <main className="flex-grow bg-white">
        {/* Breadcrumb Navigation & Hero Banner */}
        <div className="bg-[#FAFAFC] border-b border-[#E8E8EC] py-10 sm:py-14">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#667085] mb-5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E11D2A] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/programs" className="hover:text-[#E11D2A] transition-colors">Programs</Link>
              <span>/</span>
              <span className="text-[#172033] font-bold">{program.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center">
                    <img
                      src={getSportIconUrl(program.slug, program.slug)}
                      alt={program.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E11D2A] text-white uppercase tracking-wider">
                    {program.category}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172033] tracking-tight leading-tight">
                  {program.name}
                </h1>
                <p className="text-sm sm:text-base text-[#667085] leading-relaxed max-w-2xl">
                  {program.description}
                </p>

                {/* Quick Spec Pills */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 bg-white border border-[#E8E8EC] px-3.5 py-2 rounded-xl text-xs font-bold text-[#172033]">
                    <Users className="w-4 h-4 text-[#E11D2A]" />
                    <span>{program.batchSize}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-[#E8E8EC] px-3.5 py-2 rounded-xl text-xs font-bold text-[#172033]">
                    <Clock className="w-4 h-4 text-[#E11D2A]" />
                    <span>{program.ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-[#E8E8EC] px-3.5 py-2 rounded-xl text-xs font-bold text-[#172033]">
                    <Calendar className="w-4 h-4 text-[#E11D2A]" />
                    <span>{program.schedule}</span>
                  </div>
                </div>
              </div>

              {/* Direct Admission Card */}
              <div className="lg:col-span-4 bg-white border border-[#E8E8EC] rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#172033]">Start Your Child&apos;s Training</h3>
                <p className="text-xs text-[#667085]">
                  Join our upcoming batch or book a free trial evaluation session with our head coaches.
                </p>
                <div className="space-y-2 pt-2">
                  <Link
                    href={`/contact?program=${program.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-full shadow-sm hover:shadow transition-all"
                  >
                    <span>Enquire For This Program</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="tel:+917025810722"
                    className="w-full flex items-center justify-center gap-2 bg-[#FAFAFC] hover:bg-slate-100 text-[#172033] border border-[#E8E8EC] text-xs font-bold py-3 px-4 rounded-full transition-all"
                  >
                    <span>Call Admission Desk (+91 702 581 0722)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Module Curriculum Breakdown */}
        <section className="py-12 sm:py-16 border-b border-[#E8E8EC]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-2 mb-10 text-left">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  TRAINING CURRICULUM
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033]">
                Structured Progressive Modules
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                Every athlete progresses through certified milestones designed to encourage steady, confidence-building advancement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {curriculumLevels.map((mod, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E8E8EC] bg-[#FAFAFC] p-6 hover:bg-white hover:border-[#E11D2A]/30 hover:shadow-md transition-all duration-300 space-y-4"
                >
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFF1F2] border border-[#FFE4E6] text-[#E11D2A] uppercase tracking-wider">
                    {mod.level}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#172033]">{mod.title}</h3>
                    <p className="text-xs text-[#667085] mt-1 leading-relaxed">{mod.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E8E8EC]">
                    {mod.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-[#172033]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D2A] shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipment & Safety Guidelines */}
        <section className="py-12 sm:py-16 bg-[#FAFAFC] border-b border-[#E8E8EC]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                  <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                    SAFETY &amp; EQUIPMENT
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033]">
                  What You Need For The First Session
                </h2>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                  We prioritize student safety above all else. All training arenas are equipped with certified impact-reduction surfaces, medical first-aid stations, and age-calibrated gear.
                </p>

                <div className="space-y-3 pt-2">
                  {gearChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E8E8EC] text-xs sm:text-sm"
                    >
                      <span className="font-bold text-[#172033]">{item.name}</span>
                      <span className="text-xs font-semibold text-[#E11D2A] bg-[#FFF1F2] px-2.5 py-0.5 rounded-full border border-[#FFE4E6]">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-3xl border border-[#E8E8EC] bg-white p-8 space-y-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A]">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#172033]">
                    Our 100% Safety &amp; Hygiene Commitment
                  </h3>
                  <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                    All Growing Fit coaches maintain CPR and First-Aid sports safety certifications. In addition, student-to-coach ratios never exceed {program.batchSize.toLowerCase()} to guarantee vigilant oversight at every moment.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/facilities"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E11D2A] hover:underline"
                    >
                      <span>Learn more about our training facilities &amp; centres</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Other Programs Navigation */}
        <section className="py-12 sm:py-16 border-b border-[#E8E8EC]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-black tracking-widest text-[#E11D2A] uppercase">
                  CROSS-TRAINING OPPORTUNITIES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033]">
                  Explore Related Programs
                </h2>
              </div>
              <Link
                href="/programs"
                className="text-xs sm:text-sm font-bold text-[#E11D2A] hover:underline flex items-center gap-1"
              >
                <span>View All 8 Programs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherPrograms.map((p) => (
                <Link
                  key={p.id}
                  href={`/programs/${p.slug}`}
                  className="rounded-2xl border border-[#E8E8EC] bg-white p-5 hover:border-[#E11D2A]/30 hover:shadow-md transition-all group block"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAFAFC] border border-[#F2F4F7] flex items-center justify-center mb-3">
                    <img
                      src={getSportIconUrl(p.slug, p.slug)}
                      alt={p.name}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#E11D2A] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-[#667085] mt-1 line-clamp-2">{p.description}</p>
                </Link>
              ))}
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
