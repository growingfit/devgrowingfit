import { getHomePageData } from '@/lib/queries/public';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CorporateSection } from '@/components/home/CorporateSection';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CorporatePage() {
  const data = await getHomePageData();

  return (
    <>
      <Header headerSettings={data.headerSettings} />
      <main className="flex-grow min-h-[70vh]">
        <div className="bg-[#172033] text-white py-12 sm:py-16 text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-3">
            Corporate &amp; Community Sports
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Team-building activities, sports tournaments, corporate wellness packages, and community fitness hubs.
          </p>
        </div>
        <CorporateSection data={data.corporateSection} />
        <div className="w-full max-w-[1440px] mx-auto px-6 py-12 text-center bg-white border-t border-[#E8E8EC]">
          <h3 className="text-xl font-bold text-[#172033] mb-4">Book a Corporate Sports Day</h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
            Energize your workplace with custom sports tournaments, fitness bootcamps, and team engagement events.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#8A1820] hover:bg-[#6F1218] text-white text-sm font-semibold transition-all shadow-sm"
          >
            Enquire for Corporate Packages
          </Link>
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
