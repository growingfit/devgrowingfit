'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  getAboutSectionAction,
  getAboutFeaturesAction,
  updateAboutSectionAction,
  updateAboutFeatureAction,
  seedAdminImagesAction,
} from '@/lib/actions/cms';
import { AboutSection, AboutFeature } from '@/types/database';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
  Sparkles,
  Heart,
  Eye,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [about, setAbout] = useState<Partial<AboutSection>>({
    eyebrow: 'ABOUT GROWING FIT',
    heading: 'More Than Just',
    highlighted_text: 'Martial Arts.',
    description:
      'Growing Fit is a dedicated martial arts academy focused on the holistic development of children. Our professional training programs in Karate, Kung Fu, Muay Thai, Boxing, and more, help every child stay active, confident and disciplined in life.',
    button_text: 'Know More',
    button_url: '/about',
    image_url: '',
    image_public_id: '',
    image_focal_position: 'center',
    is_visible: true,
    // 3 dedicated image options for About Us page
    hero_image_url: '/images/about-hero-banner.png',
    hero_image_public_id: '',
    philosophy_image_url: '/images/about-philosophy-card.jpg',
    philosophy_image_public_id: '',
    cta_image_url: '/images/about-cta-banner.png',
    cta_image_public_id: '',
  });

  const [features, setFeatures] = useState<AboutFeature[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [aboutData, featuresData] = await Promise.all([
          getAboutSectionAction(),
          getAboutFeaturesAction(),
        ]);

        if (aboutData) setAbout(aboutData);
        if (featuresData && Array.isArray(featuresData)) setFeatures(featuresData);
      } catch (err) {
        console.error('Failed to load about section data in admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const safetyTimer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(safetyTimer);
  }, []);

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateAboutSectionAction(about);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'About section and page images updated.' });
      const data = await getAboutSectionAction();
      if (data) setAbout((prev) => ({ ...prev, ...data }));
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update about section.' });
    }
    setSaving(false);
  };

  const handleSeedImages = async () => {
    setSaving(true);
    setMessage(null);
    const res = await seedAdminImagesAction();
    if (res.success) {
      setAbout((prev) => ({
        ...prev,
        hero_image_url: '/images/about-hero-banner.png',
        philosophy_image_url: '/images/about-philosophy-card.jpg',
        cta_image_url: '/images/about-cta-banner.png',
        image_url: '/images/user-admin-about.png',
      }));
      setMessage({ type: 'success', text: 'All 3 images and homepage banner seeded successfully into Admin & Database!' });
      const data = await getAboutSectionAction();
      if (data) setAbout((prev) => ({ ...prev, ...data }));
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to seed images.' });
    }
    setSaving(false);
  };

  const handleFeatureSave = async (feature: AboutFeature) => {
    const result = await updateAboutFeatureAction(feature.id, {
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      sort_order: feature.sort_order,
      is_visible: feature.is_visible,
    });
    if (result.success) {
      setMessage({ type: 'success', text: `Feature "${feature.title}" updated.` });
      const featuresData = await getAboutFeaturesAction();
      if (featuresData && Array.isArray(featuresData)) setFeatures(featuresData);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update feature.' });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#67238A] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="About Us CMS & Images"
        description="Manage the 3 visual image sections on the public /about page, as well as the Homepage About card and features."
      />

      <main className="p-8 max-w-5xl space-y-8">
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleAboutSubmit} className="space-y-8">
          {/* ========================================================
              SECTION 1: THE THREE ABOUT US PAGE IMAGE OPTIONS
          ======================================================== */}
          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#172033]">About Us Page Images (3 Sections)</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E11D2A] text-white">
                      Live on /about
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Upload or replace images for the 3 visual sections on the public About Us page.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSeedImages}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D2A] border border-[#FECDD3] text-xs font-bold px-3.5 py-1.5 rounded-full transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Seed Default Images</span>
                </button>
                <Link
                  href="/about"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#67238A] hover:underline"
                >
                  <span>View About Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3 Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Hero Banner Image */}
              <div className="border border-[#E8E8EC] rounded-xl p-4 bg-[#FAFAFC] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black tracking-wider uppercase text-[#E11D2A] bg-[#FFF1F2] px-2 py-0.5 rounded">
                      Option 1: Hero Banner
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#E11D2A]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#172033]">Top Hero Section Image</h3>
                  <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                    Displayed beside the &quot;About Us&quot; headline and quote, blending with a smooth soft fade.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <ImageUploader
                    label="Hero Image (Cloudinary or URL)"
                    value={about.hero_image_url || ''}
                    publicId={about.hero_image_public_id}
                    onChange={(url, publicId) =>
                      setAbout({
                        ...about,
                        hero_image_url: url,
                        hero_image_public_id: publicId || '',
                      })
                    }
                  />
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Default:</span> Karate girl punching banner (/images/about-hero-banner.png)
                  </div>
                </div>
              </div>

              {/* Option 2: Our Philosophy Image */}
              <div className="border border-[#E8E8EC] rounded-xl p-4 bg-[#FAFAFC] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black tracking-wider uppercase text-[#E11D2A] bg-[#FFF1F2] px-2 py-0.5 rounded">
                      Option 2: Philosophy
                    </span>
                    <Heart className="w-3.5 h-3.5 text-[#E11D2A]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#172033]">Our Philosophy Image</h3>
                  <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                    Displayed in &quot;Beyond The Field: Transforming Mind, Body &amp; Spirit&quot; with a left fade gradient.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <ImageUploader
                    label="Philosophy Image (Cloudinary or URL)"
                    value={about.philosophy_image_url || ''}
                    publicId={about.philosophy_image_public_id}
                    onChange={(url, publicId) =>
                      setAbout({
                        ...about,
                        philosophy_image_url: url,
                        philosophy_image_public_id: publicId || '',
                      })
                    }
                  />
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Default:</span> Karate boy punching card (/images/about-philosophy-card.jpg)
                  </div>
                </div>
              </div>

              {/* Option 3: Experience Growing Fit CTA Image */}
              <div className="border border-[#E8E8EC] rounded-xl p-4 bg-[#FAFAFC] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black tracking-wider uppercase text-[#E11D2A] bg-[#FFF1F2] px-2 py-0.5 rounded">
                      Option 3: CTA Section
                    </span>
                    <Eye className="w-3.5 h-3.5 text-[#E11D2A]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#172033]">Experience Growing Fit (CTA)</h3>
                  <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                    Displayed on the right of the blush pink &quot;Ready to See Your Child Thrive?&quot; card.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <ImageUploader
                    label="CTA Card Visual (Cloudinary or URL)"
                    value={about.cta_image_url || ''}
                    publicId={about.cta_image_public_id}
                    onChange={(url, publicId) =>
                      setAbout({
                        ...about,
                        cta_image_url: url,
                        cta_image_public_id: publicId || '',
                      })
                    }
                  />
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Default:</span> Martial arts girl high kick banner (/images/about-cta-banner.png)
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save About Page Images</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: HOMEPAGE ABOUT CARD CONTENT & BANNER
          ======================================================== */}
          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#172033]">Homepage About Card Content</h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Controls the horizontal martial arts banner card located exclusively on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Eyebrow
                </label>
                <input
                  type="text"
                  value={about.eyebrow || ''}
                  onChange={(e) => setAbout({ ...about, eyebrow: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={about.is_visible ?? true}
                    onChange={(e) => setAbout({ ...about, is_visible: e.target.checked })}
                    className="w-4 h-4 text-[#67238A] rounded border-gray-300 focus:ring-[#67238A]"
                  />
                  <span className="text-sm font-semibold text-[#172033]">Display on Website</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={about.heading || ''}
                  onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Highlighted Text (Red)
                </label>
                <input
                  type="text"
                  value={about.highlighted_text || ''}
                  onChange={(e) => setAbout({ ...about, highlighted_text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={about.description || ''}
                onChange={(e) => setAbout({ ...about, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Button Label
                </label>
                <input
                  type="text"
                  value={about.button_text || ''}
                  onChange={(e) => setAbout({ ...about, button_text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Button URL
                </label>
                <input
                  type="text"
                  value={about.button_url || ''}
                  onChange={(e) => setAbout({ ...about, button_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
                />
              </div>
            </div>

            <div>
              <ImageUploader
                label="Homepage Card Banner Image (Cloudinary or URL)"
                value={about.image_url}
                publicId={about.image_public_id}
                onChange={(url, publicId) =>
                  setAbout({ ...about, image_url: url, image_public_id: publicId || '' })
                }
              />
              <p className="text-[11px] text-[#667085] mt-1.5">
                Upload your wide banner image (recommended ~3:1 ratio, e.g. 2173×724).
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-6 py-3 rounded-full shadow transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save All Settings</span>
            </button>
          </div>
        </form>

        {/* ========================================================
            SECTION 3: 4 FEATURE CARDS ON HOMEPAGE
        ======================================================== */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-[#172033]">4 Right-Hand Feature Items (Homepage Card)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, idx) => (
              <div key={f.id} className="p-4 rounded-xl border border-[#E8E8EC] space-y-3 bg-[#FAFAFC]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#67238A] uppercase">Feature #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleFeatureSave(f)}
                    className="text-xs font-semibold text-[#67238A] hover:underline"
                  >
                    Save Item
                  </button>
                </div>
                <input
                  type="text"
                  value={f.title}
                  placeholder="Feature Title"
                  onChange={(e) => {
                    const upd = [...features];
                    upd[idx].title = e.target.value;
                    setFeatures(upd);
                  }}
                  className="w-full px-3 py-2 bg-white border border-[#E8E8EC] rounded-lg text-sm font-bold focus:outline-none focus:border-[#67238A]"
                />
                <textarea
                  rows={2}
                  value={f.description}
                  placeholder="Feature Description"
                  onChange={(e) => {
                    const upd = [...features];
                    upd[idx].description = e.target.value;
                    setFeatures(upd);
                  }}
                  className="w-full px-3 py-2 bg-white border border-[#E8E8EC] rounded-lg text-xs focus:outline-none focus:border-[#67238A]"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
