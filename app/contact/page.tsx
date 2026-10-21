import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactClientContent } from '@/components/contact/ContactClientContent';
import { getCentresAction, getContactAction } from '@/lib/actions/cms';
import { getHomePageData } from '@/lib/queries/public';

export const revalidate = 0;

export const metadata = {
  title: 'Contact Us — Growing Fit Sports Academy',
  description:
    'Get in touch with Growing Fit Sports Academy. Reach out via phone, email, or send us a message directly.',
};

export default async function ContactPage() {
  const [centres, contactData, homeData] = await Promise.all([
    getCentresAction(),
    getContactAction(),
    getHomePageData(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172033] font-sans">
      <Header headerSettings={homeData.headerSettings} />

      <main className="flex-grow bg-[#FAFAFC] pt-6 sm:pt-8 pb-16 sm:pb-24">
        {/* Breadcrumb Navigation */}
        <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold" aria-label="Breadcrumb">
            <Link href="/" className="text-[#667085] hover:text-[#172033] transition-colors">
              Home
            </Link>
            <span className="text-[#172033] px-1 font-bold">/</span>
            <span className="text-[#172033] font-bold">Contact Us</span>
          </nav>
        </div>

        {/* Contact Split Card & Interactive Content */}
        <ContactClientContent
          initialCentres={centres}
          contactInfo={contactData?.contact}
          socials={contactData?.socials}
        />
      </main>

      <Footer
        footerSettings={homeData.footer}
        contactSettings={homeData.contact}
        centres={homeData.centres}
        socialLinks={homeData.socialLinks}
      />
    </div>
  );
}
