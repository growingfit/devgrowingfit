'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Trophy,
  Dumbbell,
  Info,
  Eye,
  BarChart3,
  Image as ImageIcon,
  MessageSquareQuote,
  MapPin,
  PhoneCall,
  PanelBottom,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Hero Banner', href: '/admin/hero', icon: Sparkles },
    { label: 'Categories', href: '/admin/categories', icon: Trophy },
    { label: 'Programs', href: '/admin/programs', icon: Dumbbell },
    { label: 'About Us CMS', href: '/admin/about', icon: Info },
    { label: 'Vision & Mission', href: '/admin/vision', icon: Eye },
    { label: 'Statistics', href: '/admin/statistics', icon: BarChart3 },
    { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Centres', href: '/admin/centres', icon: MapPin },
    { label: 'Contact & Social', href: '/admin/contact', icon: PhoneCall },
    { label: 'Footer & Legal', href: '/admin/footer', icon: PanelBottom },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-[#172033] text-white flex flex-col min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="bg-white px-2 py-1.5 rounded-lg flex items-center justify-center shadow-xs">
            <img src="/growfit logo.png" alt="Growing Fit" className="h-7 w-auto object-contain" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Growing Fit</h2>
            <p className="text-[11px] text-slate-400">Admin CMS</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#67238A] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span>View Website</span>
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
