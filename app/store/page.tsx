import { getHomePageData } from '@/lib/queries/public';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  const data = await getHomePageData();

  return (
    <>
      <Header headerSettings={data.headerSettings} />
      <main className="flex-grow min-h-[70vh] bg-[#F4F4F6] py-16 sm:py-24">
        <div className="w-full max-w-[1200px] mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-6 text-[#8A1820]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#172033] tracking-tight mb-4">
            Growing Fit Store
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto mb-8">
            Official sports gear, martial arts uniforms, football kits, and athletic equipment for Growing Fit students.
          </p>
          <div className="inline-block p-6 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md">
            <h3 className="text-base font-bold text-[#172033] mb-2">Academy Gear &amp; Merchandise</h3>
            <p className="text-xs text-slate-500 mb-6">
              Official academy kits, jerseys, protective gear, and training equipment can be ordered through our centres or directly via enquiry.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8A1820] hover:bg-[#6F1218] text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Contact Store Coordinator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
