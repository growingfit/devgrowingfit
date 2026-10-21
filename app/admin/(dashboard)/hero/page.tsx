'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { getHeroSectionAction, updateHeroSectionAction, updateHeroBenefitAction } from '@/lib/actions/cms';
import { HeroSection, HeroBenefit, HeroSlide } from '@/types/database';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Layers,
  Sparkles,
  Type,
} from 'lucide-react';

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const [hero, setHero] = useState<Partial<HeroSection>>({
    heading: 'Fun Fitness Sports',
    eyebrow: '',
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
    slide_interval: 5000,
    slides: [
      {
        id: 'slide-1',
        title: 'Slide 1',
        heading: 'Fun Fitness Sports',
        image_url: '',
        image_public_id: '',
        mobile_image_url: '',
        mobile_image_public_id: '',
        is_visible: true,
      },
      {
        id: 'slide-2',
        title: 'Slide 2',
        heading: 'Fun Fitness Sports',
        image_url: '',
        image_public_id: '',
        mobile_image_url: '',
        mobile_image_public_id: '',
        is_visible: true,
      },
      {
        id: 'slide-3',
        title: 'Slide 3',
        heading: 'Fun Fitness Sports',
        image_url: '',
        image_public_id: '',
        mobile_image_url: '',
        mobile_image_public_id: '',
        is_visible: true,
      },
    ],
  });

  const [benefits, setBenefits] = useState<HeroBenefit[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHeroSectionAction();
        if (data?.hero) {
          setHero((prev) => {
            const incomingHeading = data.hero.heading || prev.heading || 'Fun Fitness Sports';
            const incomingSlides = Array.isArray(data.hero.slides) && data.hero.slides.length > 0
              ? data.hero.slides.map((s: HeroSlide) => ({ ...s, heading: incomingHeading }))
              : prev.slides;

            return {
              ...prev,
              ...data.hero,
              heading: incomingHeading,
              slides: incomingSlides,
            };
          });
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

    const bannerHeading = hero.heading || 'Fun Fitness Sports';
    const currentSlides = (hero.slides || []).map((s) => ({
      ...s,
      heading: bannerHeading,
      description: '',
      eyebrow: '',
      primary_cta_text: '',
      primary_cta_url: '',
    }));

    const firstSlide = currentSlides[0] || {};
    const payload = {
      ...hero,
      heading: bannerHeading,
      eyebrow: '',
      description: '',
      primary_cta_text: '',
      primary_cta_url: '',
      secondary_cta_text: '',
      secondary_cta_url: '',
      image_url: firstSlide.image_url || hero.image_url || '',
      image_public_id: firstSlide.image_public_id || hero.image_public_id || '',
      mobile_image_url: firstSlide.mobile_image_url || hero.mobile_image_url || '',
      mobile_image_public_id: firstSlide.mobile_image_public_id || hero.mobile_image_public_id || '',
      slides: currentSlides,
    };

    const result = await updateHeroSectionAction(payload);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Hero banners & heading saved successfully.' });
      const data = await getHeroSectionAction();
      if (data?.hero) setHero((prev) => ({ ...prev, ...data.hero }));
      if (data?.benefits && Array.isArray(data.benefits)) setBenefits(data.benefits);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save hero section.' });
    }
    setSaving(false);
  };

  const updateSlideField = (index: number, updates: Partial<HeroSlide>) => {
    setHero((prev) => {
      const slides = [...(prev.slides || [])];
      while (slides.length <= index) {
        slides.push({
          id: `slide-${slides.length + 1}`,
          title: `Slide ${slides.length + 1}`,
          heading: prev.heading || 'Fun Fitness Sports',
          is_visible: true,
        });
      }
      slides[index] = { ...slides[index], ...updates };

      const newHero: Partial<HeroSection> = { ...prev, slides };
      if (index === 0) {
        if ('image_url' in updates) newHero.image_url = updates.image_url;
        if ('image_public_id' in updates) newHero.image_public_id = updates.image_public_id;
        if ('mobile_image_url' in updates) newHero.mobile_image_url = updates.mobile_image_url;
        if ('mobile_image_public_id' in updates) newHero.mobile_image_public_id = updates.mobile_image_public_id;
      }
      return newHero;
    });
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

  const slides = hero.slides || [];
  const currentSlide: HeroSlide = slides[activeSlideIndex] || {
    id: `slide-${activeSlideIndex + 1}`,
    title: `Slide ${activeSlideIndex + 1}`,
    heading: hero.heading || 'Fun Fitness Sports',
    is_visible: true,
  };

  return (
    <>
      <AdminHeader
        title="Homepage Hero Banners CMS"
        description="Manage the sliding carousel banners (Slide 1, Slide 2, Slide 3) with Desktop & Mobile photography"
      />

      <main className="p-6 sm:p-8 max-w-5xl space-y-8">
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

        <form onSubmit={handleHeroSubmit} className="space-y-6">
          {/* Main Hero Banner & Sliding Section */}
          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8E8EC] pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#67238A]" />
                  <h2 className="text-lg font-bold text-[#172033]">Hero Banner Carousel</h2>
                </div>
                <p className="text-xs text-[#667085] mt-1">
                  Configure 3 sliding banners with dedicated Desktop (16:9) and Mobile (9:16 portrait) photography.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hero.is_visible ?? true}
                    onChange={(e) => setHero({ ...hero, is_visible: e.target.checked })}
                    className="w-4 h-4 text-[#67238A] rounded border-gray-300 focus:ring-[#67238A]"
                  />
                  <span className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                    Show on Homepage
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#667085]">Slide Time:</span>
                  <select
                    value={hero.slide_interval || 5000}
                    onChange={(e) => setHero({ ...hero, slide_interval: Number(e.target.value) })}
                    className="text-xs font-semibold px-2.5 py-1.5 bg-[#F8F9FA] border border-[#E8E8EC] rounded-lg text-[#172033] focus:outline-none focus:border-[#67238A]"
                  >
                    <option value={3000}>3 Seconds</option>
                    <option value={4000}>4 Seconds</option>
                    <option value={5000}>5 Seconds (Default)</option>
                    <option value={7000}>7 Seconds</option>
                    <option value={10000}>10 Seconds</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Single Banner Heading Field */}
            <div className="p-5 bg-[#FAFAFC] border border-[#E8E8EC] rounded-2xl space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Type className="w-4 h-4 text-[#67238A]" />
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider">
                  Banner Heading
                </label>
              </div>
              <input
                type="text"
                value={hero.heading || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHero((prev) => ({
                    ...prev,
                    heading: val,
                    slides: (prev.slides || []).map((s) => ({ ...s, heading: val })),
                  }));
                }}
                placeholder="Fun Fitness Sports"
                className="w-full max-w-lg px-4 py-3 bg-white border border-[#E8E8EC] rounded-xl text-base font-bold text-[#172033] focus:outline-none focus:border-[#67238A] shadow-xs"
              />
              <p className="text-[11px] text-[#667085]">
                The single heading displayed across all banner slides on the website.
              </p>
            </div>

            {/* Slide Switcher Tabs in the Same Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider">
                Select Slide to Edit (Slide 1, Slide 2, Slide 3)
              </label>

              <div className="grid grid-cols-3 gap-3 p-1.5 bg-[#F6F7F9] rounded-2xl border border-[#E8E8EC]">
                {[0, 1, 2].map((idx) => {
                  const s = slides[idx] || {};
                  const isActive = activeSlideIndex === idx;
                  const hasDesktop = Boolean(s.image_url);
                  const hasMobile = Boolean(s.mobile_image_url);
                  const isVisible = s.is_visible !== false;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`relative flex flex-col sm:flex-row items-center sm:justify-between px-4 py-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-white text-[#67238A] font-bold shadow-sm border border-[#67238A]/20 ring-2 ring-[#67238A]/10'
                          : 'text-[#475467] hover:bg-white/60 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive
                              ? 'bg-[#67238A] text-white'
                              : 'bg-[#E4E7EC] text-[#475467]'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs sm:text-sm font-bold block">
                            Slide {idx + 1}
                            {idx === 0 && (
                              <span className="hidden sm:inline-block ml-1.5 text-[10px] font-semibold text-[#67238A] bg-purple-50 px-1.5 py-0.5 rounded">
                                Main
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-[#667085] hidden sm:block">
                            {hasDesktop ? 'Desktop ✓' : 'No desktop'} • {hasMobile ? 'Mobile ✓' : 'No mobile'}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator dot */}
                      <div className="hidden sm:flex items-center gap-1.5 mt-1 sm:mt-0">
                        {isVisible ? (
                          <span
                            title="Slide is active in carousel"
                            className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"
                          />
                        ) : (
                          <span
                            title="Slide is hidden"
                            className="w-2.5 h-2.5 rounded-full bg-neutral-300"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Slide Detail Panel */}
            <div className="p-6 bg-[#FAFAFC] border border-[#E8E8EC] rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E8EC] pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#67238A]" />
                  <h3 className="text-sm font-bold text-[#172033]">
                    Configuring Slide {activeSlideIndex + 1} Photography
                  </h3>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#172033]">
                  <input
                    type="checkbox"
                    checked={currentSlide.is_visible ?? true}
                    onChange={(e) => updateSlideField(activeSlideIndex, { is_visible: e.target.checked })}
                    className="w-4 h-4 text-[#67238A] rounded border-gray-300 focus:ring-[#67238A]"
                  />
                  <span>Enable Slide {activeSlideIndex + 1} in Carousel</span>
                </label>
              </div>

              {/* Banner Uploaders: Desktop and Mobile side-by-side */}
              <div>
                <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-3">
                  Slide {activeSlideIndex + 1} Banner Images (Cloudinary Upload)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-5 bg-white border border-[#E8E8EC] rounded-xl">
                  {/* Desktop Banner Option */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-4 h-4 text-[#67238A]" />
                      <span className="text-xs font-bold text-[#172033]">
                        Desktop Hero Banner (Slide {activeSlideIndex + 1})
                      </span>
                    </div>
                    <ImageUploader
                      label="Landscape Banner Image (16:9)"
                      value={currentSlide.image_url || ''}
                      publicId={currentSlide.image_public_id || ''}
                      onChange={(url, publicId) =>
                        updateSlideField(activeSlideIndex, {
                          image_url: url,
                          image_public_id: publicId,
                        })
                      }
                    />
                    <p className="text-[11px] text-[#667085] mt-1.5">
                      Shown on desktop, laptop &amp; tablet screens (wide landscape recommended, e.g. 1920×700 or 16:9).
                    </p>
                  </div>

                  {/* Mobile Banner Option */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="w-4 h-4 text-[#67238A]" />
                      <span className="text-xs font-bold text-[#172033]">
                        Mobile Hero Banner (Slide {activeSlideIndex + 1})
                      </span>
                    </div>
                    <ImageUploader
                      label="Portrait Banner Image (Mobile 9:16)"
                      value={currentSlide.mobile_image_url || ''}
                      publicId={currentSlide.mobile_image_public_id || ''}
                      aspectRatio="portrait"
                      onChange={(url, publicId) =>
                        updateSlideField(activeSlideIndex, {
                          mobile_image_url: url,
                          mobile_image_public_id: publicId,
                        })
                      }
                    />
                    <p className="text-[11px] text-[#667085] mt-1.5">
                      Shown specifically on mobile devices in <strong>9:16 portrait ratio</strong> (recommended: 1080×1920).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Carousel Visual Overview Deck */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-3">
                Carousel Slides Summary
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => {
                  const s = slides[idx] || {};
                  const isCur = activeSlideIndex === idx;
                  const hasDesktopImg = Boolean(s.image_url);
                  const hasMobileImg = Boolean(s.mobile_image_url);
                  const headingText = hero.heading || 'Fun Fitness Sports';

                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${
                        isCur
                          ? 'border-[#67238A] bg-purple-50/30 ring-2 ring-[#67238A]/10'
                          : 'border-[#E8E8EC] bg-white hover:border-[#67238A]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-[#172033] mb-2">
                        <span>Slide #{idx + 1}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            s.is_visible !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {s.is_visible !== false ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      {/* Side-by-side preview: Desktop 16:9 & Mobile 9:16 */}
                      <div className="flex gap-2.5 items-end">
                        {/* Desktop thumbnail */}
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-[#667085] block mb-1">
                            Desktop (16:9)
                          </span>
                          <div className="aspect-[16/9] w-full bg-[#121316] rounded-lg overflow-hidden relative flex items-center justify-center">
                            {hasDesktopImg ? (
                              <img
                                src={s.image_url!}
                                alt={`Slide ${idx + 1} Desktop`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-[10px] text-neutral-400 font-medium">No Desktop</div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                              <p className="text-[10px] text-white font-bold truncate">{headingText}</p>
                            </div>
                          </div>
                        </div>

                        {/* Mobile 9:16 thumbnail */}
                        <div className="w-16 flex-shrink-0">
                          <span className="text-[10px] font-bold text-[#667085] block mb-1">
                            Mobile (9:16)
                          </span>
                          <div className="aspect-[9/16] w-full bg-[#121316] rounded-lg overflow-hidden relative flex items-center justify-center">
                            {hasMobileImg ? (
                              <img
                                src={s.mobile_image_url!}
                                alt={`Slide ${idx + 1} Mobile`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-[9px] text-neutral-400 font-medium text-center p-1 leading-tight">
                                No Mobile
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 text-[10px] text-[#667085]">
                        <span>Desktop: {hasDesktopImg ? '✓' : '—'}</span>
                        <span>Mobile (9:16): {hasMobileImg ? '✓' : '—'}</span>
                        <span className="text-[#67238A] font-semibold">Click to Edit</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-7 py-3 rounded-full shadow transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save All Hero Banners &amp; Slides</span>
              </button>
            </div>
          </div>
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
