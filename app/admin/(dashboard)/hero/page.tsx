'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { getHeroSectionAction, updateHeroSectionAction, updateHeroBenefitAction } from '@/lib/actions/cms';
import { HeroSection, HeroBenefit } from '@/types/database';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [hero, setHero] = useState<Partial<HeroSection>>({
    eyebrow: '',
    heading: '',
    highlighted_text: '',
    description: '',
    primary_cta_text: '',
    primary_cta_url: '',
    secondary_cta_text: '',
    secondary_cta_url: '',
    image_url: '',
    image_public_id: '',
    mobile_image_url: '',
    mobile_image_public_id: '',
    image_focal_position: 'center',
    is_visible: true,
  });

  const [benefits, setBenefits] = useState<HeroBenefit[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHeroSectionAction();
        if (data?.hero) {
          setHero((prev) => ({ ...prev, ...data.hero }));
        }
        if (data?.benefits && Array.isArray(data.benefits)) {
          setBenefits(data.benefits);
        }
      } catch (err) {
        console.error('Failed to load hero section data in admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const safetyTimer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(safetyTimer);
  }, []);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateHeroSectionAction(hero);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Hero section saved successfully.' });
      const data = await getHeroSectionAction();
      if (data?.hero) setHero((prev) => ({ ...prev, ...data.hero }));
      if (data?.benefits && Array.isArray(data.benefits)) setBenefits(data.benefits);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save hero section.' });
    }
    setSaving(false);
  };

  const handleBenefitUpdate = async (benefit: HeroBenefit) => {
    const result = await updateHeroBenefitAction(benefit.id, {
      title: benefit.title,
      icon: benefit.icon,
      sort_order: benefit.sort_order,
      is_visible: benefit.is_visible,
    });
    if (result.success) {
      setMessage({ type: 'success', text: 'Benefit indicator updated.' });
      const data = await getHeroSectionAction();
      if (data?.benefits && Array.isArray(data.benefits)) setBenefits(data.benefits);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update benefit.' });
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
        title="Hero Section CMS"
        description="Manage main homepage headlines, highlighted text, buttons, and academy photography"
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

        <form onSubmit={handleHeroSubmit} className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-[#172033]">Hero Banner Content</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Eyebrow
              </label>
              <input
                type="text"
                value={hero.eyebrow || ''}
                onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hero.is_visible ?? true}
                  onChange={(e) => setHero({ ...hero, is_visible: e.target.checked })}
                  className="w-4 h-4 text-[#67238A] rounded border-gray-300 focus:ring-[#67238A]"
                />
                <span className="text-sm font-semibold text-[#172033]">Display Hero on Website</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Main Headline
              </label>
              <input
                type="text"
                value={hero.heading || ''}
                onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Highlighted Word (Purple Accent)
              </label>
              <input
                type="text"
                value={hero.highlighted_text || ''}
                onChange={(e) => setHero({ ...hero, highlighted_text: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
              Tagline / Subtitle (e.g. SPORTS FOR A STRONGER TOMORROW)
            </label>
            <textarea
              rows={3}
              value={hero.description || ''}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Primary Button Label
              </label>
              <input
                type="text"
                value={hero.primary_cta_text || ''}
                onChange={(e) => setHero({ ...hero, primary_cta_text: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Primary Button URL
              </label>
              <input
                type="text"
                value={hero.primary_cta_url || ''}
                onChange={(e) => setHero({ ...hero, primary_cta_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={hero.secondary_cta_text || ''}
                onChange={(e) => setHero({ ...hero, secondary_cta_text: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Secondary Button URL
              </label>
              <input
                type="text"
                value={hero.secondary_cta_url || ''}
                onChange={(e) => setHero({ ...hero, secondary_cta_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          {/* Hero Images: Desktop and Mobile Side-by-Side */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-3">
              Hero Banner Photographs (Cloudinary)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#FAFAFC] border border-[#E8E8EC] rounded-2xl">
              <div>
                <ImageUploader
                  label="Desktop Hero Banner (Landscape)"
                  value={hero.image_url}
                  publicId={hero.image_public_id}
                  onChange={(url, publicId) => setHero({ ...hero, image_url: url, image_public_id: publicId })}
                />
                <p className="text-[11px] text-[#667085] mt-1.5">
                  Displayed on desktop &amp; tablet screens (recommended wide aspect ratio, e.g. 16:9).
                </p>
              </div>

              <div>
                <ImageUploader
                  label="Mobile Hero Banner (Portrait)"
                  value={hero.mobile_image_url}
                  publicId={hero.mobile_image_public_id}
                  onChange={(url, publicId) => setHero({ ...hero, mobile_image_url: url, mobile_image_public_id: publicId })}
                />
                <p className="text-[11px] text-[#667085] mt-1.5">
                  Displayed on mobile devices (recommended vertical aspect ratio, e.g. 4:5 or portrait).
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-6 py-3 rounded-full shadow transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Hero Banner</span>
          </button>
        </form>

        {/* 4 Benefit Indicators */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-[#172033]">Hero Benefit Indicators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, idx) => (
              <div key={b.id} className="p-4 rounded-xl border border-[#E8E8EC] space-y-2">
                <label className="block text-[11px] font-bold text-[#667085] uppercase">
                  Benefit #{idx + 1}
                </label>
                <input
                  type="text"
                  value={b.title}
                  onChange={(e) => {
                    const updated = [...benefits];
                    updated[idx].title = e.target.value;
                    setBenefits(updated);
                  }}
                  onBlur={() => handleBenefitUpdate(b)}
                  className="w-full px-3 py-2 bg-white border border-[#E8E8EC] rounded-lg text-sm focus:outline-none focus:border-[#67238A]"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
