'use client';

import React, { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanEmail = email.trim();
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('email not confirmed')) {
          throw new Error(
            'Email not confirmed. In Supabase Dashboard > Authentication > Users, click the user and select "Confirm email", or disable "Confirm email" in Auth settings.'
          );
        }
        throw new Error(authError.message || 'Invalid administrator credentials.');
      }

      if (data.session || data.user) {
        // Force full page navigation so cookies are synchronously sent with HTTP headers
        window.location.href = redirectTo;
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#E8E8EC] rounded-2xl p-8 sm:p-10 shadow-lg">
        <div className="flex flex-col items-center text-center mb-8">
          <BrandLogo className="h-12 w-auto mb-4" />
          <h1 className="text-xl font-bold text-[#172033]">Admin Portal Login</h1>
          <p className="text-xs text-[#667085] mt-1">
            Sign in with authorized administrator credentials
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700 leading-relaxed">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@growingfit.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#67238A]/20 focus:border-[#67238A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E8EC] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#67238A]/20 focus:border-[#67238A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-[#67238A] hover:bg-[#521A6E] disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
