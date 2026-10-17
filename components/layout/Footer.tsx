'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { FooterSettings, ContactSettings, Centre, SocialLink } from '@/types/database';

interface FooterProps {
  footerSettings?: FooterSettings | null;
  contactSettings?: ContactSettings | null;
  centres?: Centre[];
  socialLinks?: SocialLink[];
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

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'School', href: '/schools' },
    { label: 'Corporate', href: '/corporate' },
    { label: 'Academy', href: '/academy' },
    { label: 'Store', href: '/store' },
  ];

  const secondaryLinks = [
    { label: 'CONTACT US', href: '/contact' },
    { label: 'CAREERS', href: '/contact#careers' },
    { label: 'About Us', href: '/about' },
    { label: 'Mission & Vision', href: '/about#vision' },
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

          {/* Column 4: App Badges & Social Links (Span 3 on Desktop) */}
          <div className="lg:col-span-3 space-y-5">
            {/* App Store & Google Play Badges */}
            <div className="space-y-2.5">
              {/* App Store Badge */}
              <a
                href="#app-store"
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-black/60 hover:bg-slate-800 transition-colors w-[150px]"
              >
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.87.94-2.96-1 .04-2.17.65-2.81 1.43-.58.68-1.09 1.78-.96 2.85 1.12.09 2.22-.54 2.83-1.32z" />
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[9px] text-slate-400 block">Download on the</span>
                  <span className="text-xs font-semibold text-white block">App Store</span>
                </div>
              </a>

              {/* Google Play Badge */}
              <a
                href="#google-play"
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-black/60 hover:bg-slate-800 transition-colors w-[150px] ml-0 block"
              >
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.302-.27-.485-.67-.485-1.125V2.939c0-.455.183-.855.484-1.125zm11.242 11.243l2.42 2.42-11.45 6.44 9.03-8.86zm0-2.114L5.82 2.083l11.45 6.44-2.419 2.42zm1.488 1.057l3.87 2.176c.72.405.72 1.067 0 1.472l-3.87 2.176-2.16-2.16 2.16-2.164z" />
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[9px] text-slate-400 block">GET IT ON</span>
                  <span className="text-xs font-semibold text-white block">Google Play</span>
                </div>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4 pt-1 text-slate-300">
              <a
                href="https://facebook.com/growingfit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/growingfit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/growingfit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@growingfit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>{copyrightText}</p>
          <div className="flex items-center space-x-6">
            <Link href={privacyUrl} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href={termsUrl} className="hover:text-slate-300 transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
