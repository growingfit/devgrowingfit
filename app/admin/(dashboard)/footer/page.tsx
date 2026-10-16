'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/client';
import { updateFooterSettingsAction } from '@/lib/actions/cms';
import { FooterSettings } from '@/types/database';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [footer, setFooter] = useState<Partial<FooterSettings>>({
    brand_description: 'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow.',
    copyright_text: '© 2024 Growing Fit. All rights reserved.',
    privacy_policy_url: '/privacy-policy',
    terms_conditions_url: '/terms-conditions',
  });

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data } = await supabase.from('footer_settings').select('*').eq('id', 1).single();
      if (data) setFooter(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateFooterSettingsAction(footer);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Footer settings updated.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update footer.' });
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
        title="Footer & Legal Pages CMS"
        description="Manage brand description, copyright notices, and legal policies"
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
          <h2 className="text-base font-bold text-[#172033]">Footer Settings</h2>

          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
              Brand Mission Description *
            </label>
            <textarea
              required
              rows={3}
              value={footer.brand_description || ''}
              onChange={(e) => setFooter({ ...footer, brand_description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
              Copyright Text *
            </label>
            <input
              required
              type="text"
              value={footer.copyright_text || ''}
              onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Privacy Policy URL
              </label>
              <input
                type="text"
                value={footer.privacy_policy_url || ''}
                onChange={(e) => setFooter({ ...footer, privacy_policy_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Terms &amp; Conditions URL
              </label>
              <input
                type="text"
                value={footer.terms_conditions_url || ''}
                onChange={(e) => setFooter({ ...footer, terms_conditions_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-6 py-3 rounded-full shadow transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Footer Settings</span>
          </button>
        </form>
      </main>
    </>
  );
}
