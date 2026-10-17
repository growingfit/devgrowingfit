import { getHomePageData } from '@/lib/queries/public';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VisionSection } from '@/components/home/VisionSection';

export const dynamic = 'force-dynamic';

export default async function VisionPage() {
  const data = await getHomePageData();

  return (
    <>
      <Header headerSettings={data.headerSettings} />
      <main className="flex-grow min-h-[70vh] py-12">
        <VisionSection data={data.vision} />
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
