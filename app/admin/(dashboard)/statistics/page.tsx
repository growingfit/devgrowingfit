'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/client';
import { upsertStatisticAction, deleteStatisticAction } from '@/lib/actions/cms';
import { SiteStatistic } from '@/types/database';
import { Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<SiteStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    value: '',
    label: '',
    sort_order: 1,
    is_visible: true,
  });

  const fetchStats = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('site_statistics').select('*').order('sort_order', { ascending: true });
    if (data) setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleEdit = (s: SiteStatistic) => {
    setEditingId(s.id);
    setForm({
      value: s.value,
      label: s.label,
      sort_order: s.sort_order,
      is_visible: s.is_visible,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm({
      value: '',
      label: '',
      sort_order: stats.length + 1,
      is_visible: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await upsertStatisticAction({
      id: editingId || undefined,
      ...form,
    });

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Statistic saved.' });
      handleReset();
      await fetchStats();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save statistic.' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to remove "${label}"?`)) return;
    setSaving(true);
    const result = await deleteStatisticAction(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Statistic deleted.' });
      await fetchStats();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete.' });
    }
    setSaving(false);
  };

  return (
    <>
      <AdminHeader
        title="Statistics CMS"
        description="Manage the 4 key metrics displayed between Vision and Gallery"
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
              {editingId ? 'Edit Metric' : 'Add New Metric'}
            </h2>
            {editingId && (
              <button type="button" onClick={handleReset} className="text-xs text-[#67238A] font-semibold hover:underline">
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Metric Value *</label>
              <input
                required
                type="text"
                placeholder="e.g. 500+ or 95%"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">Metric Label *</label>
              <input
                required
                type="text"
                placeholder="e.g. Happy Students"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
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
                  checked={form.is_visible}
                  onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                  className="w-4 h-4 text-[#67238A] rounded border-gray-300 focus:ring-[#67238A]"
                />
                <span className="text-sm font-semibold text-[#172033]">Visible on Website</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-6 py-3 rounded-full shadow transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{editingId ? 'Update Metric' : 'Save Metric'}</span>
          </button>
        </form>

        {/* Existing Stats Table */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#E8E8EC]">
            <h2 className="text-base font-bold text-[#172033]">Current Statistics</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFC] border-b border-[#E8E8EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                  <th className="py-3 px-6">Value</th>
                  <th className="py-3 px-6">Label</th>
                  <th className="py-3 px-6">Order</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8EC] text-sm text-[#172033]">
                {stats.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAFAFC] transition-colors">
                    <td className="py-3 px-6 font-black text-lg text-[#172033]">{s.value}</td>
                    <td className="py-3 px-6 font-semibold">{s.label}</td>
                    <td className="py-3 px-6">{s.sort_order}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.is_visible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {s.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right space-x-2">
                      <button onClick={() => handleEdit(s)} className="p-1.5 rounded-lg text-slate-600 hover:text-[#67238A] hover:bg-purple-50 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id, s.label)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
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
