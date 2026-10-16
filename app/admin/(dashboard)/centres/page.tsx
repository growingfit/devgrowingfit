'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/client';
import { upsertCentreAction, deleteCentreAction } from '@/lib/actions/cms';
import { Centre } from '@/types/database';
import { Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminCentresPage() {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    address: '',
    map_url: '',
    phone: '',
    sort_order: 1,
    is_published: true,
  });

  const fetchCentres = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('centres').select('*').order('sort_order', { ascending: true });
    if (data) setCentres(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCentres();
  }, []);

  const handleEdit = (c: Centre) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      address: c.address || '',
      map_url: c.map_url || '',
      phone: c.phone || '',
      sort_order: c.sort_order,
      is_published: c.is_published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm({
      name: '',
      address: '',
      map_url: '',
      phone: '',
      sort_order: centres.length + 1,
      is_published: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await upsertCentreAction({
      id: editingId || undefined,
      ...form,
    });

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Centre saved.' });
      handleReset();
      await fetchCentres();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save centre.' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove centre "${name}"?`)) return;
    setSaving(true);
    const result = await deleteCentreAction(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Centre removed.' });
      await fetchCentres();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete centre.' });
    }
    setSaving(false);
  };

  return (
    <>
      <AdminHeader
        title="Training Centres CMS"
        description="Manage physical academy training centres (Calicut, Kochi, Bangalore, Mumbai)"
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

        <form onSubmit={handleSubmit} className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172033]">
              {editingId ? 'Edit Centre Location' : 'Add New Training Centre'}
            </h2>
            {editingId && (
              <button type="button" onClick={handleReset} className="text-xs text-[#67238A] font-semibold hover:underline">
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Centre Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Calicut Centre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">City / Location *</label>
              <input
                required
                type="text"
                placeholder="e.g. Calicut, Kerala"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Optional Map URL</label>
              <input
                type="url"
                placeholder="https://maps.google.com/..."
                value={form.map_url}
                onChange={(e) => setForm({ ...form, map_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Centre Phone</label>
              <input
                type="text"
                placeholder="+91 702 581 0722"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div className="pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="w-4 h-4 text-[#67238A] rounded border-gray-300 focus:ring-[#67238A]"
                />
                <span className="text-sm font-semibold text-[#172033]">Active / Published on Website</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-6 py-3 rounded-full shadow transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{editingId ? 'Update Centre' : 'Save Centre'}</span>
          </button>
        </form>

        {/* Existing Centres */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#E8E8EC]">
            <h2 className="text-base font-bold text-[#172033]">Configured Training Centres ({centres.length})</h2>
          </div>

          <div className="divide-y divide-[#E8E8EC]">
            {centres.map((c) => (
              <div key={c.id} className="p-5 flex items-center justify-between hover:bg-[#FAFAFC] transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-[#172033]">{c.name}</h4>
                  <p className="text-xs text-[#667085]">{c.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(c)} className="p-1.5 rounded-lg text-slate-600 hover:text-[#67238A] hover:bg-purple-50 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
