'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  getHomepageSectionsAction,
  updateSchoolSectionAction,
  updateAcademySectionAction,
  updateCorporateSectionAction,
} from '@/lib/actions/cms';
import { SchoolSectionData, AcademySectionData, CorporateSectionData } from '@/types/database';
import { Save, Loader2, CheckCircle2, AlertCircle, School, Award, Users } from 'lucide-react';

export default function AdminHomepageSectionsPage() {
  const [activeTab, setActiveTab] = useState<'schools' | 'academy' | 'corporate'>('schools');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [schools, setSchools] = useState<SchoolSectionData>({
    heading: 'For Schools',
    description: '',
    button_text: 'Learn More',
    button_url: '/schools',
    image_url: '/images/for-schools.png',
    image_alt: 'School children playing football',
    is_visible: true,
  });

  const [academy, setAcademy] = useState<AcademySectionData>({
    heading: 'For Academy',
    description: '',
    button_text: 'Learn More',
    button_url: '/academy',
    image_url: '/images/for-academy.png',
    image_alt: 'Young athletes celebrating with coach',
    is_visible: true,
    thumbnails: [],
  });

  const [corporate, setCorporate] = useState<CorporateSectionData>({
    heading: 'For Corporates & Community',
    description: '',
    button_text: 'Learn More',
    button_url: '/corporate',
    image_url: '/images/for-corporate.png',
    image_alt: 'Corporate team celebration',
    is_visible: true,
    thumbnails: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHomepageSectionsAction();
        if (data.schools) setSchools(data.schools);
        if (data.academy) setAcademy(data.academy);
        if (data.corporate) setCorporate(data.corporate);
      } catch (err) {
        console.error('Failed to load homepage sections in admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveSchools = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await updateSchoolSectionAction(schools);
    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Schools section updated.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update.' });
    }
    setSaving(false);
  };

  const handleSaveAcademy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await updateAcademySectionAction(academy);
    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Academy section updated.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update.' });
    }
    setSaving(false);
  };

  const handleSaveCorporate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await updateCorporateSectionAction(corporate);
    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Corporate section updated.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update.' });
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

  return (
    <>
      <AdminHeader
        title="Homepage Sections CMS"
        description="Manage For Schools, For Academy, and For Corporates & Community sections, images, and thumbnails"
      />

      <main className="p-8 max-w-5xl space-y-6">
        {/* Status notification */}
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#E8E8EC] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('schools')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'schools'
                ? 'bg-[#172033] text-white shadow-sm'
                : 'text-[#667085] hover:bg-slate-100 hover:text-[#172033]'
            }`}
          >
            <School className="w-4 h-4" />
            <span>1. For Schools</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academy')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'academy'
                ? 'bg-[#172033] text-white shadow-sm'
                : 'text-[#667085] hover:bg-slate-100 hover:text-[#172033]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. For Academy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('corporate')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'corporate'
                ? 'bg-[#172033] text-white shadow-sm'
                : 'text-[#667085] hover:bg-slate-100 hover:text-[#172033]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. For Corporates &amp; Community</span>
          </button>
        </div>

        {/* TAB 1: FOR SCHOOLS */}
        {activeTab === 'schools' && (
          <form onSubmit={handleSaveSchools} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E8EC] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#172033]">For Schools Section</h3>
                <p className="text-xs text-[#667085]">Edit content and sports photograph for the school physical education program</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#172033]">
                <input
                  type="checkbox"
                  checked={schools.is_visible !== false}
                  onChange={(e) => setSchools({ ...schools, is_visible: e.target.checked })}
                  className="rounded border-slate-300 text-[#8A1820] focus:ring-[#8A1820]"
                />
                <span>Visible on Homepage</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={schools.heading}
                  onChange={(e) => setSchools({ ...schools, heading: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A1820]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                  Description Text
                </label>
                <textarea
                  rows={4}
                  value={schools.description}
                  onChange={(e) => setSchools({ ...schools, description: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A1820]/20 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={schools.button_text}
                    onChange={(e) => setSchools({ ...schools, button_text: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A1820]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                    Button Link / URL
                  </label>
                  <input
                    type="text"
                    value={schools.button_url}
                    onChange={(e) => setSchools({ ...schools, button_url: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A1820]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                  School Sports Photograph
                </label>
                <ImageUploader
                  value={schools.image_url}
                  onChange={(url, pid) => setSchools({ ...schools, image_url: url, image_public_id: pid })}
                  folder="growing_fit/schools"
                  label="Upload Schools Section Photo"
                  aspectRatio="video"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#8A1820] hover:bg-[#6F1218] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Schools Section</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: FOR ACADEMY */}
        {activeTab === 'academy' && (
          <form onSubmit={handleSaveAcademy} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E8EC] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#172033]">For Academy Section</h3>
                <p className="text-xs text-[#667085]">Manage academy training headline, main photo, and 4 sports thumbnails</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#172033]">
                <input
                  type="checkbox"
                  checked={academy.is_visible !== false}
                  onChange={(e) => setAcademy({ ...academy, is_visible: e.target.checked })}
                  className="rounded border-slate-300 text-[#8A1820] focus:ring-[#8A1820]"
                />
                <span>Visible on Homepage</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={academy.heading}
                  onChange={(e) => setAcademy({ ...academy, heading: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A1820]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                  Description Text
                </label>
                <textarea
                  rows={4}
                  value={academy.description}
                  onChange={(e) => setAcademy({ ...academy, description: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A1820]/20 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={academy.button_text}
                    onChange={(e) => setAcademy({ ...academy, button_text: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                    Button Link / URL
                  </label>
                  <input
                    type="text"
                    value={academy.button_url}
                    onChange={(e) => setAcademy({ ...academy, button_url: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                  Main Academy Photograph
                </label>
                <ImageUploader
                  value={academy.image_url}
                  onChange={(url, pid) => setAcademy({ ...academy, image_url: url, image_public_id: pid })}
                  folder="growing_fit/academy"
                  label="Upload Main Academy Team Photo"
                  aspectRatio="video"
                />
              </div>

              {/* 4 Thumbnails Editor */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                  4 Sports Thumbnails
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(academy.thumbnails || []).map((thumb, idx) => (
                    <div key={thumb.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-500">Thumbnail {idx + 1}</label>
                      <input
                        type="text"
                        placeholder="Sport Title (e.g. Skating)"
                        value={thumb.title}
                        onChange={(e) => {
                          const updated = [...academy.thumbnails];
                          updated[idx].title = e.target.value;
                          setAcademy({ ...academy, thumbnails: updated });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <ImageUploader
                        value={thumb.image_url}
                        onChange={(url, pid) => {
                          const updated = [...academy.thumbnails];
                          updated[idx].image_url = url;
                          updated[idx].image_public_id = pid;
                          setAcademy({ ...academy, thumbnails: updated });
                        }}
                        folder="growing_fit/academy"
                        label={`Upload ${thumb.title || 'Sport'}`}
                        aspectRatio="video"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#8A1820] hover:bg-[#6F1218] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Academy Section</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: FOR CORPORATES & COMMUNITY */}
        {activeTab === 'corporate' && (
          <form onSubmit={handleSaveCorporate} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E8EC] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#172033]">For Corporates &amp; Community Section</h3>
                <p className="text-xs text-[#667085]">Manage corporate packages content, main photo, and 4 activity thumbnails</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#172033]">
                <input
                  type="checkbox"
                  checked={corporate.is_visible !== false}
                  onChange={(e) => setCorporate({ ...corporate, is_visible: e.target.checked })}
                  className="rounded border-slate-300 text-[#8A1820] focus:ring-[#8A1820]"
                />
                <span>Visible on Homepage</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={corporate.heading}
                  onChange={(e) => setCorporate({ ...corporate, heading: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A1820]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                  Description Text
                </label>
                <textarea
                  rows={4}
                  value={corporate.description}
                  onChange={(e) => setCorporate({ ...corporate, description: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A1820]/20 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={corporate.button_text}
                    onChange={(e) => setCorporate({ ...corporate, button_text: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                    Button Link / URL
                  </label>
                  <input
                    type="text"
                    value={corporate.button_url}
                    onChange={(e) => setCorporate({ ...corporate, button_url: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 uppercase tracking-wider">
                  Main Corporate Sports Photograph
                </label>
                <ImageUploader
                  value={corporate.image_url}
                  onChange={(url, pid) => setCorporate({ ...corporate, image_url: url, image_public_id: pid })}
                  folder="growing_fit/corporate"
                  label="Upload Corporate Sports Photo"
                  aspectRatio="video"
                />
              </div>

              {/* 4 Thumbnails Editor */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                  4 Activity Cards (Bottom Row)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(corporate.thumbnails || []).map((thumb, idx) => (
                    <div key={thumb.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-500">Activity {idx + 1}</label>
                      <input
                        type="text"
                        placeholder="Activity Title (e.g. Team Building)"
                        value={thumb.title}
                        onChange={(e) => {
                          const updated = [...corporate.thumbnails];
                          updated[idx].title = e.target.value;
                          setCorporate({ ...corporate, thumbnails: updated });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <ImageUploader
                        value={thumb.image_url}
                        onChange={(url, pid) => {
                          const updated = [...corporate.thumbnails];
                          updated[idx].image_url = url;
                          updated[idx].image_public_id = pid;
                          setCorporate({ ...corporate, thumbnails: updated });
                        }}
                        folder="growing_fit/corporate"
                        label={`Upload ${thumb.title || 'Activity'}`}
                        aspectRatio="video"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#8A1820] hover:bg-[#6F1218] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Corporate Section</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
