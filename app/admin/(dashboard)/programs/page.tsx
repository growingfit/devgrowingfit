'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { createClient } from '@/lib/supabase/client';
import { upsertProgramAction, deleteProgramAction } from '@/lib/actions/cms';
import { SportsProgram } from '@/types/database';
import { Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<SportsProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    image_public_id: '',
    sort_order: 1,
    is_published: true,
  });

  const fetchPrograms = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('sports_programs').select('*').order('sort_order', { ascending: true });
    if (data) setPrograms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleEdit = (p: SportsProgram) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      image_url: p.image_url || '',
      image_public_id: p.image_public_id || '',
      sort_order: p.sort_order,
      is_published: p.is_published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      image_public_id: '',
      sort_order: programs.length + 1,
      is_published: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await upsertProgramAction({
      id: editingId || undefined,
      ...form,
    });

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Program saved.' });
      handleReset();
      await fetchPrograms();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save program.' });
    }
    setSaving(false);
  };

  const handleDelete = async (p: SportsProgram) => {
    if (!confirm(`Are you sure you want to remove "${p.name}"?`)) return;
    setSaving(true);
    const result = await deleteProgramAction(p.id, p.image_public_id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Program removed.' });
      await fetchPrograms();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete program.' });
    }
    setSaving(false);
  };

  return (
    <>
      <AdminHeader
        title="Sports Programs CMS"
        description="Manage detailed academy programs (Kung Fu, Muay Thai, Boxing, Swimming, Wushu)"
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
              {editingId ? 'Edit Program' : 'Add New Sports Program'}
            </h2>
            {editingId && (
              <button type="button" onClick={handleReset} className="text-xs text-[#67238A] font-semibold hover:underline">
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Program Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Kung Fu"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  setForm({ ...form, name, slug: editingId ? form.slug : slug });
                }}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">URL Slug *</label>
              <input
                required
                type="text"
                placeholder="e.g. kung-fu"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
            />
          </div>

          <ImageUploader
            label="Optional Program Photograph (Cloudinary)"
            value={form.image_url}
            publicId={form.image_public_id}
            onChange={(url, publicId) => setForm({ ...form, image_url: url, image_public_id: publicId || '' })}
          />

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
                <span className="text-sm font-semibold text-[#172033]">Published on Website</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-6 py-3 rounded-full shadow transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{editingId ? 'Update Program' : 'Save Program'}</span>
          </button>
        </form>

        {/* Existing Programs Table */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#E8E8EC]">
            <h2 className="text-base font-bold text-[#172033]">Existing Programs ({programs.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFC] border-b border-[#E8E8EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                  <th className="py-3 px-6">Program Name</th>
                  <th className="py-3 px-6">Slug</th>
                  <th className="py-3 px-6">Order</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8EC] text-sm text-[#172033]">
                {programs.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAFC] transition-colors">
                    <td className="py-3 px-6 font-bold">{p.name}</td>
                    <td className="py-3 px-6 text-slate-500 font-mono text-xs">{p.slug}</td>
                    <td className="py-3 px-6 font-semibold">{p.sort_order}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right space-x-2">
                      <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg text-slate-600 hover:text-[#67238A] hover:bg-purple-50 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
