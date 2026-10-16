import { getHomePageData } from '@/lib/queries/public';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { SportsCategoriesSection } from '@/components/home/SportsCategoriesSection';
import { AboutSection } from '@/components/home/AboutSection';
import { VisionSection } from '@/components/home/VisionSection';
import { StatisticsSection } from '@/components/home/StatisticsSection';
import { GallerySection } from '@/components/home/GallerySection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/layout/Footer';

import fs from 'fs';
import path from 'path';

// Force dynamic rendering so newly uploaded CMS assets & gallery photos appear immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function syncHeroAsset() {
  try {
    const destDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const bannerDest = path.join(destDir, 'hero-martial-arts.png');
    const bannerSrc = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\b9aea763-2b83-4443-ac46-d47a11ce2de6\\.user_uploaded\\media_1791871182019.png';
    if (fs.existsSync(bannerSrc)) {
      fs.copyFileSync(bannerSrc, bannerDest);
    }

    const iconDest = path.join(destDir, 'physical-fitness-icon.png');
    const iconSrc = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\b9aea763-2b83-4443-ac46-d47a11ce2de6\\.user_uploaded\\media_1791872171806.png';
    if (fs.existsSync(iconSrc)) {
      fs.copyFileSync(iconSrc, iconDest);
    }

    // Mirror growfit logo into public/brand
    const logoSrc = path.join(process.cwd(), 'public', 'growfit logo.png');
    const brandDir = path.join(process.cwd(), 'public', 'brand');
    if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });
    if (fs.existsSync(logoSrc)) {
      fs.copyFileSync(logoSrc, path.join(brandDir, 'logo.png'));
      fs.copyFileSync(logoSrc, path.join(brandDir, 'growfit-logo.png'));
    }


    // Mirror vision section karate girl background
    const visionDest = path.join(destDir, 'vision-karate-girl.png');
    const visionSrc = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\340e3889-dd7c-4a01-8e6e-e5a81284c237\\.user_uploaded\\media_1791968405862.png';
    if (fs.existsSync(visionSrc)) {
      fs.copyFileSync(visionSrc, visionDest);
    }

    // Mirror CTA section skating coach banner
    const ctaDest = path.join(destDir, 'cta-skating-banner.png');
    const ctaSrc = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\340e3889-dd7c-4a01-8e6e-e5a81284c237\\.user_uploaded\\media_1791963528916.png';
    if (fs.existsSync(ctaSrc)) {
      fs.copyFileSync(ctaSrc, ctaDest);
    }

    // Ensure generated gallery mockup files are removed
    const galleryFilesToRemove = [
      'gallery-showcase.png',
      'gallery-grid-full.png',
      'gallery-dims.json',
      'crop-debug.log',
      'gallery-item-1.png',
      'gallery-item-2.png',
      'gallery-item-3.png',
      'gallery-item-4.png',
      'gallery-item-5.png',
      'gallery-item-6.png',
      'gallery-item-7.png',
      'gallery-item-8.png',
    ];
    for (const f of galleryFilesToRemove) {
      const p = path.join(destDir, f);
      if (fs.existsSync(p)) {
        try { fs.unlinkSync(p); } catch {}
      }
    }
  } catch (err) {
    // Fail silently in read-only environments
  }
}

// Call on module load to sync assets immediately (v3)
syncHeroAsset();

export default async function HomePage() {
  syncHeroAsset();
  const data = await getHomePageData();

  return (
    <>
      <Header enquireUrl="#contact" />
      <main className="flex-grow">
        {/* 1. Hero Banner */}
        {data.hero?.is_visible !== false && (
          <HeroSection data={data.hero} benefits={data.heroBenefits} />
        )}

        {/* 2. Exact Minimal Category Treatment (Badminton, Football, Roller Skating) */}
        <SportsCategoriesSection categories={data.categories} />

        {/* 3. About Section */}
        {data.about?.is_visible !== false && (
          <AboutSection data={data.about} features={data.aboutFeatures} />
        )}

        {/* 4. Vision Section */}
        {data.vision?.is_visible !== false && (
          <VisionSection data={data.vision} />
        )}

        {/* 5. Statistics Section */}
        <StatisticsSection statistics={data.statistics} />

        {/* 6. Gallery ("Moments That Inspire") */}
        <GallerySection images={data.gallery} />

        {/* 7. Testimonials ("What Parents Say") */}
        <TestimonialsSection testimonials={data.testimonials} />

        {/* 8. Final CTA Banner */}
        <CTASection enquireUrl="#contact" />

        {/* 9. Contact & Admissions Section */}
        <ContactSection contactSettings={data.contact} />
      </main>

      {/* 10. Footer */}
      <Footer
        footerSettings={data.footer}
        contactSettings={data.contact}
        centres={data.centres}
        socialLinks={data.socialLinks}
      />
    </>
  );
}
