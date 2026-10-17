'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { getVisionSectionAction, updateVisionSectionAction } from '@/lib/actions/cms';
import { VisionSection } from '@/types/database';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Target,
  Eye,
  LayoutTemplate,
  ImageIcon,
  Sparkles,
} from 'lucide-react';

export default function AdminVisionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [vision, setVision] = useState<Partial<VisionSection>>({
    eyebrow: 'OUR PURPOSE',
    heading: 'Our Mission & Vision',
    subtitle: 'Inspiring and empowering every child through health, discipline, and active sports.',
    mission_title: 'MISSION',
    mission_description:
      'To inspire and empower children through sports and physical education, promoting health, discipline, and confidence for a stronger, brighter tomorrow.',
    vision_title: 'VISION',
    description:
      'To be a leading sports academy recognized for nurturing healthy, confident, and disciplined individuals who excel in sports and in life.',
    image_url: '/images/vision-karate-girl.png',
    image_public_id: '',
    image_focal_position: 'center',
    overlay_opacity: 0.85,
    is_visible: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getVisionSectionAction();
        if (data) {
          setVision((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load vision & mission data in admin:', err);
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

    const result = await updateVisionSectionAction(vision);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Vision & Mission section updated successfully.' });
      const data = await getVisionSectionAction();
      if (data) setVision((prev) => ({ ...prev, ...data }));
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update section.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#67238A] animate-spin" />
      </div>
    );
  }

  const currentImg = vision.image_url || '';

  return (
    <>
      <AdminHeader
        title="Vision & Mission CMS"
        description="Manage the Mission & Vision section, statement copy, section headers, and background banner image"
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Section Header Settings */}
          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A]">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#172033]">Section Header Controls</h2>
                  <p className="text-xs text-[#667085]">Controls the title and eyebrow displayed directly above the wide card.</p>
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={vision.is_visible ?? true}
                  onChange={(e) => setVision({ ...vision, is_visible: e.target.checked })}
                  className="w-4 h-4 text-[#67238A] rounded border-gray-300 focus:ring-[#67238A]"
                />
                <span className="text-xs font-bold text-[#172033]">Display on Website</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={vision.eyebrow || ''}
                  placeholder="OUR PURPOSE"
                  onChange={(e) => setVision({ ...vision, eyebrow: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Section Heading *
                </label>
                <input
                  required
                  type="text"
                  value={vision.heading || ''}
                  placeholder="Our Mission & Vision"
                  onChange={(e) => setVision({ ...vision, heading: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Section Subtitle / Tagline
              </label>
              <input
                type="text"
                value={vision.subtitle || ''}
                placeholder="Inspiring and empowering every child through health, discipline, and active sports."
                onChange={(e) => setVision({ ...vision, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          {/* Card 2: Mission & Vision Twin Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Card: OUR MISSION FORM */}
            <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A] flex-shrink-0 shadow-2xs">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#E11D2A] uppercase">PILLAR 1</span>
                  <h3 className="text-base font-bold text-[#172033]">Our Mission Form</h3>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Mission Badge Label
                </label>
                <input
                  type="text"
                  value={vision.mission_title || ''}
                  placeholder="MISSION"
                  onChange={(e) => setVision({ ...vision, mission_title: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-[#E8E8EC] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#67238A]"
                />
                <span className="text-[11px] text-[#667085] mt-1 block">Renders as &ldquo;OUR <span className="text-[#E11D2A] font-bold">{vision.mission_title || 'MISSION'}</span>&rdquo;</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Mission Statement *
                </label>
                <textarea
                  required
                  rows={4}
                  value={vision.mission_description || ''}
                  placeholder="To inspire and empower children through sports and physical education, promoting health, discipline, and confidence for a stronger, brighter tomorrow."
                  onChange={(e) => setVision({ ...vision, mission_description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#67238A]"
                />
              </div>
            </div>

            {/* Right Card: OUR VISION FORM */}
            <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A] flex-shrink-0 shadow-2xs">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#E11D2A] uppercase">PILLAR 2</span>
                  <h3 className="text-base font-bold text-[#172033]">Our Vision Form</h3>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Vision Badge Label
                </label>
                <input
                  type="text"
                  value={vision.vision_title || ''}
                  placeholder="VISION"
                  onChange={(e) => setVision({ ...vision, vision_title: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-[#E8E8EC] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#67238A]"
                />
                <span className="text-[11px] text-[#667085] mt-1 block">Renders as &ldquo;OUR <span className="text-[#E11D2A] font-bold">{vision.vision_title || 'VISION'}</span>&rdquo;</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Vision Statement *
                </label>
                <textarea
                  required
                  rows={4}
                  value={vision.description || ''}
                  placeholder="To be a leading sports academy recognized for nurturing healthy, confident, and disciplined individuals who excel in sports and in life."
                  onChange={(e) => setVision({ ...vision, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#67238A]"
                />
              </div>
            </div>

          </div>

          {/* Card 3: Card Background Banner Image */}
          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A]">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#172033]">Vision &amp; Mission Background Image</h2>
                <p className="text-xs text-[#667085]">Upload or replace the wide background banner graphic displayed across the card.</p>
              </div>
            </div>

            <ImageUploader
              label="Vision & Mission Background Graphic (Cloudinary or URL)"
              value={vision.image_url}
              publicId={vision.image_public_id}
              onChange={(url, publicId) => setVision({ ...vision, image_url: url, image_public_id: publicId || '' })}
            />

            {/* Visual Preview Box */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#172033]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E11D2A]" />
                  <span>Current Graphic Preview</span>
                </span>
                <span className="text-[11px] font-normal text-[#667085]">Recommended ~4:1 panoramic ratio</span>
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#E8E8EC] bg-slate-100 h-44 sm:h-56">
                <img
                  src={currentImg}
                  alt="Vision & Mission Card Preview"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                  <p className="text-xs text-white/90 font-medium">
                    Card Background Image: {vision.image_url ? 'Custom Uploaded Asset' : 'Default Academy Karate Girl'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2.5 bg-[#67238A] hover:bg-[#521A6E] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Vision &amp; Mission Section</span>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
