import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getHomePageData } from '@/lib/queries/public';
import { getSportIconUrl, DEFAULT_REFERENCE_SPORTS } from '@/lib/sports';
import {
  ArrowRight,
  Clock,
  Users,
  ShieldCheck,
  Trophy,
  Calendar,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Our Sports Programs — Growing Fit Academy',
  description:
    'Explore badminton, football, roller skating, martial arts, cricket, athletics, swimming, and fitness programs for kids and youth in Kerala.',
};

interface ProgramItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  ageGroup: string;
  batchSize: string;
  schedule: string;
  description: string;
  highlights: string[];
}

export const ALL_PROGRAMS: ProgramItem[] = [
  {
    id: 'prog-badminton',
    name: 'Badminton Academy',
    slug: 'badminton',
    category: 'Badminton',
    ageGroup: 'Ages 5 – 16',
    batchSize: 'Max 8 Students per Coach',
    schedule: 'Morning & Evening Batches (Mon–Sat)',
    description:
      'Professional badminton training focusing on proper grip mechanics, explosive footwork, court coverage, wrist control, and smash power on international standard synthetic courts.',
    highlights: ['Synthetic indoor courts', 'Video analysis & stroke mechanics', 'District & state tournament prep'],
  },
  {
    id: 'prog-football',
    name: 'Grassroots Football Academy',
    slug: 'football',
    category: 'Football',
    ageGroup: 'Ages 4 – 16',
    batchSize: 'Max 10 Students per Coach',
    schedule: 'Weekday & Weekend Batches',
    description:
      'Structured football coaching designed to build close ball control, passing accuracy, tactical positioning, stamina, and team communication on high-grade FIFA-certified artificial turf.',
    highlights: ['Small-sided match simulations', 'Agility & speed conditioning', 'Academy league match fixtures'],
  },
  {
    id: 'prog-skating',
    name: 'Roller Skating Academy',
    slug: 'roller-skating',
    category: 'Roller Skating',
    ageGroup: 'Ages 4 – 15',
    batchSize: 'Max 8 Students per Coach',
    schedule: 'Daily Morning & Evening Batches',
    description:
      'Comprehensive roller skating curriculum from foundational stride and balance control to high-speed banked track mechanics, slalom, and artistic rhythm skating.',
    highlights: ['Banked professional skating rink', 'Certified safety helmets & knee padding', 'Speed skating championship pathway'],
  },
  {
    id: 'prog-martial-arts',
    name: 'Martial Arts & Karate',
    slug: 'martial-arts',
    category: 'Martial Arts',
    ageGroup: 'Ages 4 – 16',
    batchSize: 'Max 10 Students per Coach',
    schedule: 'Mon / Wed / Fri & Sat Batches',
    description:
      'Traditional Karate and Kung Fu instruction emphasizing self-discipline, mental concentration, Kata forms, self-defense reaction, and safe Kumite sparring.',
    highlights: ['Certified belt ranking examinations', 'Padded training dojos', 'Anti-bullying & situational awareness'],
  },
  {
    id: 'prog-cricket',
    name: 'Junior Cricket Academy',
    slug: 'cricket',
    category: 'Cricket',
    ageGroup: 'Ages 6 – 16',
    batchSize: 'Max 10 Students per Coach',
    schedule: 'Morning & Evening Batches',
    description:
      'Specialized cricket training covering batting stance, backlift, spin/pace bowling techniques, wicketkeeping drills, and high-pressure match scenarios in turf nets.',
    highlights: ['Astro-turf bowling nets', 'Bowling machine sessions', 'Regular friendly tournament matches'],
  },
  {
    id: 'prog-swimming',
    name: 'Swimming & Water Confidence',
    slug: 'swimming',
    category: 'Swimming',
    ageGroup: 'Ages 4 – 16',
    batchSize: 'Max 6 Students per Coach',
    schedule: 'Morning & Evening Batches',
    description:
      'Water safety, stroke perfection (freestyle, backstroke, breaststroke, butterfly), breathing rhythm, and endurance building in clean, temperature-managed pools.',
    highlights: ['Strict lifeguard supervision', 'Clean, treated water standards', 'Competitive swimming stroke correction'],
  },
  {
    id: 'prog-athletics',
    name: 'Athletics & Track Speed',
    slug: 'athletics',
    category: 'Athletics',
    ageGroup: 'Ages 6 – 16',
    batchSize: 'Max 10 Students per Coach',
    schedule: 'Morning Batches (6:00 AM – 8:00 AM)',
    description:
      'Track and field coaching targeting running posture, sprinting cadence, hurdle clearance, long jump takeoff, and overall cardiovascular stamina.',
    highlights: ['Running form biomechanics', 'Sprint & interval conditioning', 'School sports meet excellence preparation'],
  },
  {
    id: 'prog-fitness',
    name: 'Physical Fitness & Agility',
    slug: 'fitness',
    category: 'Fitness',
    ageGroup: 'Ages 4 – 16',
    batchSize: 'Max 8 Students per Coach',
    schedule: 'Flexible Morning & Evening Slots',
    description:
      'General athletic conditioning, motor skill coordination, flexibility routines, posture correction, and fun fitness games designed to build foundational health.',
    highlights: ['Functional movement training', 'Posture & core stability', 'BMI & physical fitness benchmarking'],
  },
];

