'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  getContactAction,
  updateContactSettingsAction,
  upsertSocialLinkAction,
  deleteSocialLinkAction,
} from '@/lib/actions/cms';
import { SocialLink } from '@/types/database';
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
} from 'lucide-react';

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingSocial, setAddingSocial] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Contact Form State - ZERO mock data defaults
  const [contact, setContact] = useState({
    address: '',
    phone: '',
    phone_secondary: '',
    email: '',
  });

  // Social Links State
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const fetchData = async () => {
    try {
      const data = await getContactAction();
      if (data?.contact) {
        setContact({
          address: data.contact.address || data.contact.headquarters || '',
          phone: data.contact.phone || '',
          phone_secondary: data.contact.phone_secondary || '',
          email: data.contact.email || '',
        });
      }
      if (data?.socials && Array.isArray(data.socials)) {
        setSocials(data.socials);
      }
    } catch (err) {
      console.error('Failed to load contact data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Save Contact Coordinates (Address, 2 Phone Numbers, Gmail)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateContactSettingsAction({
      address: contact.address.trim(),
      phone: contact.phone.trim(),
      phone_secondary: contact.phone_secondary.trim(),
      email: contact.email.trim(),
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Contact details saved and updated on website successfully!' });
      await fetchData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save contact settings.' });
    }
    setSaving(false);
  };

  // Add Social Profile
  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform.trim() || !newUrl.trim()) return;

    setAddingSocial(true);
    setMessage(null);

    const result = await upsertSocialLinkAction({
      platform: newPlatform.trim(),
      url: newUrl.trim(),
      sort_order: socials.length + 1,
      is_active: true,
    });

    if (result.success) {
      setMessage({ type: 'success', text: `Added ${newPlatform.trim()} link.` });
      setNewPlatform('');
      setNewUrl('');
      await fetchData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add social link.' });
    }
    setAddingSocial(false);
  };

  // Delete Social Profile
  const handleDeleteSocial = async (id: string, platform: string) => {
    if (!confirm(`Are you sure you want to delete the ${platform} link?`)) return;

    const result = await deleteSocialLinkAction(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Social profile removed.' });
      await fetchData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete.' });
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
        title="Contact & Social Media Settings"
        description="Configure your official address, 2 contact phone numbers, Gmail, and social media handles"
      />

      <main className="p-6 md:p-8 max-w-4xl space-y-8">
        {/* Feedback Alert */}
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

        {/* 1. Contact Information Form (Address, 2 Phone Numbers, Gmail) */}
        <form
          onSubmit={handleContactSubmit}
          className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#67238A]" />
              <span>Official Contact Coordinates</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details are displayed on the public Contact page, Homepage admissions section, and website footer.
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
              Academy Address
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Near Corporation Stadium, Beach Road, Calicut, Kerala 673001"
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A] transition-colors"
            />
          </div>

          {/* 2 Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#67238A]" />
                <span>Phone Number 1 (Primary)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. +91 70258 10722"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#67238A]" />
                <span>Phone Number 2 (Secondary)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. +91 95624 46611"
                value={contact.phone_secondary}
                onChange={(e) => setContact({ ...contact, phone_secondary: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A] transition-colors"
              />
            </div>
          </div>

          {/* Gmail / Email */}
          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#67238A]" />
              <span>Gmail / Official Email</span>
            </label>
            <input
              type="email"
              placeholder="e.g. growingfitofficial@gmail.com"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A] transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all disabled:opacity-60 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Contact Details</span>
            </button>
          </div>
        </form>

        {/* 2. Social Media Links Section */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#67238A]" />
              <span>Social Media Channels</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add your official social media profile URLs (Instagram, YouTube, Facebook, WhatsApp, etc.).
            </p>
          </div>

          {/* Add Social Link Form */}
          <form onSubmit={handleAddSocial} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Platform
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Instagram, YouTube, Facebook"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Profile URL
              </label>
              <input
                required
                type="url"
                placeholder="https://instagram.com/growingfit"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={addingSocial}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-[#172033] hover:bg-black text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {addingSocial ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Add Social</span>
              </button>
            </div>
          </form>

          {/* Added Social Links List */}
          <div className="pt-2">
            {socials.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <Globe className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No social links added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Use the form above to add your official social profiles.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E8E8EC]">
                {socials.map((s) => (
                  <div key={s.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#172033]">{s.platform}</h4>
                      </div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#67238A] hover:underline truncate block flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate">{s.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSocial(s.id, s.platform)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove social link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
