import { getHomePageData } from '@/lib/queries/public';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { SportsCategoriesSection } from '@/components/home/SportsCategoriesSection';
import { SchoolSection } from '@/components/home/SchoolSection';
import { AcademySection } from '@/components/home/AcademySection';
import { CorporateSection } from '@/components/home/CorporateSection';
import { Footer } from '@/components/layout/Footer';
// Force dynamic rendering so newly uploaded CMS assets appear immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
      {/* 1. Header and navigation matching reference */}
      <Header headerSettings={data.headerSettings} />

      <main className="flex-grow">
        {/* 2. Full-width sports hero banner */}
        {data.hero?.is_visible !== false && (
          <HeroSection data={data.hero} />
        )}

        {/* 3. Sports categories horizontal carousel (Current category sliding section untouched) */}
        <SportsCategoriesSection categories={data.categories} />

        {/* 4. For Schools section */}
        <SchoolSection data={data.schoolsSection} />

        {/* 5. For Academy section with sports thumbnails */}
        <AcademySection data={data.academySection} />

        {/* 6. For Corporates & Community section with activity thumbnails */}
        <CorporateSection data={data.corporateSection} />
      </main>

      {/* 7. Dark full-width footer matching reference */}
      <Footer
        footerSettings={data.footer}
        contactSettings={data.contact}
        centres={data.centres}
        socialLinks={data.socialLinks}
      />
    </>
  );
}
