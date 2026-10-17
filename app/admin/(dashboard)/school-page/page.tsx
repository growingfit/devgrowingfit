'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  getSchoolPageCmsAction,
  updateSchoolHeroAction,
  updateWhyGrowingFitAction,
  updateSchoolIntroAction,
  updateWhatsInForKidsAction,
  updateSchoolTabsAction,
  updateSchoolCurriculumAction,
  updateSchoolGlimpsesAction,
  updateSchoolTestimonialsAction,
} from '@/lib/actions/school-cms';
import {
  SchoolPageData,
  SchoolHeroSlide,
  WhyGrowingFitItem,
  WhatsInForKidsCard,
  SchoolTabItem,
  CurriculumStage,
  SchoolGlimpseImage,
  SchoolTestimonialItem,
} from '@/types/database';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Plus,
  Trash2,
  Layers,
  HelpCircle,
  FileText,
  Grid,
  Sliders,
  BookOpen,
  Camera,
  MessageSquare,
} from 'lucide-react';

type TabKey =
  | 'hero'
  | 'why'
  | 'intro'
  | 'what'
  | 'tabs'
  | 'curriculum'
  | 'glimpses'
  | 'testimonials';

export default function SchoolPageAdmin() {
  const [activeTab, setActiveTab] = useState<TabKey>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // School Page Data State
  const [schoolData, setSchoolData] = useState<SchoolPageData | null>(null);

  // Active sub-tab inside tabs section
  const [activeTabCategoryIndex, setActiveTabCategoryIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSchoolPageCmsAction();
        if (data) {
          setSchoolData(data);
        }
      } catch (err) {
        console.error('Failed to load school page cms data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveSection = async (sectionKey: TabKey) => {
    if (!schoolData) return;
    setSaving(true);
    setMessage(null);

    let res: { success: boolean; message?: string; error?: string } = { success: false };

    try {
      switch (sectionKey) {
        case 'hero':
          res = await updateSchoolHeroAction(schoolData.hero);
          break;
        case 'why':
          res = await updateWhyGrowingFitAction(schoolData.whyGrowingFit);
          break;
        case 'intro':
          res = await updateSchoolIntroAction(schoolData.introduction);
          break;
        case 'what':
          res = await updateWhatsInForKidsAction(schoolData.whatsInForKids);
          break;
        case 'tabs':
          res = await updateSchoolTabsAction(schoolData.tabsSection);
          break;
        case 'curriculum':
          res = await updateSchoolCurriculumAction(schoolData.curriculum);
          break;
        case 'glimpses':
          res = await updateSchoolGlimpsesAction(schoolData.glimpses);
          break;
        case 'testimonials':
          res = await updateSchoolTestimonialsAction(schoolData.testimonials);
          break;
      }

      if (res.success) {
        setMessage({ type: 'success', text: res.message || 'Saved successfully!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to save.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
        <AdminHeader title="School Page CMS" description="Manage all sections of the School page" />
        <div className="flex-1 flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#E11D2A] animate-spin" />
        </div>
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
        <AdminHeader title="School Page CMS" description="Manage all sections of the School page" />
        <div className="p-8 text-center text-slate-600">Failed to load school page settings.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      <AdminHeader
        title="School Page CMS"
        description="Full editorial control over Growing Fit School physical education and sports page"
      />

      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">School Page Sections</h2>
            <p className="text-xs text-slate-500">
              Matches the clean editorial sports school design. Changes reflect immediately on <span className="font-semibold text-slate-700">/schools</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/schools"
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Page</span>
            </Link>

            <button
              onClick={() => handleSaveSection(activeTab)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E11D2A] hover:bg-[#b91520] text-white text-xs font-bold rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Current Section</span>
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
          {[
            { key: 'hero', label: '1. Top Hero Slider', icon: Layers },
            { key: 'why', label: '2. Why Growing Fit', icon: HelpCircle },
            { key: 'intro', label: '3. Introduction', icon: FileText },
            { key: 'what', label: "4. What's in for Kids", icon: Grid },
            { key: 'tabs', label: '5. Sports & Fitness Tabs', icon: Sliders },
            { key: 'curriculum', label: '6. Curriculum', icon: BookOpen },
            { key: 'glimpses', label: '7. Previous Year Glimpses', icon: Camera },
            { key: 'testimonials', label: '8. Testimonials', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as TabKey);
                  setMessage(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#172033] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white bg-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SECTION 1: TOP HERO SLIDER */}
        {activeTab === 'hero' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hero Carousel Slides</h3>
                <p className="text-xs text-slate-500">
                  Full-width landscape sports training photos with subtle slide transitions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newSlide: SchoolHeroSlide = {
                    id: `slide-${Date.now()}`,
                    title: 'New Training Slide',
                    image_url: '/images/hero-banner-karate.png',
                    sort_order: (schoolData.hero.slides?.length || 0) + 1,
                    is_published: true,
                  };
                  setSchoolData({
                    ...schoolData,
                    hero: {
                      ...schoolData.hero,
                      slides: [...(schoolData.hero.slides || []), newSlide],
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#E11D2A] bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Heading (Optional / SEO)
                </label>
                <input
                  type="text"
                  value={schoolData.hero.heading || ''}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      hero: { ...schoolData.hero, heading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D2A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={schoolData.hero.subtitle || ''}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      hero: { ...schoolData.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D2A]"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Slide Items</h4>
              {schoolData.hero.slides?.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFC] grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
                >
                  <div className="lg:col-span-5">
                    <ImageUploader
                      label={`Slide #${idx + 1} Image`}
                      value={slide.image_url}
                      onChange={(url) => {
                        const updated = [...schoolData.hero.slides];
                        updated[idx] = { ...updated[idx], image_url: url };
                        setSchoolData({
                          ...schoolData,
                          hero: { ...schoolData.hero, slides: updated },
                        });
                      }}
                    />
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Slide #{idx + 1} Details</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = schoolData.hero.slides.filter((_, i) => i !== idx);
                          setSchoolData({
                            ...schoolData,
                            hero: { ...schoolData.hero, slides: updated },
                          });
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Slide Caption / Title
                      </label>
                      <input
                        type="text"
                        value={slide.title || ''}
                        onChange={(e) => {
                          const updated = [...schoolData.hero.slides];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setSchoolData({
                            ...schoolData,
                            hero: { ...schoolData.hero, slides: updated },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          value={slide.sort_order ?? idx + 1}
                          onChange={(e) => {
                            const updated = [...schoolData.hero.slides];
                            updated[idx] = { ...updated[idx], sort_order: parseInt(e.target.value) || 0 };
                            setSchoolData({
                              ...schoolData,
                              hero: { ...schoolData.hero, slides: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <label className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={slide.is_published !== false}
                            onChange={(e) => {
                              const updated = [...schoolData.hero.slides];
                              updated[idx] = { ...updated[idx], is_published: e.target.checked };
                              setSchoolData({
                                ...schoolData,
                                hero: { ...schoolData.hero, slides: updated },
                              });
                            }}
                            className="rounded text-[#E11D2A] focus:ring-[#E11D2A]"
                          />
                          Published
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: WHY GROWING FIT */}
        {activeTab === 'why' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Why Growing Fit Section</h3>
                <p className="text-xs text-slate-500">
                  Light-grey background horizontal slider with large light-grey sequence numbers (#1, #2, #3...).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = schoolData.whyGrowingFit.items || [];
                  const newItem: WhyGrowingFitItem = {
                    id: `why-${Date.now()}`,
                    sequence: `#${items.length + 1}`,
                    title: 'New Benefit',
                    description: 'Description of key benefit and impact on child fitness.',
                    sort_order: items.length + 1,
                    is_visible: true,
                  };
                  setSchoolData({
                    ...schoolData,
                    whyGrowingFit: {
                      ...schoolData.whyGrowingFit,
                      items: [...items, newItem],
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#E11D2A] bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Benefit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={schoolData.whyGrowingFit.heading || ''}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      whyGrowingFit: { ...schoolData.whyGrowingFit, heading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={schoolData.whyGrowingFit.subtitle || ''}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      whyGrowingFit: { ...schoolData.whyGrowingFit, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Benefit Items</h4>
              {schoolData.whyGrowingFit.items?.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFC] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Item #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = schoolData.whyGrowingFit.items.filter((_, i) => i !== idx);
                        setSchoolData({
                          ...schoolData,
                          whyGrowingFit: { ...schoolData.whyGrowingFit, items: updated },
                        });
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Sequence Label (e.g. #1, #2)
                      </label>
                      <input
                        type="text"
                        value={item.sequence || ''}
                        onChange={(e) => {
                          const updated = [...schoolData.whyGrowingFit.items];
                          updated[idx] = { ...updated[idx], sequence: e.target.value };
                          setSchoolData({
                            ...schoolData,
                            whyGrowingFit: { ...schoolData.whyGrowingFit, items: updated },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const updated = [...schoolData.whyGrowingFit.items];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setSchoolData({
                            ...schoolData,
                            whyGrowingFit: { ...schoolData.whyGrowingFit, items: updated },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => {
                        const updated = [...schoolData.whyGrowingFit.items];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setSchoolData({
                          ...schoolData,
                          whyGrowingFit: { ...schoolData.whyGrowingFit, items: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.is_visible !== false}
                        onChange={(e) => {
                          const updated = [...schoolData.whyGrowingFit.items];
                          updated[idx] = { ...updated[idx], is_visible: e.target.checked };
                          setSchoolData({
                            ...schoolData,
                            whyGrowingFit: { ...schoolData.whyGrowingFit, items: updated },
                          });
                        }}
                        className="rounded text-[#E11D2A] focus:ring-[#E11D2A]"
                      />
                      Visible
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: INTRODUCTION */}
        {activeTab === 'intro' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Spacious Introduction Section</h3>
              <p className="text-xs text-slate-500">
                Centered, readable editorial paragraph about Growing Fit's child development and physical education philosophy.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Editorial Paragraph
              </label>
              <textarea
                rows={5}
                value={schoolData.introduction.content || ''}
                onChange={(e) =>
                  setSchoolData({
                    ...schoolData,
                    introduction: { ...schoolData.introduction, content: e.target.value },
                  })
                }
                className="w-full p-3 text-sm leading-relaxed border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E11D2A]"
                placeholder="Enter introduction paragraph..."
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={schoolData.introduction.is_visible !== false}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      introduction: { ...schoolData.introduction, is_visible: e.target.checked },
                    })
                  }
                  className="rounded text-[#E11D2A] focus:ring-[#E11D2A]"
                />
                Section Visible
              </label>
            </div>
          </div>
        )}

        {/* SECTION 4: WHAT'S IN FOR KIDS */}
        {activeTab === 'what' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">What's In For Kids</h3>
              <p className="text-xs text-slate-500">
                Four horizontal landscape photo cards with overlaid white titles and dark gradient backdrop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={schoolData.whatsInForKids.heading || ''}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      whatsInForKids: { ...schoolData.whatsInForKids, heading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={schoolData.whatsInForKids.subtitle || ''}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      whatsInForKids: { ...schoolData.whatsInForKids, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {schoolData.whatsInForKids.cards?.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFC] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Card #{idx + 1}: {card.title}</span>
                    <label className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={card.is_visible !== false}
                        onChange={(e) => {
                          const updated = [...schoolData.whatsInForKids.cards];
                          updated[idx] = { ...updated[idx], is_visible: e.target.checked };
                          setSchoolData({
                            ...schoolData,
                            whatsInForKids: { ...schoolData.whatsInForKids, cards: updated },
                          });
                        }}
                        className="rounded text-[#E11D2A] focus:ring-[#E11D2A]"
                      />
                      Visible
                    </label>
                  </div>

                  <ImageUploader
                    label="Card Landscape Image"
                    value={card.image_url}
                    onChange={(url) => {
                      const updated = [...schoolData.whatsInForKids.cards];
                      updated[idx] = { ...updated[idx], image_url: url };
                      setSchoolData({
                        ...schoolData,
                        whatsInForKids: { ...schoolData.whatsInForKids, cards: updated },
                      });
                    }}
                  />

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Card Title (Overlaid on Image)
                    </label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => {
                        const updated = [...schoolData.whatsInForKids.cards];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setSchoolData({
                          ...schoolData,
                          whatsInForKids: { ...schoolData.whatsInForKids, cards: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Short Description / Alt Text
                    </label>
                    <input
                      type="text"
                      value={card.description || ''}
                      onChange={(e) => {
                        const updated = [...schoolData.whatsInForKids.cards];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setSchoolData({
                          ...schoolData,
                          whatsInForKids: { ...schoolData.whatsInForKids, cards: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: HEALTH AND FITNESS / SKILL / SPORTS TABS */}
        {activeTab === 'tabs' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Health & Fitness / Skill Development / Sports Training Tabs</h3>
              <p className="text-xs text-slate-500">
                Text-based tab bar with red underline on active tab, showing 3 columns per tab in a soft-tinted container.
              </p>
            </div>

            {/* Sub-tab navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              {schoolData.tabsSection.tabs?.map((cat, idx) => (
                <button
                  key={cat.id || idx}
                  type="button"
                  onClick={() => setActiveTabCategoryIndex(idx)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                    activeTabCategoryIndex === idx
                      ? 'bg-[#E11D2A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Editing the selected tab category */}
            {schoolData.tabsSection.tabs?.[activeTabCategoryIndex] && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tab Category Label
                  </label>
                  <input
                    type="text"
                    value={schoolData.tabsSection.tabs[activeTabCategoryIndex].label || ''}
                    onChange={(e) => {
                      const updatedTabs = [...schoolData.tabsSection.tabs];
                      updatedTabs[activeTabCategoryIndex] = {
                        ...updatedTabs[activeTabCategoryIndex],
                        label: e.target.value,
                      };
                      setSchoolData({
                        ...schoolData,
                        tabsSection: { ...schoolData.tabsSection, tabs: updatedTabs },
                      });
                    }}
                    className="w-full max-w-sm px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {schoolData.tabsSection.tabs[activeTabCategoryIndex].items?.map((item, itemIdx) => (
                    <div
                      key={item.id || itemIdx}
                      className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFC] space-y-3"
                    >
                      <span className="text-xs font-bold text-slate-900">Column #{itemIdx + 1}</span>

                      <ImageUploader
                        label="Column Image"
                        value={item.image_url}
                        onChange={(url) => {
                          const updatedTabs = [...schoolData.tabsSection.tabs];
                          const catItems = [...updatedTabs[activeTabCategoryIndex].items];
                          catItems[itemIdx] = { ...catItems[itemIdx], image_url: url };
                          updatedTabs[activeTabCategoryIndex] = {
                            ...updatedTabs[activeTabCategoryIndex],
                            items: catItems,
                          };
                          setSchoolData({
                            ...schoolData,
                            tabsSection: { ...schoolData.tabsSection, tabs: updatedTabs },
                          });
                        }}
                      />

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => {
                            const updatedTabs = [...schoolData.tabsSection.tabs];
                            const catItems = [...updatedTabs[activeTabCategoryIndex].items];
                            catItems[itemIdx] = { ...catItems[itemIdx], title: e.target.value };
                            updatedTabs[activeTabCategoryIndex] = {
                              ...updatedTabs[activeTabCategoryIndex],
                              items: catItems,
                            };
                            setSchoolData({
                              ...schoolData,
                              tabsSection: { ...schoolData.tabsSection, tabs: updatedTabs },
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={item.description || ''}
                          onChange={(e) => {
                            const updatedTabs = [...schoolData.tabsSection.tabs];
                            const catItems = [...updatedTabs[activeTabCategoryIndex].items];
                            catItems[itemIdx] = { ...catItems[itemIdx], description: e.target.value };
                            updatedTabs[activeTabCategoryIndex] = {
                              ...updatedTabs[activeTabCategoryIndex],
                              items: catItems,
                            };
                            setSchoolData({
                              ...schoolData,
                              tabsSection: { ...schoolData.tabsSection, tabs: updatedTabs },
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                            Link Text (e.g. SHOW MORE)
                          </label>
                          <input
                            type="text"
                            value={item.link_text || ''}
                            onChange={(e) => {
                              const updatedTabs = [...schoolData.tabsSection.tabs];
                              const catItems = [...updatedTabs[activeTabCategoryIndex].items];
                              catItems[itemIdx] = { ...catItems[itemIdx], link_text: e.target.value };
                              updatedTabs[activeTabCategoryIndex] = {
                                ...updatedTabs[activeTabCategoryIndex],
                                items: catItems,
                              };
                              setSchoolData({
                                ...schoolData,
                                tabsSection: { ...schoolData.tabsSection, tabs: updatedTabs },
                              });
                            }}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                            Link URL
                          </label>
                          <input
                            type="text"
                            value={item.link_url || ''}
                            onChange={(e) => {
                              const updatedTabs = [...schoolData.tabsSection.tabs];
                              const catItems = [...updatedTabs[activeTabCategoryIndex].items];
                              catItems[itemIdx] = { ...catItems[itemIdx], link_url: e.target.value };
                              updatedTabs[activeTabCategoryIndex] = {
                                ...updatedTabs[activeTabCategoryIndex],
                                items: catItems,
                              };
                              setSchoolData({
                                ...schoolData,
                                tabsSection: { ...schoolData.tabsSection, tabs: updatedTabs },
                              });
                            }}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 6: CURRICULUM */}
        {activeTab === 'curriculum' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Curriculum Section</h3>
                <p className="text-xs text-slate-500">
                  Clean editorial layout describing progressive sports curriculum stages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const stages = schoolData.curriculum.stages || [];
                  const newStage: CurriculumStage = {
                    stage: `Stage ${stages.length + 1} — New Developmental Tier`,
                    detail: 'Details of athletic progression, motor development, and sport fundamentals.',
                  };
                  setSchoolData({
                    ...schoolData,
                    curriculum: {
                      ...schoolData.curriculum,
                      stages: [...stages, newStage],
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#E11D2A] bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stage</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={schoolData.curriculum.heading || ''}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      curriculum: { ...schoolData.curriculum, heading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Curriculum Overview Description
                </label>
                <textarea
                  rows={3}
                  value={schoolData.curriculum.description || ''}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      curriculum: { ...schoolData.curriculum, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Stages Breakdown</h4>
              {schoolData.curriculum.stages?.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFC] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Stage #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = schoolData.curriculum.stages.filter((_, i) => i !== idx);
                        setSchoolData({
                          ...schoolData,
                          curriculum: { ...schoolData.curriculum, stages: updated },
                        });
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Stage Title (e.g. Stage 1 — Fundamental Movement)
                    </label>
                    <input
                      type="text"
                      value={stage.stage || ''}
                      onChange={(e) => {
                        const updated = [...schoolData.curriculum.stages];
                        updated[idx] = { ...updated[idx], stage: e.target.value };
                        setSchoolData({
                          ...schoolData,
                          curriculum: { ...schoolData.curriculum, stages: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Stage Focus & Objectives
                    </label>
                    <textarea
                      rows={2}
                      value={stage.detail || ''}
                      onChange={(e) => {
                        const updated = [...schoolData.curriculum.stages];
                        updated[idx] = { ...updated[idx], detail: e.target.value };
                        setSchoolData({
                          ...schoolData,
                          curriculum: { ...schoolData.curriculum, stages: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7: GLIMPSES OF PREVIOUS YEAR */}
        {activeTab === 'glimpses' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Glimpses of Previous Year Gallery</h3>
                <p className="text-xs text-slate-500">
                  Four wide landscape sports photos in a row matching the reference, with interactive lightbox modal on click.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const images = schoolData.glimpses.images || [];
                  const newImg: SchoolGlimpseImage = {
                    id: `glim-${Date.now()}`,
                    title: 'New Gallery Photo',
                    image_url: '/images/for-schools.png',
                    sort_order: images.length + 1,
                    is_published: true,
                  };
                  setSchoolData({
                    ...schoolData,
                    glimpses: {
                      ...schoolData.glimpses,
                      images: [...images, newImg],
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#E11D2A] bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={schoolData.glimpses.heading || ''}
                onChange={(e) =>
                  setSchoolData({
                    ...schoolData,
                    glimpses: { ...schoolData.glimpses, heading: e.target.value },
                  })
                }
                className="w-full max-w-md px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {schoolData.glimpses.images?.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFC] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Photo #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = schoolData.glimpses.images.filter((_, i) => i !== idx);
                        setSchoolData({
                          ...schoolData,
                          glimpses: { ...schoolData.glimpses, images: updated },
                        });
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>

                  <ImageUploader
                    label="Landscape Image"
                    value={img.image_url}
                    onChange={(url) => {
                      const updated = [...schoolData.glimpses.images];
                      updated[idx] = { ...updated[idx], image_url: url };
                      setSchoolData({
                        ...schoolData,
                        glimpses: { ...schoolData.glimpses, images: updated },
                      });
                    }}
                  />

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Caption / Title
                    </label>
                    <input
                      type="text"
                      value={img.title || ''}
                      onChange={(e) => {
                        const updated = [...schoolData.glimpses.images];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setSchoolData({
                          ...schoolData,
                          glimpses: { ...schoolData.glimpses, images: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={img.is_published !== false}
                        onChange={(e) => {
                          const updated = [...schoolData.glimpses.images];
                          updated[idx] = { ...updated[idx], is_published: e.target.checked };
                          setSchoolData({
                            ...schoolData,
                            glimpses: { ...schoolData.glimpses, images: updated },
                          });
                        }}
                        className="rounded text-[#E11D2A] focus:ring-[#E11D2A]"
                      />
                      Published
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 8: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Parent & School Testimonials</h3>
                <p className="text-xs text-slate-500">
                  Clean two-column cards with circular parent photos, genuine quotes, name, and role.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const items = schoolData.testimonials.items || [];
                  const newItem: SchoolTestimonialItem = {
                    id: `test-${Date.now()}`,
                    quote: 'Our children love the structured training and energetic coaches.',
                    author_name: 'Parent Name',
                    author_role: 'Parent',
                    avatar_url: '/images/about-philosophy-card.jpg',
                    sort_order: items.length + 1,
                    is_visible: true,
                  };
                  setSchoolData({
                    ...schoolData,
                    testimonials: {
                      ...schoolData.testimonials,
                      items: [...items, newItem],
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#E11D2A] bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={schoolData.testimonials.heading || ''}
                onChange={(e) =>
                  setSchoolData({
                    ...schoolData,
                    testimonials: { ...schoolData.testimonials, heading: e.target.value },
                  })
                }
                className="w-full max-w-md px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {schoolData.testimonials.items?.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-5 rounded-xl border border-slate-200 bg-[#FAFAFC] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Testimonial #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = schoolData.testimonials.items.filter((_, i) => i !== idx);
                        setSchoolData({
                          ...schoolData,
                          testimonials: { ...schoolData.testimonials, items: updated },
                        });
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>

                  <ImageUploader
                    label="Parent / Reviewer Photo"
                    aspectRatio="square"
                    value={item.avatar_url}
                    onChange={(url) => {
                      const updated = [...schoolData.testimonials.items];
                      updated[idx] = { ...updated[idx], avatar_url: url };
                      setSchoolData({
                        ...schoolData,
                        testimonials: { ...schoolData.testimonials, items: updated },
                      });
                    }}
                  />

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Reviewer Name
                    </label>
                    <input
                      type="text"
                      value={item.author_name || ''}
                      onChange={(e) => {
                        const updated = [...schoolData.testimonials.items];
                        updated[idx] = { ...updated[idx], author_name: e.target.value };
                        setSchoolData({
                          ...schoolData,
                          testimonials: { ...schoolData.testimonials, items: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Role / School
                    </label>
                    <input
                      type="text"
                      value={item.author_role || ''}
                      onChange={(e) => {
                        const updated = [...schoolData.testimonials.items];
                        updated[idx] = { ...updated[idx], author_role: e.target.value };
                        setSchoolData({
                          ...schoolData,
                          testimonials: { ...schoolData.testimonials, items: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Testimonial Feedback Quote
                    </label>
                    <textarea
                      rows={3}
                      value={item.quote || ''}
                      onChange={(e) => {
                        const updated = [...schoolData.testimonials.items];
                        updated[idx] = { ...updated[idx], quote: e.target.value };
                        setSchoolData({
                          ...schoolData,
                          testimonials: { ...schoolData.testimonials, items: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.is_visible !== false}
                        onChange={(e) => {
                          const updated = [...schoolData.testimonials.items];
                          updated[idx] = { ...updated[idx], is_visible: e.target.checked };
                          setSchoolData({
                            ...schoolData,
                            testimonials: { ...schoolData.testimonials, items: updated },
                          });
                        }}
                        className="rounded text-[#E11D2A] focus:ring-[#E11D2A]"
                      />
                      Visible
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating / Bottom Save Bar */}
        <div className="sticky bottom-6 bg-[#172033] text-white p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div className="text-xs">
            <span className="font-bold">Editing: </span>
            <span className="text-slate-300 capitalize">{activeTab} Section</span>
          </div>
          <button
            onClick={() => handleSaveSection(activeTab)}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E11D2A] hover:bg-[#b91520] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
