'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  getAboutSectionAction,
  updateAboutSectionAction,
  getVisionSectionAction,
  updateVisionSectionAction,
} from '@/lib/actions/cms';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Target,
  ExternalLink,
  BookOpen,
  Quote,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // About Cards State
  const [about, setAbout] = useState({
    eyebrow: 'ABOUT US',
    heading: 'About Us',
    highlight_quote:
      '“Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals”',
    description:
      'Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals. We offer a wide range of sports programs, including Kung Fu, Muay Thai, Boxing, Roller Skating, Football, Swimming, and Badminton, to help our members stay active, healthy, and achieve their full potential.',
    banner_image_url:
      'https://res.cloudinary.com/nvho1sss/image/upload/v1792563443/growing_fit/lmupafbyumygrqjz7jcg.png',
    banner_image_public_id: 'growing_fit/lmupafbyumygrqjz7jcg',
    banner_mobile_image_url:
      'https://res.cloudinary.com/nvho1sss/image/upload/v1792564706/growing_fit/osjliaabzcwpmicfnmo6.png',
    banner_mobile_image_public_id: 'growing_fit/osjliaabzcwpmicfnmo6',
    is_visible: true,
  });

  // Mission & Vision Cards State
  const [vision, setVision] = useState({
    eyebrow: 'OUR PURPOSE',
    heading: 'Mission & Vision',
    subtitle: '',
    mission_eyebrow: 'OUR MISSION',
    mission_title: 'Mission',
    mission_description:
      'Our mission at Growing Fit is to empower individuals of all ages and abilities to lead healthy, active, and fulfilling lives. We strive to achieve this mission by providing high-quality sports training programs, promoting physical fitness and mental well-being, and fostering a supportive and inclusive community.',
    vision_eyebrow: 'OUR VISION',
    vision_title: 'Vision',
    description:
      'Our vision at Growing Fit is to be a leading sports academy that empowers individuals to achieve their full potential, both on and off the field. We envision a future where individuals of all ages and abilities have access to high-quality sports training programs that promote physical fitness and mental well-being, and where a supportive and inclusive community fosters personal growth and success.',
    is_visible: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [aboutData, visionData] = await Promise.all([
          getAboutSectionAction(),
          getVisionSectionAction(),
        ]);

        if (aboutData) {
          setAbout((prev) => ({
            ...prev,
            ...aboutData,
            eyebrow: aboutData.eyebrow || 'ABOUT US',
            heading: aboutData.heading || 'About Us',
            highlight_quote:
              aboutData.highlight_quote ||
              '“Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals”',
            description:
              aboutData.description ||
              'Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals. We offer a wide range of sports programs, including Kung Fu, Muay Thai, Boxing, Roller Skating, Football, Swimming, and Badminton, to help our members stay active, healthy, and achieve their full potential.',
            banner_image_url:
              aboutData.banner_image_url ||
              'https://res.cloudinary.com/nvho1sss/image/upload/v1792563443/growing_fit/lmupafbyumygrqjz7jcg.png',
            banner_mobile_image_url:
              aboutData.banner_mobile_image_url ||
              'https://res.cloudinary.com/nvho1sss/image/upload/v1792564706/growing_fit/osjliaabzcwpmicfnmo6.png',
          }));
        }

        if (visionData) {
          setVision((prev) => ({
            ...prev,
            ...visionData,
            eyebrow: visionData.eyebrow || 'OUR PURPOSE',
            heading: visionData.heading || 'Mission & Vision',
            subtitle: visionData.subtitle || '',
            mission_eyebrow: visionData.mission_eyebrow || 'OUR MISSION',
            mission_title: visionData.mission_title || 'Mission',
            mission_description:
              visionData.mission_description ||
              'Our mission at Growing Fit is to empower individuals of all ages and abilities to lead healthy, active, and fulfilling lives. We strive to achieve this mission by providing high-quality sports training programs, promoting physical fitness and mental well-being, and fostering a supportive and inclusive community.',
            vision_eyebrow: visionData.vision_eyebrow || 'OUR VISION',
            vision_title: visionData.vision_title || 'Vision',
            description:
              visionData.description ||
              'Our vision at Growing Fit is to be a leading sports academy that empowers individuals to achieve their full potential, both on and off the field. We envision a future where individuals of all ages and abilities have access to high-quality sports training programs that promote physical fitness and mental well-being, and where a supportive and inclusive community fosters personal growth and success.',
          }));
        }
      } catch (err) {
        console.error('Failed to load about & vision data in admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const safetyTimer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(safetyTimer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const [aboutRes, visionRes] = await Promise.all([
        updateAboutSectionAction(about),
        updateVisionSectionAction(vision),
      ]);

      if (aboutRes.success && visionRes.success) {
        setMessage({
          type: 'success',
          text: 'About Us and Mission & Vision sections updated successfully!',
        });
      } else {
        setMessage({
          type: 'error',
          text: aboutRes.error || visionRes.error || 'Failed to save some sections.',
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#172033] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="About Us"
        description="Manage the About Us top hero banner, narrative story cards, and Mission & Vision cards"
      />

      <main className="p-6 sm:p-8 max-w-5xl space-y-8">
        {/* Success / Error Message Banner */}
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ========================================================
              CARD 1: ABOUT US CONTENT
          ======================================================== */}
          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0F1F3] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-slate-100 text-[#172033]">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#172033]">1. About Us Cards</h2>
                  <p className="text-xs text-[#667085]">
                    Displayed on the About Us page organized into modern cards.
                  </p>
                </div>
              </div>
              <Link
                href="/about"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#172033] hover:underline"
              >
                <span>View Live Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                    Section Eyebrow
                  </label>
                  <input
                    type="text"
                    value={about.eyebrow}
                    onChange={(e) => setAbout({ ...about, eyebrow: e.target.value })}
                    placeholder="e.g. ABOUT US"
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#172033]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={about.heading}
                    onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                    placeholder="e.g. About Us"
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#172033]"
                  />
                </div>
              </div>

              {/* Highlight Quote Card Input */}
              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-[#172033]" />
                  <span>Highlight Statement / Quote Card</span>
                </label>
                <textarea
                  rows={2}
                  value={about.highlight_quote}
                  onChange={(e) => setAbout({ ...about, highlight_quote: e.target.value })}
                  placeholder="e.g. “Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals”"
                  className="w-full px-4 py-2.5 bg-[#FAFAFC] border border-[#E8E8EC] rounded-xl text-sm font-medium focus:outline-none focus:border-[#172033]"
                />
              </div>

              {/* Narrative Story Description Input */}
              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Narrative Overview &amp; Sports Programs Card
                </label>
                <textarea
                  rows={4}
                  value={about.description}
                  onChange={(e) => setAbout({ ...about, description: e.target.value })}
                  placeholder="Growing Fit is a leading sports academy dedicated to helping individuals of all ages and abilities achieve their health and fitness goals. We offer a wide range of sports programs..."
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm leading-relaxed focus:outline-none focus:border-[#172033]"
                />
              </div>

              {/* Top Hero Banner Uploaders (Reused from Hero Banner Section) */}
              <div className="pt-4 border-t border-[#F0F1F3] space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                    Top Hero Banner (Reused from Hero Banner Section)
                  </h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Full-width landscape banner displayed at the very top of the About Us page.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUploader
                    label="Desktop Banner Image (Landscape)"
                    folder="growing_fit/about"
                    value={about.banner_image_url}
                    publicId={about.banner_image_public_id}
                    onChange={(url, publicId) =>
                      setAbout({
                        ...about,
                        banner_image_url: url,
                        banner_image_public_id: publicId || '',
                      })
                    }
                  />

                  <ImageUploader
                    label="Mobile Banner Image (Portrait)"
                    folder="growing_fit/about"
                    value={about.banner_mobile_image_url}
                    publicId={about.banner_mobile_image_public_id}
                    onChange={(url, publicId) =>
                      setAbout({
                        ...about,
                        banner_mobile_image_url: url,
                        banner_mobile_image_public_id: publicId || '',
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD 2: MISSION & VISION CARDS
          ======================================================== */}
          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#F0F1F3]">
              <span className="p-2 rounded-lg bg-slate-100 text-[#172033]">
                <Target className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-[#172033]">2. Mission &amp; Vision Cards</h2>
                <p className="text-xs text-[#667085]">
                  Manage the Mission &amp; Vision statement cards displayed beneath the About Us section.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                    Section Eyebrow
                  </label>
                  <input
                    type="text"
                    value={vision.eyebrow}
                    onChange={(e) => setVision({ ...vision, eyebrow: e.target.value })}
                    placeholder="e.g. OUR PURPOSE"
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#172033]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={vision.heading}
                    onChange={(e) => setVision({ ...vision, heading: e.target.value })}
                    placeholder="e.g. Mission & Vision"
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#172033]"
                  />
                </div>
              </div>

              {/* Mission & Vision Column Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Mission Column Card */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-[#FAFAFC] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#172033]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                      Mission Card
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                      Mission Card Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={vision.mission_eyebrow}
                      onChange={(e) => setVision({ ...vision, mission_eyebrow: e.target.value })}
                      placeholder="OUR MISSION"
                      className="w-full px-3 py-2 bg-white border border-[#E8E8EC] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                      Mission Title
                    </label>
                    <input
                      type="text"
                      value={vision.mission_title}
                      onChange={(e) => setVision({ ...vision, mission_title: e.target.value })}
                      placeholder="Mission"
                      className="w-full px-3 py-2 bg-white border border-[#E8E8EC] rounded-lg text-xs font-bold text-[#172033]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                      Mission Statement Text
                    </label>
                    <textarea
                      rows={5}
                      value={vision.mission_description}
                      onChange={(e) => setVision({ ...vision, mission_description: e.target.value })}
                      placeholder="Our mission at Growing Fit is to empower individuals of all ages and abilities to lead healthy, active, and fulfilling lives..."
                      className="w-full px-3 py-2 bg-white border border-[#E8E8EC] rounded-lg text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* Vision Column Card */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-[#FAFAFC] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#172033]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                      Vision Card
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                      Vision Card Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={vision.vision_eyebrow}
                      onChange={(e) => setVision({ ...vision, vision_eyebrow: e.target.value })}
                      placeholder="OUR VISION"
                      className="w-full px-3 py-2 bg-white border border-[#E8E8EC] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                      Vision Title
                    </label>
                    <input
                      type="text"
                      value={vision.vision_title}
                      onChange={(e) => setVision({ ...vision, vision_title: e.target.value })}
                      placeholder="Vision"
                      className="w-full px-3 py-2 bg-white border border-[#E8E8EC] rounded-lg text-xs font-bold text-[#172033]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                      Vision Statement Text
                    </label>
                    <textarea
                      rows={5}
                      value={vision.description}
                      onChange={(e) => setVision({ ...vision, description: e.target.value })}
                      placeholder="Our vision at Growing Fit is to be a leading sports academy that empowers individuals to achieve their full potential, both on and off the field..."
                      className="w-full px-3 py-2 bg-white border border-[#E8E8EC] rounded-lg text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Save Bar */}
          <div className="flex items-center justify-between bg-white border border-[#E8E8EC] rounded-2xl p-4 sm:p-5 shadow-xs sticky bottom-6 z-20">
            <span className="text-xs text-[#667085] font-medium hidden sm:inline">
              Changes reflect instantly across the public About Us page.
            </span>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#172033] hover:bg-black text-white font-bold text-sm px-8 py-3 rounded-full shadow-md transition-all disabled:opacity-60 cursor-pointer ml-auto"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
