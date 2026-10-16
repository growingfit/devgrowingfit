'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { createClient } from '@/lib/supabase/client';
import { saveGalleryImageAction, deleteGalleryImageAction } from '@/lib/actions/cms';
import { GalleryImage } from '@/types/database';
import { Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    title: '',
    alt_text: 'Growing Fit Academy Training',
    image_url: '',
    image_public_id: '',
    sort_order: 1,
    is_published: true,
  });

  const fetchGallery = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data) {
      setImages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) {
      setMessage({ type: 'error', text: 'Please upload an image first.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const result = await saveGalleryImageAction(form);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Image added to gallery.' });
      setForm({
        title: '',
        alt_text: 'Growing Fit Academy Training',
        image_url: '',
        image_public_id: '',
        sort_order: images.length + 2,
        is_published: true,
      });
      await fetchGallery();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add image.' });
    }
    setSaving(false);
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm(`Are you sure you want to remove this gallery photo?`)) return;
    setSaving(true);
    const result = await deleteGalleryImageAction(image.id, image.image_public_id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Gallery photo deleted from database and Cloudinary.' });
      await fetchGallery();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete photo.' });
    }
    setSaving(false);
  };

  return (
    <>
      <AdminHeader
        title="Gallery CMS ('Moments That Inspire')"
        description="Upload real academy photographs to Cloudinary and synchronize with Supabase"
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

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
        >
          <h2 className="text-base font-bold text-[#172033]">Upload New Academy Photograph</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Image Title / Caption
              </label>
              <input
                type="text"
                placeholder="e.g. Traditional Kung Fu Kata"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Accessibility Alt Text *
              </label>
              <input
                required
                type="text"
                value={form.alt_text}
                onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          {/* Cloudinary Uploader */}
          <ImageUploader
            label="Upload Academy Image (Cloudinary)"
            value={form.image_url}
            publicId={form.image_public_id}
            onChange={(url, publicId) =>
              setForm({ ...form, image_url: url, image_public_id: publicId || '' })
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Display Order
              </label>
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
                <span className="text-sm font-semibold text-[#172033]">Published in Live Gallery</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-6 py-3 rounded-full shadow transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Add to Gallery</span>
          </button>
        </form>

        {/* Existing Gallery Images Grid */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#172033] mb-4">
            Current Gallery Photographs ({images.length})
          </h2>

          {images.length === 0 ? (
            <p className="text-xs text-[#667085] py-4">
              No gallery images uploaded yet. Use the upload box above to add your first photo.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative rounded-xl overflow-hidden border border-[#E8E8EC] bg-slate-50 aspect-[4/3]"
                >
                  <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <span className="text-[11px] text-white font-medium truncate">
                      {img.title || 'Academy Photo'}
                    </span>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(img)}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                        title="Delete from Cloudinary & Database"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
