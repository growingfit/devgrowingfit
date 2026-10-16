'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/client';
import {
  updateContactSettingsAction,
  upsertSocialLinkAction,
  deleteSocialLinkAction,
} from '@/lib/actions/cms';
import { ContactSettings, SocialLink } from '@/types/database';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [contact, setContact] = useState<Partial<ContactSettings>>({
    phone: '+91 702 581 0722',
    email: 'growingfitofficial@gmail.com',
    whatsapp: 'https://wa.me/917025810722',
    headquarters: 'Calicut & Kochi, Kerala, India',
    opening_hours: 'Monday - Saturday: 6:00 AM - 7:00 PM',
  });

  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const fetchData = async () => {
    const supabase = createClient();
    const [contactRes, socialRes] = await Promise.all([
      supabase.from('contact_settings').select('*').eq('id', 1).single(),
      supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
    ]);

    if (contactRes.data) setContact(contactRes.data);
    if (socialRes.data) setSocials(socialRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateContactSettingsAction(contact);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Contact settings updated.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update.' });
    }
    setSaving(false);
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform || !newUrl) return;
    setSaving(true);

    const result = await upsertSocialLinkAction({
      platform: newPlatform,
      url: newUrl,
      sort_order: socials.length + 1,
      is_active: true,
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Social profile added.' });
      setNewPlatform('');
      setNewUrl('');
      await fetchData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add social link.' });
    }
    setSaving(false);
  };

  const handleDeleteSocial = async (id: string) => {
    if (!confirm('Remove this social media link?')) return;
    setSaving(true);
    const result = await deleteSocialLinkAction(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Social link removed.' });
      await fetchData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete.' });
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
        title="Contact & Social Profiles CMS"
        description="Manage official phone number, email, address, and social links"
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

        <form onSubmit={handleContactSubmit} className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-[#172033]">Contact Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Phone Number *</label>
              <input
                required
                type="text"
                value={contact.phone || ''}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Email Address *</label>
              <input
                required
                type="email"
                value={contact.email || ''}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">WhatsApp Link</label>
              <input
                type="text"
                value={contact.whatsapp || ''}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Headquarters</label>
              <input
                type="text"
                value={contact.headquarters || ''}
                onChange={(e) => setContact({ ...contact, headquarters: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Operating Hours</label>
            <input
              type="text"
              value={contact.opening_hours || ''}
              onChange={(e) => setContact({ ...contact, opening_hours: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-6 py-3 rounded-full shadow transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Contact Settings</span>
          </button>
        </form>

        {/* Social Links CRUD */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-[#172033]">Social Media Profiles</h2>

          <form onSubmit={handleAddSocial} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Platform</label>
              <input
                required
                type="text"
                placeholder="e.g. Instagram"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Profile URL</label>
              <input
                required
                type="url"
                placeholder="https://instagram.com/growingfit"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm py-2.5 rounded-xl shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Profile</span>
              </button>
            </div>
          </form>

          <div className="divide-y divide-[#E8E8EC] pt-4">
            {socials.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">{s.platform}</h4>
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-[#67238A] hover:underline">
                    {s.url}
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteSocial(s.id)}
                  className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
