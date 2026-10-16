'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface HeaderProps {
  enquireUrl?: string;
}

export function Header({ enquireUrl = '/contact' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Programs', href: '/programs' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  const isCurrentActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E8E8EC] transition-all">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - shifted right towards center */}
          <div className="flex-shrink-0 flex items-center h-16 max-w-[220px] overflow-hidden lg:pl-3 xl:pl-6">
            <BrandLogo className="h-10 sm:h-11 w-auto max-h-11 object-contain" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => {
              const active = isCurrentActive(item.href);
              return (
                <div key={item.label} className="relative py-2">
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      active
                        ? 'text-[#E11D2A] font-bold'
                        : 'text-[#667085] hover:text-[#172033]'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {/* Red active indicator underline */}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E11D2A] rounded-full" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Join Now CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href={enquireUrl}
              className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span>Join Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#172033] hover:bg-[#FAFAFC] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E8EC] bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#172033] hover:text-[#E11D2A] py-2 px-3 rounded-md hover:bg-[#FAFAFC]"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href={enquireUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-[#E11D2A] hover:bg-[#C9141F] text-white font-bold py-3 rounded-full text-center shadow-sm"
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
