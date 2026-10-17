'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  getContactAction,
  updateContactSettingsAction,
  upsertSocialLinkAction,
  deleteSocialLinkAction,
  getCentresAction,
  upsertCentreAction,
  deleteCentreAction,
} from '@/lib/actions/cms';
import { ContactSettings, SocialLink, Centre } from '@/types/database';
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<'centres' | 'contact'>('centres');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Contact State
  const [contact, setContact] = useState<Partial<ContactSettings>>({
    phone: '+91 702 581 0722',
    email: 'growingfitofficial@gmail.com',
    whatsapp: 'https://wa.me/917025810722',
    headquarters: 'Calicut & Kochi, Kerala, India',
    opening_hours: 'Monday - Saturday: 6:00 AM - 7:30 PM',
  });

  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Centres State
  const [centres, setCentres] = useState<Centre[]>([]);
  const [editingCentreId, setEditingCentreId] = useState<string | null>(null);
  const [centreForm, setCentreForm] = useState({
    name: '',
    address: '',
    map_url: '',
    phone: '',
    sort_order: 1,
    is_published: true,
  });

  const fetchData = async () => {
    try {
      const [contactData, centresData] = await Promise.all([
        getContactAction(),
        getCentresAction(),
      ]);

      if (contactData?.contact) setContact((prev) => ({ ...prev, ...contactData.contact }));
      if (contactData?.socials && Array.isArray(contactData.socials)) setSocials(contactData.socials);
      if (centresData && Array.isArray(centresData)) setCentres(centresData);
    } catch (err) {
      console.error('Failed to load contact data in admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const safetyTimer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(safetyTimer);
  }, []);

  // Contact Coordinates Form Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateContactSettingsAction(contact);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Contact settings updated.' });
      await fetchData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update.' });
    }
    setSaving(false);
  };

  // Add Social Profile
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

  // Delete Social Profile
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

  // Centres CRUD Handlers
  const handleEditCentre = (c: Centre) => {
    setEditingCentreId(c.id);
    setCentreForm({
      name: c.name,
      address: c.address || '',
      map_url: c.map_url || '',
      phone: c.phone || '',
      sort_order: c.sort_order,
      is_published: c.is_published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetCentreForm = () => {
    setEditingCentreId(null);
    setCentreForm({
      name: '',
      address: '',
      map_url: '',
      phone: '',
      sort_order: centres.length + 1,
      is_published: true,
    });
  };

  const handleCentreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await upsertCentreAction({
      id: editingCentreId || undefined,
      ...centreForm,
    });

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Centre saved successfully.' });
      handleResetCentreForm();
      await fetchData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save centre.' });
    }
    setSaving(false);
  };

  const handleDeleteCentre = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove centre "${name}"?`)) return;
    setSaving(true);
    const result = await deleteCentreAction(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Centre removed.' });
      await fetchData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete centre.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#E11D2A] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Contact & Training Centres CMS"
        description="Manage physical training centres, phone hotlines, email, office location, and social links"
      />

      <main className="p-6 md:p-8 max-w-5xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('centres')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'centres'
                ? 'bg-[#172033] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>1. Training Centres &amp; Locations ({centres.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'contact'
                ? 'bg-[#172033] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>2. General Hotlines &amp; Social</span>
          </button>
        </div>

        {/* Message Banner */}
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

        {/* TAB 1: TRAINING CENTRES */}
        {activeTab === 'centres' && (
          <div className="space-y-6">
            {/* Add / Edit Centre Form */}
            <form onSubmit={handleCentreSubmit} className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#172033]">
                    {editingCentreId ? 'Edit Training Centre' : 'Add New Training Centre'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Training centres are prominently displayed in the Contact section on the website.
                  </p>
                </div>
                {editingCentreId && (
                  <button
                    type="button"
                    onClick={handleResetCentreForm}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                    Centre Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Calicut Main Hub"
                    value={centreForm.name}
                    onChange={(e) => setCentreForm({ ...centreForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 702 581 0722"
                    value={centreForm.phone}
                    onChange={(e) => setCentreForm({ ...centreForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                  Complete Physical Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Beach Road, Near Corporation Stadium, Calicut, Kerala 673001"
                  value={centreForm.address}
                  onChange={(e) => setCentreForm({ ...centreForm, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/?q=..."
                    value={centreForm.map_url}
                    onChange={(e) => setCentreForm({ ...centreForm, map_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={centreForm.sort_order}
                    onChange={(e) => setCentreForm({ ...centreForm, sort_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={centreForm.is_published}
                    onChange={(e) => setCentreForm({ ...centreForm, is_published: e.target.checked })}
                    className="rounded text-[#E11D2A] focus:ring-[#E11D2A]"
                  />
                  <span>Published on Website</span>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-xs transition-all disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingCentreId ? 'Update Centre' : 'Save New Centre'}</span>
                </button>
              </div>
            </form>

            {/* List of Active Centres */}
            <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-[#172033]">Active Training Centres ({centres.length})</h3>

              {centres.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No centres added yet. Use the form above to add your first centre.</p>
              ) : (
                <div className="divide-y divide-[#E8E8EC]">
                  {centres.map((c) => (
                    <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#172033]">{c.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {c.is_published ? 'Published' : 'Hidden'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{c.address}</p>
                        {c.phone && <p className="text-xs text-slate-500">Phone: {c.phone}</p>}
                        {c.map_url && (
                          <a href={c.map_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[#E11D2A] hover:underline">
                            <ExternalLink className="w-3 h-3" />
                            <span>View Google Maps</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleEditCentre(c)}
                          className="p-2 text-slate-600 hover:text-black rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit Centre"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCentre(c.id, c.name)}
                          className="p-2 text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Centre"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GENERAL CONTACT COORDINATES & SOCIAL */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <form onSubmit={handleContactSubmit} className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-base font-bold text-[#172033]">Contact Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Phone Number *</label>
                  <input
                    required
                    type="text"
                    value={contact.phone || ''}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={contact.email || ''}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
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
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Headquarters</label>
                  <input
                    type="text"
                    value={contact.headquarters || ''}
                    onChange={(e) => setContact({ ...contact, headquarters: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Operating Hours</label>
                <input
                  type="text"
                  value={contact.opening_hours || ''}
                  onChange={(e) => setContact({ ...contact, opening_hours: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-xs transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Contact Settings</span>
              </button>
            </form>

            {/* Social Links CRUD */}
            <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
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
                    className="w-full px-4 py-2 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
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
                    className="w-full px-4 py-2 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#E11D2A]"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#172033] hover:bg-black text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all"
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
                      <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-black hover:underline">
                        {s.url}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeleteSocial(s.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