export default async function ProgramsPage() {
  const data = await getHomePageData();

  const faqs = [
    {
      q: 'At what age can my child start training?',
      a: 'We welcome young champions starting from age 4. Our early-starter batches focus on balance, motor coordination, and fun sports play before advancing to technical drills.',
    },
    {
      q: 'Do you offer trial sessions before enrolling?',
      a: 'Yes! We encourage every parent and student to attend a complimentary trial session. Our head coach will assess your child’s athletic interests and recommend the right batch level.',
    },
    {
      q: 'What equipment does my child need to bring?',
      a: 'Students only need standard comfortable athletic wear and sport shoes. Academy uniforms and sport-specific safety kits (helmets, pads, belts) can be acquired during enrollment.',
    },
    {
      q: 'Can a student enroll in more than one sport?',
      a: 'Absolutely! Many of our students cross-train in two sports (for example, Skating on weekdays and Swimming or Football on weekends) for well-rounded physical development.',
    },
  ];

  return (
    <>
      <Header />

      <main className="flex-grow bg-white">
        {/* Breadcrumb & Header Hero */}
        <div className="bg-[#FAFAFC] border-b border-[#E8E8EC] py-10 sm:py-14">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#667085] mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E11D2A] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#172033] font-bold">Programs</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  OUR ACADEMY PROGRAMS
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172033] tracking-tight leading-tight">
                Specialized Sports Coaching for <br className="hidden sm:inline" />
                <span className="text-[#E11D2A]">Every Age &amp; Skill Level</span>
              </h1>
              <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                Discover our comprehensive array of junior athletic curriculums designed to build athletic mastery, discipline, and competitive confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <section className="py-12 sm:py-16 border-b border-[#E8E8EC]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ALL_PROGRAMS.map((program) => (
                <div
                  key={program.id}
                  className="rounded-2xl border border-[#E8E8EC] bg-white p-6 shadow-2xs hover:shadow-lg hover:border-[#E11D2A]/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Age Pill */}
                    <div className="flex items-center justify-between">
                      <div className="w-13 h-13 rounded-2xl bg-[#FAFAFC] border border-[#F2F4F7] group-hover:bg-[#FFF1F2] group-hover:border-[#FFE4E6] flex items-center justify-center transition-colors">
                        <img
                          src={getSportIconUrl(program.slug, program.slug)}
                          alt={program.name}
                          className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAFAFC] border border-[#E8E8EC] text-[#172033]">
                        {program.ageGroup}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold text-[#172033] group-hover:text-[#E11D2A] transition-colors">
                        {program.name}
                      </h3>
                      <p className="text-xs text-[#667085] mt-1 line-clamp-3 leading-relaxed">
                        {program.description}
                      </p>
                    </div>

                    {/* Features / Highlights */}
                    <div className="space-y-1.5 pt-1 border-t border-[#F2F4F7]">
                      {program.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-[#667085]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D2A] shrink-0" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Batch info */}
                    <div className="pt-2 flex items-center gap-2 text-[11px] text-[#172033] font-semibold bg-[#FAFAFC] px-3 py-2 rounded-xl">
                      <Users className="w-3.5 h-3.5 text-[#E11D2A] shrink-0" />
                      <span>{program.batchSize}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-5 border-t border-[#E8E8EC] flex items-center gap-2.5">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="flex-1 text-center bg-white hover:bg-slate-50 text-[#172033] border border-[#E8E8EC] hover:border-[#172033] text-xs font-bold py-2.5 px-3 rounded-full transition-all"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/contact?program=${program.slug}`}
                      className="flex-1 text-center bg-[#E11D2A] hover:bg-[#C9141F] text-white text-xs font-bold py-2.5 px-3 rounded-full shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1"
                    >
                      <span>Enquire</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4-Stage Development Roadmap */}
        <section className="py-12 sm:py-16 bg-[#FAFAFC] border-b border-[#E8E8EC]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-black tracking-widest text-[#E11D2A] uppercase">
                TRAINING METHODOLOGY
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033]">
                The Growing Fit Progression Pathway
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                How we take young athletes from their first session to confident tournament performers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Fundamental Movement',
                  desc: 'Focus on balance, hand-eye coordination, spatial awareness, and enthusiasm for the sport.',
                },
                {
                  step: '02',
                  title: 'Technical Mechanics',
                  desc: 'Structured drills teaching proper stance, footwork, stroke precision, and energy conservation.',
                },
                {
                  step: '03',
                  title: 'Tactical Game Play',
                  desc: 'Match simulations, positional awareness, speed-reaction routines, and team communication.',
                },
                {
                  step: '04',
                  title: 'Championship Mastery',
                  desc: 'Tournament coaching, mental toughness under pressure, video review, and competitive excellence.',
                },
              ].map((stage, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E8E8EC] bg-white p-6 shadow-2xs space-y-3 relative overflow-hidden"
                >
                  <span className="text-3xl font-black text-[#E11D2A]/20">{stage.step}</span>
                  <h3 className="text-base font-bold text-[#172033]">{stage.title}</h3>
                  <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 sm:py-16 border-b border-[#E8E8EC]">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-black tracking-widest text-[#E11D2A] uppercase">
                COMMON QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-[#E8E8EC] bg-[#FAFAFC] p-5 sm:p-6 space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-[#172033] flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-[#E11D2A] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#667085] leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 sm:py-16 bg-[#172033] text-white">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Uncertain Which Sport Suits Your Child?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Speak with our senior admission coaches for a personalized athletic assessment and trial batch allocation.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-full shadow-md transition-all"
              >
                <span>Book Free Assessment Session</span>
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
