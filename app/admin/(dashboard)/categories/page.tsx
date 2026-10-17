'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  getCategoriesAction,
  upsertCategoryAction,
  deleteCategoryAction,
  clearAllCategoriesAction,
  toggleCategoryActiveAction,
  syncCategoriesCacheAction,
} from '@/lib/actions/cms';
import { SportsCategory } from '@/types/database';
import { getSportIconUrl } from '@/lib/sports';
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  UploadCloud,
  ImageIcon,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<SportsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewSliding, setPreviewSliding] = useState(true);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    icon: '',
    sort_order: 1,
    is_active: true,
  });

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesAction();
      if (data && Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories in admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    const safetyTimer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(safetyTimer);
  }, []);

  const handleEdit = (category: SportsCategory) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm({
      name: '',
      slug: '',
      icon: '',
      sort_order: categories.length + 1,
      is_active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.icon) {
      setMessage({ type: 'error', text: 'Please upload or provide an image for this category.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const result = await upsertCategoryAction({
      id: editingId || undefined,
      ...form,
    });

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Category saved successfully.' });
      handleReset();
      await fetchCategories();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save category.' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    setSaving(true);
    const result = await deleteCategoryAction(id);
    if (result.success) {
      setMessage({ type: 'success', text: `Category "${name}" removed.` });
      await fetchCategories();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete.' });
    }
    setSaving(false);
  };

  const handleClearAll = async () => {
    if (
      !confirm(
        'Are you sure you want to delete ALL current categories in the database? This cannot be undone.'
      )
    ) {
      return;
    }
    setClearing(true);
    setMessage(null);
    const result = await clearAllCategoriesAction();
    if (result.success) {
      setMessage({ type: 'success', text: 'All categories cleared from database.' });
      await fetchCategories();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to clear categories.' });
    }
    setClearing(false);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const result = await toggleCategoryActiveAction(id, !currentStatus);
    if (result.success) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c))
      );
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to toggle status.' });
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const currentCat = categories[index];
    const targetCat = categories[targetIndex];

    const currentOrder = currentCat.sort_order;
    const targetOrder = targetCat.sort_order;

    setSaving(true);
    await Promise.all([
      upsertCategoryAction({ ...currentCat, sort_order: targetOrder }),
      upsertCategoryAction({ ...targetCat, sort_order: currentOrder }),
    ]);

    await fetchCategories();
    setSaving(false);
  };

  return (
    <>
      <AdminHeader
        title="Sports Categories CMS"
        description="Add and manage sports categories. Drag and drop custom category images, customize ordering, and toggle visibility on the homepage slider."
      />

      <main className="p-6 sm:p-8 max-w-6xl space-y-8">
        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Live Frontend Design Preview (Box-Free Slider Preview) */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8E8EC]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-[#172033]">
                  Live Website Slider Preview (Box-Free Minimal Design)
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Transparent category graphics with clean typography directly beneath, exactly as displayed on the live homepage.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewSliding(!previewSliding)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E8E8EC] text-slate-600 hover:border-[#67238A] hover:text-[#67238A] transition-colors cursor-pointer"
              >
                {previewSliding ? 'Pause Slide Preview' : 'Enable Slide Preview'}
              </button>

              {categories.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={clearing}
                  className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all disabled:opacity-60 cursor-pointer"
                  title="Remove all categories to start fresh"
                >
                  {clearing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  )}
                  <span>Clear All Categories</span>
                </button>
              )}
            </div>
          </div>

          {/* Minimal Box-free Slider Preview */}
          <div className="overflow-hidden relative py-6 bg-white rounded-2xl border border-[#E8E8EC]">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="overflow-x-auto no-scrollbar">
              <div
                className={`flex items-center gap-8 sm:gap-10 px-6 ${
                  previewSliding ? 'animate-sports-slide' : 'flex-wrap'
                }`}
              >
                {categories.filter((c) => c.is_active).length === 0 ? (
                  <div className="py-8 text-center w-full text-slate-400 text-xs">
                    No active categories found in database. Add a category below using the drag-and-drop uploader!
                  </div>
                ) : (
                  (previewSliding && categories.filter((c) => c.is_active).length > 2
                    ? [...categories.filter((c) => c.is_active), ...categories.filter((c) => c.is_active)]
                    : categories.filter((c) => c.is_active)
                  ).map((c, idx) => (
                    <div
                      key={`${c.id}-${idx}`}
                      className="flex-shrink-0 flex flex-col items-center justify-center text-center select-none py-1 w-[90px] sm:w-[105px]"
                    >
                      <div className="h-[58px] flex items-center justify-center">
                        <img
                          src={getSportIconUrl(c.icon, c.slug)}
                          alt={c.name}
                          className="h-full w-auto max-w-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#172033] mt-2 whitespace-nowrap">
                        {c.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add / Edit Category Form with Drag & Drop Image Uploader */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E8EC]">
            <div>
              <h2 className="text-base font-bold text-[#172033]">
                {editingId ? 'Edit Sports Category' : 'Add New Sports Category'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Drag and drop your category image (transparent PNG, SVG, or WebP recommended).
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#67238A] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Sport / Category Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Boxing, Swimming, Kung Fu"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                  setForm({ ...form, name, slug: editingId ? form.slug : slug });
                }}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                URL Identifier / Slug *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. boxing, swimming, kung-fu"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          {/* Drag & Drop Category Image Uploader */}
          <div className="space-y-3 p-5 bg-[#FAFAFC] border border-[#E8E8EC] rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <div>
                <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider">
                  Category Image / Icon (Drag & Drop) *
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Drag and drop a transparent PNG, SVG, or WebP image. The image will render cleanly on the white slider background.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="flex-1 w-full max-w-md">
                <ImageUploader
                  label="Category Graphic"
                  value={form.icon}
                  onChange={(url) => setForm({ ...form, icon: url })}
                  folder="growing_fit/categories"
                  aspectRatio="square"
                  fit="contain"
                />
              </div>

              {/* Direct image preview */}
              {form.icon && (
                <div className="flex flex-col items-center justify-center p-4 bg-white border border-[#E8E8EC] rounded-2xl shadow-2xs min-w-[140px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Slider Preview
                  </span>
                  <div className="h-16 flex items-center justify-center">
                    <img
                      src={getSportIconUrl(form.icon, form.slug)}
                      alt="Preview"
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#172033] mt-2 whitespace-nowrap">
                    {form.name || 'Category Name'}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#E8E8EC]">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Or Enter Image URL / Icon Path Manually
              </label>
              <input
                type="text"
                placeholder="e.g. /icons/boxing.svg or https://res.cloudinary.com/.../image.png"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E8E8EC] rounded-lg focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Sort Order Number
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Lower numbers appear first in the sliding sequence.
              </span>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-[#E8E8EC] hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#67238A] rounded border-gray-300 focus:ring-[#67238A]"
                />
                <div>
                  <span className="text-sm font-bold text-[#172033] block">Active on Website</span>
                  <span className="text-[11px] text-slate-500 block">
                    Uncheck to temporarily hide from the homepage without deleting.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-bold text-sm px-6 py-3 rounded-full shadow-md transition-all disabled:opacity-60 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>{editingId ? 'Save Category Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>

        {/* Existing Categories Table */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#E8E8EC] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#172033]">All Sports Categories</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total {categories.length} categories configured (
                {categories.filter((c) => c.is_active).length} active on website).
              </p>
            </div>

            {categories.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                disabled={clearing}
                className="text-xs text-red-600 hover:text-red-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All Categories
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFC] border-b border-[#E8E8EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                  <th className="py-3 px-6">Image</th>
                  <th className="py-3 px-6">Category Name</th>
                  <th className="py-3 px-6">Slug</th>
                  <th className="py-3 px-6">Order</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8EC] text-sm text-[#172033]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Loading sports categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">No categories in database</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Use the drag-and-drop form above to add your first category!
                      </p>
                    </td>
                  </tr>
                ) : (
                  categories.map((c, index) => (
                    <tr key={c.id} className="hover:bg-[#FAFAFC] transition-colors">
                      <td className="py-3 px-6">
                        <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-1.5 overflow-hidden shadow-2xs">
                          <img
                            src={getSportIconUrl(c.icon, c.slug)}
                            alt={c.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-6 font-bold">{c.name}</td>
                      <td className="py-3 px-6 text-slate-500 font-mono text-xs">{c.slug}</td>
                      <td className="py-3 px-6 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span>{c.sort_order}</span>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(index, 'up')}
                              disabled={index === 0 || saving}
                              className="text-slate-400 hover:text-slate-700 disabled:opacity-20 p-0.5 cursor-pointer"
                              title="Move up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(index, 'down')}
                              disabled={index === categories.length - 1 || saving}
                              className="text-slate-400 hover:text-slate-700 disabled:opacity-20 p-0.5 cursor-pointer"
                              title="Move down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(c.id, c.is_active)}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                            c.is_active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {c.is_active ? (
                            <>
                              <Eye className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Hidden
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(c)}
                            className="p-1.5 text-slate-400 hover:text-[#67238A] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id, c.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
