'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Globe } from 'lucide-react';
import { FooterSettings, ContactSettings, Centre, SocialLink } from '@/types/database';

interface FooterProps {
  footerSettings?: FooterSettings | null;
  contactSettings?: ContactSettings | null;
  centres?: Centre[];
  socialLinks?: SocialLink[];
}

function getSocialIcon(platform: string) {
  const p = (platform || '').toLowerCase();
  if (p.includes('facebook') || p.includes('fb')) return <Facebook className="w-4 h-4" />;
  if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4" />;
  if (p.includes('instagram') || p.includes('insta')) return <Instagram className="w-4 h-4" />;
  if (p.includes('youtube') || p.includes('yt')) return <Youtube className="w-4 h-4" />;
  if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
}

export function Footer({
  footerSettings,
  socialLinks = [],
}: FooterProps) {
  const brandDescription = footerSettings?.brand_description?.trim() || '';

  const copyrightText =
    footerSettings?.copyright_text || '© 2026 Growing Fit. All rights reserved.';
  const privacyUrl = footerSettings?.privacy_policy_url || '/privacy-policy';
  const termsUrl = footerSettings?.terms_conditions_url || '/terms-conditions';

  const activeSocials = (socialLinks || []).filter(
    (s) => s && s.is_active !== false && s.url && s.url.trim() !== ''
  );

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'School', href: '/schools' },
    { label: 'About Us', href: '/about' },
    { label: 'Mission & Vision', href: '/about#vision' },
  ];

  const secondaryLinks = [
    { label: 'CONTACT US', href: '/contact' },
    { label: 'CAREERS', href: '/contact#careers' },
  ];

  return (
    <footer className="w-full bg-[#0E1014] text-white pt-14 sm:pt-16 pb-8 border-t border-slate-900">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand Logo & Description (Span 5 on Desktop) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/growingfit-whitelogo.png"
                alt="Growing Fit"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>

            {brandDescription && (
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md font-normal">
                {brandDescription}
              </p>
            )}
          </div>

          {/* Column 2: Navigation Links (Span 2 on Desktop) */}
          <div className="lg:col-span-2 space-y-3">
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Careers (Span 2 on Desktop) */}
          <div className="lg:col-span-2 space-y-3">
            <ul className="space-y-2.5 text-xs sm:text-sm font-bold tracking-wider">
              {secondaryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-200 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social Links (Span 3 on Desktop) */}
          {activeSocials.length > 0 && (
            <div className="lg:col-span-3 space-y-4">
              <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-200 block uppercase">
                Follow Us
              </span>
              {/* Dynamic Social Media Links */}
              <div className="flex items-center flex-wrap gap-4 pt-1 text-slate-300">
                {activeSocials.map((item) => (
                  <a
                    key={item.id || item.platform}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.platform}
                    className="hover:text-white transition-colors"
                  >
                    {getSocialIcon(item.platform)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Copyright and Crafted by ekodrix */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>{copyrightText}</p>
          <p className="text-xs text-slate-400 font-medium">
            Crafted by <span className="text-white font-semibold tracking-wide">ekodrix</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
