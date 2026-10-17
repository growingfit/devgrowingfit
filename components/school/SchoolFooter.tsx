'use client';

import React from 'react';
import Link from 'next/link';

interface SchoolFooterProps {
  phone?: string;
  email?: string;
  address?: string;
}

export function SchoolFooter({
  phone = '+91 702 581 0722',
  email = 'growingfitofficial@gmail.com',
  address = 'Calicut & Kochi, Kerala, India',
}: SchoolFooterProps) {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Programs', href: '/programs' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  const sportsPrograms = [
    { label: 'Kung Fu', href: '/programs/kung-fu' },
    { label: 'Muay Thai', href: '/programs/muay-thai' },
    { label: 'Boxing', href: '/programs/boxing' },
    { label: 'Swimming', href: '/programs/swimming' },
    { label: 'Wushu', href: '/programs/wushu' },
    { label: 'Football', href: '/programs/football' },
    { label: 'Roller Skating', href: '/programs/roller-skating' },
    { label: 'Yoga', href: '/programs/yoga' },
    { label: 'Gymnastics', href: '/programs/gymnastics' },
    { label: 'Kalaripayattu', href: '/programs/kalaripayattu' },
    { label: 'Archery', href: '/programs/archery' },
    { label: 'Aerobics', href: '/programs/aerobics' },
  ];

  return (
    <footer className="w-full bg-[#0D1117] text-white pt-14 sm:pt-16 pb-8 border-t border-slate-900 select-none">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* 4 Clean Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Growing Fit Brand (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/growingfit-whitelogo.png"
                alt="Growing Fit — School of Health & Physical Education"
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-sm font-normal">
              Growing Fit is a dedicated school of health and physical education, focused on shaping stronger, healthier and brighter futures for children through sports, fitness and holistic development.
            </p>
          </div>

          {/* Column 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-slate-300">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Programs (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Our Programs
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-[13px] font-medium text-slate-300">
              {sportsPrograms.map((prog) => (
                <Link
                  key={prog.label}
                  href={prog.href}
                  className="hover:text-white transition-colors truncate"
                >
                  {prog.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Get in Touch (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h4>
            <div className="space-y-2 text-xs sm:text-[13px] text-slate-300">
              <p className="text-white font-semibold">Bangalore &amp; Kerala</p>
              <p className="text-slate-400">{address}</p>
              <p>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright + Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Growing Fit. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-slate-300 transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
