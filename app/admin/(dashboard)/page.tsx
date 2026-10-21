import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/server';
import {
  Trophy,
  Image as ImageIcon,
  MessageSquareQuote,
  MapPin,
  Sparkles,
  ArrowRight,
  Info,
  Eye,
  GraduationCap,
  Inbox,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  let categoriesCount = 4;
  let galleryCount = 4;
  let testimonialsCount = 1;
  let centresCount = 2;
  let enquiriesCount = 2;

  try {
    const fs = await import('fs');
    const path = await import('path');
    const tPath = path.join(process.cwd(), 'lib', 'data', 'testimonials.json');
    if (fs.existsSync(tPath)) {
      const raw = fs.readFileSync(tPath, 'utf-8');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) testimonialsCount = parsed.length;
      }
    }
    const ePath = path.join(process.cwd(), 'lib', 'data', 'enquiries.json');
    if (fs.existsSync(ePath)) {
      const raw = fs.readFileSync(ePath, 'utf-8');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) enquiriesCount = parsed.length;
      }
    }
  } catch {}

  try {
    const supabase = createClient();
    const [cRes, gRes, tRes, cnRes] = await Promise.all([
      supabase.from('sports_categories').select('*', { count: 'exact', head: true }),
      supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      supabase.from('centres').select('*', { count: 'exact', head: true }),
    ]);
    if (cRes.count !== null && cRes.count !== undefined) categoriesCount = cRes.count;
    if (gRes.count !== null && gRes.count !== undefined) galleryCount = gRes.count;
    if (tRes.count !== null && tRes.count !== undefined && tRes.count > 0) testimonialsCount = tRes.count;
    if (cnRes.count !== null && cnRes.count !== undefined) centresCount = cnRes.count;
  } catch (err) {
    console.error('Failed to query counts in admin overview:', err);
  }

  const stats = [
    { label: 'Customer Enquiries', count: enquiriesCount, href: '/admin/enquiries', icon: Inbox, color: 'text-[#67238A]' },
    { label: 'Active Categories', count: categoriesCount, href: '/admin/categories', icon: Trophy, color: 'text-amber-500' },
    { label: 'Gallery Moments', count: galleryCount, href: '/admin/gallery', icon: ImageIcon, color: 'text-emerald-500' },
    { label: 'Parent Testimonials', count: testimonialsCount, href: '/admin/testimonials', icon: MessageSquareQuote, color: 'text-purple-500' },
    { label: 'Training Centres', count: centresCount, href: '/admin/contact', icon: MapPin, color: 'text-slate-700' },
  ];

  return (
    <>
      <AdminHeader
        title="Admin CMS Overview"
        description="Manage Growing Fit public website content, media assets, and operations"
      />

      <main className="p-8 space-y-8">

        {/* Content Metrics */}
        <div>
          <h2 className="text-base font-bold text-[#172033] mb-4">Website Content Records</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="bg-white border border-[#E8E8EC] hover:border-[#67238A] p-5 rounded-2xl shadow-sm hover:shadow transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#67238A] transition-colors" />
                  </div>
                  <div className="text-2xl font-black text-[#172033]">{item.count}</div>
                  <div className="text-xs font-medium text-[#667085] mt-1">{item.label}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CMS Sections Quick Grid */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#172033] mb-4">CMS Management Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/admin/enquiries"
              className="p-4 rounded-xl border border-purple-200 bg-purple-50/20 hover:border-[#67238A] hover:bg-purple-50/40 transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <Inbox className="w-4 h-4 text-[#67238A]" />
                <span>Customer Enquiries</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                View, filter, and respond to incoming contact submissions and student registrations.
              </p>
            </Link>
            <Link
              href="/admin/about"
              className="p-4 rounded-xl border-2 border-[#E11D2A]/40 bg-red-50/20 hover:border-[#E11D2A] hover:bg-red-50/40 transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#E11D2A]" />
                <span>About Us</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                Manage About Us top hero banner, narrative story, karate girl illustration, and Our Mission &amp; Vision.
              </p>
            </Link>

            <Link
              href="/admin/school-page"
              className="p-4 rounded-xl border border-[#E8E8EC] hover:border-[#67238A] hover:bg-[#FAFAFC] transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#67238A]" />
                <span>School Page CMS</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                Manage school hero banner, Why Growing Fit, curriculum stages, and glimpses gallery.
              </p>
            </Link>

            <Link
              href="/admin/homepage-sections"
              className="p-4 rounded-xl border border-[#E8E8EC] hover:border-[#67238A] hover:bg-[#FAFAFC] transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#67238A]" />
                <span>Homepage Sections</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                Manage For Schools, For Academy, and For Corporates &amp; Community sections and photos.
              </p>
            </Link>

            <Link
              href="/admin/hero"
              className="p-4 rounded-xl border border-[#E8E8EC] hover:border-[#67238A] hover:bg-[#FAFAFC] transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#67238A]" />
                <span>Hero Banner</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                Headlines, highlighted text, CTA buttons, and hero photography slides.
              </p>
            </Link>

            <Link
              href="/admin/categories"
              className="p-4 rounded-xl border border-[#E8E8EC] hover:border-[#67238A] hover:bg-[#FAFAFC] transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#67238A]" />
                <span>Sports Categories</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                Manage the minimal athlete icon row: Badminton, Football, Roller Skating.
              </p>
            </Link>

            <Link
              href="/admin/gallery"
              className="p-4 rounded-xl border border-[#E8E8EC] hover:border-[#67238A] hover:bg-[#FAFAFC] transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#67238A]" />
                <span>Gallery &amp; Media</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                Upload real academy photographs to Cloudinary and sync with Supabase.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
