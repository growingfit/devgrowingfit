'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { HeaderSettingsData } from '@/types/database';

interface HeaderProps {
  headerSettings?: HeaderSettingsData | null;
  enquireUrl?: string;
}

export function Header({ headerSettings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const moreDropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Primary navigation links shown in center
  const defaultNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'School', href: '/schools' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  // Secondary pages dropdown (cleanly removed per user request)
  const secondaryPages: { label: string; href: string }[] = [];

  const navLinks = defaultNavLinks;

  const isCurrentActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('#')) return false;
    if ((href === '/schools' || href === '/school') && (pathname === '/schools' || pathname === '/school')) return true;
    if (href === '/vision' && pathname === '/vision') return true;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E8E8EC] transition-all">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* 1. Brand Logo on the Left (Strictly in code) */}
          <div className="flex-shrink-0 flex items-center pr-4">
            <BrandLogo className="h-9 sm:h-11 w-auto object-contain" />
          </div>

          {/* 2. Navigation Links in the Center (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((item) => {
              const active = isCurrentActive(item.href);
              return (
                <div key={item.label} className="relative py-2">
                  <Link
                    href={item.href}
                    className={`text-xs sm:text-sm font-semibold transition-colors ${
                      active
                        ? 'text-[#172033] font-bold'
                        : 'text-[#4A5568] hover:text-[#172033]'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {/* Active Black indicator underline */}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#172033] rounded-full" />
                  )}
                </div>
              );
            })}

            {/* "More" dropdown if secondary pages exist */}
            {secondaryPages.length > 0 && (
              <div className="relative" ref={moreDropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="text-xs sm:text-sm font-semibold text-[#4A5568] hover:text-[#172033] flex items-center gap-1 py-2 focus:outline-none cursor-pointer"
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E8E8EC] rounded-xl shadow-lg py-2 z-50 animate-in fade-in-50 duration-150">
                    {secondaryPages.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-4 py-2 text-xs font-medium text-[#172033] hover:bg-slate-50 hover:text-black transition-colors"
                        onClick={() => setMoreDropdownOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#172033] hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E8EC] bg-white px-5 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2.5">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-[#172033] hover:text-black py-2 px-2 rounded-md hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}

            {secondaryPages.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                  Explore More
                </span>
                {secondaryPages.map((sub) => (
                  <Link
                    key={sub.label}
                    href={sub.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#4A5568] hover:text-black py-1.5 px-2 block rounded hover:bg-slate-50"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
