'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { createClient } from '@/lib/supabase/client';
import { upsertTestimonialAction, deleteTestimonialAction } from '@/lib/actions/cms';
import { Testimonial } from '@/types/database';
import { Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    quote: '',
    author_name: '',
    author_title: 'Parent',
    avatar_url: '',
    avatar_public_id: '',
    rating: 5,
    sort_order: 1,
    is_published: true,
  });

  const fetchTestimonials = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
    if (data) setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      quote: t.quote,
      author_name: t.author_name,
      author_title: t.author_title,
      avatar_url: t.avatar_url || '',
      avatar_public_id: t.avatar_public_id || '',
      rating: t.rating,
      sort_order: t.sort_order,
      is_published: t.is_published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm({
      quote: '',
      author_name: '',
      author_title: 'Parent',
      avatar_url: '',
      avatar_public_id: '',
      rating: 5,
      sort_order: testimonials.length + 1,
      is_published: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await upsertTestimonialAction({
      id: editingId || undefined,
      ...form,
    });

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Testimonial saved.' });
      handleReset();
      await fetchTestimonials();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save testimonial.' });
    }
    setSaving(false);
  };

  const handleDelete = async (t: Testimonial) => {
    if (!confirm(`Are you sure you want to remove review from "${t.author_name}"?`)) return;
    setSaving(true);
    const result = await deleteTestimonialAction(t.id, t.avatar_public_id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Testimonial removed.' });
      await fetchTestimonials();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete.' });
    }
    setSaving(false);
  };

  return (
    <>
      <AdminHeader
        title="Testimonials CMS ('What Parents Say')"
        description="Manage parent feedback, ratings, and quotes displayed on the homepage"
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
              {editingId ? 'Edit Parent Testimonial' : 'Add New Parent Testimonial'}
            </h2>
            {editingId && (
              <button type="button" onClick={handleReset} className="text-xs text-[#67238A] font-semibold hover:underline">
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Author Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Fazilulla M"
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Role / Title *</label>
              <input
                required
                type="text"
                placeholder="e.g. Parent"
                value={form.author_title}
                onChange={(e) => setForm({ ...form, author_title: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Parent Review Quote *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Growing Fit has been an amazing place for my child..."
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
            />
          </div>

          <ImageUploader
            label="Optional Parent Photo / Avatar (Cloudinary)"
            value={form.avatar_url}
            publicId={form.avatar_public_id}
            onChange={(url, publicId) => setForm({ ...form, avatar_url: url, avatar_public_id: publicId || '' })}
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
            <span>{editingId ? 'Update Testimonial' : 'Save Testimonial'}</span>
          </button>
        </form>

        {/* Existing Testimonials */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#E8E8EC]">
            <h2 className="text-base font-bold text-[#172033]">Existing Testimonials ({testimonials.length})</h2>
          </div>

          <div className="divide-y divide-[#E8E8EC]">
            {testimonials.map((t) => (
              <div key={t.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAFC] transition-colors">
                <div className="space-y-1 max-w-2xl">
                  <p className="text-sm italic text-[#172033]">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-xs font-bold text-[#67238A]">{t.author_name} — <span className="text-slate-500 font-normal">{t.author_title}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(t)} className="p-1.5 rounded-lg text-slate-600 hover:text-[#67238A] hover:bg-purple-50 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
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
