import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactClientContent } from '@/components/contact/ContactClientContent';
import { getCentresAction, getContactAction } from '@/lib/actions/cms';

export const revalidate = 0;

export default async function ContactPage() {
  const [centres, contactData] = await Promise.all([
    getCentresAction(),
    getContactAction(),
  ]);

  return (
    <>
      <Header />

      <main className="flex-grow bg-white">
        {/* Breadcrumb Navigation & Hero Header */}
        <div className="bg-[#FAFAFC] border-b border-[#E8E8EC] py-10 sm:py-14">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#667085] mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#172033] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#172033] font-bold">Contact &amp; Centres</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#172033] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#172033] uppercase">
                  ADMISSIONS &amp; TRAINING CENTRES
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172033] tracking-tight leading-tight">
                Connect With Our <br className="hidden sm:inline" />
                Admissions &amp; Training Centres
              </h1>
              <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                Schedule a complimentary evaluation session, explore batch timings, or locate our multi-sport training centres across Kerala.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Contact & Centres Interactive Content */}
        <ContactClientContent
          initialCentres={centres}
          contactInfo={contactData?.contact}
          socials={contactData?.socials}
        />
      </main>

      <Footer />
    </>
  );
}
