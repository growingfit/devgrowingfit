'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/client';
import { updateSiteSettingsAction } from '@/lib/actions/cms';
import { SiteSettings } from '@/types/database';
import { Save, CheckCircle2, AlertCircle, Loader2, KeyRound, ShieldAlert } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    site_title: 'Growing Fit — School of Health & Physical Education',
    meta_description: 'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow.',
    phone: '+91 702 581 0722',
    email: 'growingfitofficial@gmail.com',
    address: 'Calicut & Kochi, Kerala, India',
    whatsapp_url: 'https://wa.me/917025810722',
    is_maintenance: false,
  });

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) setSettings(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateSiteSettingsAction(settings);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Global site settings saved.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings.' });
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
        title="Site Settings & Admin Access"
        description="Global website configuration, SEO metadata, and admin access control"
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
          <h2 className="text-base font-bold text-[#172033]">Global Site SEO &amp; Meta</h2>

          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
              Website Title *
            </label>
            <input
              required
              type="text"
              value={settings.site_title || ''}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
              Meta SEO Description *
            </label>
            <textarea
              required
              rows={3}
              value={settings.meta_description || ''}
              onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:border-[#67238A]"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.is_maintenance ?? false}
                onChange={(e) => setSettings({ ...settings, is_maintenance: e.target.checked })}
                className="w-4 h-4 text-[#67238A] rounded border-gray-300 focus:ring-[#67238A]"
              />
              <div>
                <span className="text-sm font-semibold text-[#172033] block">Maintenance Mode</span>
                <span className="text-xs text-[#667085]">When enabled, visitors see a friendly maintenance message</span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#67238A] hover:bg-[#521A6E] text-white font-semibold text-sm px-6 py-3 rounded-full shadow transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Global Settings</span>
          </button>
        </form>

        {/* Administrator Bootstrap Guide */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-[#172033]">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#67238A] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Admin User Bootstrap Process</h2>
              <p className="text-xs text-[#667085]">How to create and authorize an administrator in Supabase</p>
            </div>
          </div>

          <div className="bg-[#FAFAFC] border border-[#E8E8EC] rounded-xl p-5 space-y-3 text-xs text-[#172033] leading-relaxed">
            <p className="font-semibold text-slate-800">
              To create an administrator account without exposing credentials:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-[#667085]">
              <li>Open your <strong>Supabase Dashboard &rarr; Authentication &rarr; Users</strong>.</li>
              <li>Click <strong>&ldquo;Add user&rdquo; &rarr; &ldquo;Create user&rdquo;</strong> with your chosen administrator email and secure password.</li>
              <li>Copy the generated user <code>UUID</code>.</li>
              <li>
                In the Supabase SQL Editor, run:
                <pre className="mt-2 p-3 bg-[#172033] text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`INSERT INTO public.admin_users (id, email, full_name, role)
VALUES ('<PASTE-USER-UUID-HERE>', 'your-email@growingfit.com', 'Academy Director', 'super_admin')
ON CONFLICT (id) DO NOTHING;`}
                </pre>
              </li>
              <li>Now log in at <code>/admin/login</code> with that email and password.</li>
            </ol>
          </div>
        </div>
      </main>
    </>
  );
}
