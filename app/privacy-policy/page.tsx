import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getHomePageData } from '@/lib/queries/public';

export const metadata = {
  title: 'Privacy Policy — Growing Fit Academy',
  description: 'Privacy policy and data protection commitments for Growing Fit School of Health & Physical Education.',
};

export default async function PrivacyPolicyPage() {
  const data = await getHomePageData();

  return (
    <>
      <Header />

      <main className="flex-grow bg-white">
        {/* Breadcrumb Navigation & Hero Header */}
        <div className="bg-[#FAFAFC] border-b border-[#E8E8EC] py-10 sm:py-14">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#667085] mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E11D2A] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#172033] font-bold">Privacy Policy</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  LEGAL &amp; COMPLIANCE
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172033] tracking-tight leading-tight">
                Privacy <span className="text-[#E11D2A]">Policy</span>
              </h1>
              <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                Last updated: October 2024. How we safeguard and protect your personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="space-y-8 text-sm sm:text-base text-[#667085] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">1. Commitment to Student &amp; Parent Privacy</h2>
              <p>
                At Growing Fit — School of Health &amp; Physical Education, we respect your privacy and are committed to protecting the personal information collected from students, parents, and visitors to our academies and website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">2. Information We Collect</h2>
              <p>
                We collect personal information directly provided through our admission enquiry forms, registration desks, and website contacts. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm text-[#172033]">
                <li>Student&apos;s full name, date of birth, age, and medical fitness disclosures.</li>
                <li>Parent/guardian name, residential address, telephone number, and email.</li>
                <li>Emergency contact information and authorized pickup details.</li>
                <li>Batch attendance logs, physical fitness benchmarking, and athletic progress reports.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">3. How We Use Collected Information</h2>
              <p>
                Information collected is strictly utilized to communicate batch schedules, safety updates, emergency alerts, tournament fixtures, and fee payment receipts. We do not sell, rent, or lease personal contact details to any third-party marketing companies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">4. Photography &amp; Academy Media</h2>
              <p>
                From time to time, academy photographers capture training drills, sparring exhibitions, and tournament ceremonies for educational progress analysis and website gallery showcases. Parents may opt out of media publishing at any time by notifying the centre coordinator in writing.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#172033]">5. Contact Us Regarding Your Data</h2>
              <p>
                For any questions or data update requests regarding our privacy policy, please contact our administrative desk at{' '}
                <a href="mailto:growingfitofficial@gmail.com" className="text-[#E11D2A] font-bold underline">
                  growingfitofficial@gmail.com
                </a>{' '}
                or call +91 702 581 0722.
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
