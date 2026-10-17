import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getHomePageData } from '@/lib/queries/public';

export const metadata = {
  title: 'Terms & Conditions — Growing Fit Academy',
  description: 'Terms and conditions governing enrolment, attendance, safety, and training at Growing Fit Academy.',
};

export default async function TermsConditionsPage() {
  const data = await getHomePageData();

  return (
    <>
      <Header />

      <main className="flex-grow bg-white">
        {/* Breadcrumb Navigation & Hero Header */}
        <div className="bg-[#FAFAFC] border-b border-[#E8E8EC] py-10 sm:py-14">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#667085] mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#172033] font-bold">Terms &amp; Conditions</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#172033] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#172033] uppercase">
                  ACADEMY REGULATIONS
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172033] tracking-tight leading-tight">
                Terms &amp; <span className="text-[#172033]">Conditions</span>
              </h1>
              <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                Guidelines governing student admission, attendance, conduct, and safety across all Growing Fit sports centres.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="space-y-8 text-sm sm:text-base text-[#667085] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">1. Enrolment &amp; Admission</h2>
              <p>
                Admission to any academy program is confirmed upon receipt of completed registration forms, guardian authorization, and payment of the applicable batch fees. All participants must disclose known physical or medical conditions prior to their first active training session.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">2. Code of Conduct &amp; Discipline</h2>
              <p>
                We maintain an inclusive, disciplined, and supportive environment for all participants. Bullying, unsportsmanlike conduct, or unsafe behavior on or off the training ground will result in an immediate review by the coaching board.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">3. Safety Equipment &amp; Attire</h2>
              <p>
                Students must wear the authorized academy jersey and sport-appropriate protective equipment (such as helmets and knee guards for roller skating, or protective padding for kumite sparring). Failure to wear required safety gear may result in exclusion from that training drill.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">4. Batch Attendance &amp; Make-Up Classes</h2>
              <p>
                Students are requested to arrive 10 minutes prior to their scheduled batch slot. In cases of illness or school exam conflicts, make-up sessions can be coordinated with the centre coordinator subject to batch capacity.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">5. Queries &amp; Support</h2>
              <p>
                For questions regarding terms, fees, or centre rules, reach our coordinator desk at{' '}
                <a href="tel:+917025810722" className="text-[#172033] font-bold underline hover:text-black">
                  +91 702 581 0722
                </a>{' '}
                or email growingfitofficial@gmail.com.
              </p>
            </section>
          </div>
        </div>
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
