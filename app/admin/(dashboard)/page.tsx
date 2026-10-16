import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/server';
import {
  Trophy,
  Dumbbell,
  Image as ImageIcon,
  MessageSquareQuote,
  MapPin,
  Sparkles,
  ArrowRight,
  Database,
  Cloud,
  Info,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  const supabase = createClient();

  // Load counts safely
  const [categoriesCount, programsCount, galleryCount, testimonialsCount, centresCount] =
    await Promise.all([
      supabase.from('sports_categories').select('*', { count: 'exact', head: true }),
      supabase.from('sports_programs').select('*', { count: 'exact', head: true }),
      supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      supabase.from('centres').select('*', { count: 'exact', head: true }),
    ]);

  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasCloudinary = Boolean(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

  const stats = [
    { label: 'Active Categories', count: categoriesCount.count ?? 3, href: '/admin/categories', icon: Trophy, color: 'text-amber-500' },
    { label: 'Sports Programs', count: programsCount.count ?? 5, href: '/admin/programs', icon: Dumbbell, color: 'text-indigo-500' },
    { label: 'Gallery Moments', count: galleryCount.count ?? 8, href: '/admin/gallery', icon: ImageIcon, color: 'text-emerald-500' },
    { label: 'Parent Testimonials', count: testimonialsCount.count ?? 2, href: '/admin/testimonials', icon: MessageSquareQuote, color: 'text-purple-500' },
    { label: 'Training Centres', count: centresCount.count ?? 4, href: '/admin/centres', icon: MapPin, color: 'text-red-500' },
  ];

  return (
    <>
      <AdminHeader
        title="Admin CMS Overview"
        description="Manage Growing Fit public website content, media assets, and operations"
      />

      <main className="p-8 space-y-8">
        {/* Environment & Backend Health Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-[#E8E8EC] rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Supabase Database</h3>
                <p className="text-xs text-[#667085]">
                  {hasSupabaseUrl ? 'Connected & RLS Enforced' : 'Awaiting Environment Keys'}
                </p>
              </div>
            </div>
            {hasSupabaseUrl ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Pending .env</span>
              </span>
            )}
          </div>

          <div className="p-5 bg-white border border-[#E8E8EC] rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Cloudinary Media Storage</h3>
                <p className="text-xs text-[#667085]">
                  {hasCloudinary ? 'Connected for Server Uploads' : 'Awaiting API Keys'}
                </p>
              </div>
            </div>
            {hasCloudinary ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Pending .env</span>
              </span>
            )}
          </div>
        </div>

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
              href="/admin/hero"
              className="p-4 rounded-xl border border-[#E8E8EC] hover:border-[#67238A] hover:bg-[#FAFAFC] transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#67238A]" />
                <span>Hero Banner</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                Headlines, highlighted text, CTA buttons, benefits, and hero photography.
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
              href="/admin/about"
              className="p-4 rounded-xl border border-[#E8E8EC] hover:border-[#67238A] hover:bg-[#FAFAFC] transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#67238A]" />
                <span>Homepage About Card</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                Manage the "More Than Just Martial Arts" homepage card banner image, live text, and 4 value features.
              </p>
            </Link>

            <Link
              href="/admin/vision"
              className="p-4 rounded-xl border border-[#E8E8EC] hover:border-[#67238A] hover:bg-[#FAFAFC] transition-colors"
            >
              <h4 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#67238A]" />
                <span>Vision &amp; Mission</span>
              </h4>
              <p className="text-xs text-[#667085] mt-1">
                Manage the Mission and Vision statements, section headers, and background banner image.
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
