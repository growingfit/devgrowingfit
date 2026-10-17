import { getHomePageData } from '@/lib/queries/public';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AcademySection } from '@/components/home/AcademySection';
import { SportsCategoriesSection } from '@/components/home/SportsCategoriesSection';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AcademyPage() {
  const data = await getHomePageData();

  return (
    <>
      <Header headerSettings={data.headerSettings} />
      <main className="flex-grow min-h-[70vh]">
        <div className="bg-[#172033] text-white py-12 sm:py-16 text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-3">
            Sports Academies
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Professional sports training, world-class coaching, and athletic development for children and youths.
          </p>
        </div>
        <AcademySection data={data.academySection} />
        <div className="py-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#172033]">Explore Academy Programs</h2>
            <p className="text-xs sm:text-sm text-slate-500">Discover all active training disciplines</p>
          </div>
          <SportsCategoriesSection categories={data.categories} />
        </div>
        <div className="w-full max-w-[1440px] mx-auto px-6 py-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#8A1820] hover:bg-[#6F1218] text-white text-sm font-semibold transition-all shadow-sm"
          >
            Register for Academy Trial
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
