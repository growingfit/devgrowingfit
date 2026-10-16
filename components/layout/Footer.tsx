import Link from 'next/link';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { FooterSettings, ContactSettings, Centre, SocialLink } from '@/types/database';

interface FooterProps {
  footerSettings?: FooterSettings | null;
  contactSettings?: ContactSettings | null;
  centres?: Centre[];
  socialLinks?: SocialLink[];
}

export function Footer({
  footerSettings,
  contactSettings,
  centres = [],
  socialLinks = [],
}: FooterProps) {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Programs', href: '/programs' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  const defaultPrograms = [
    { label: 'Badminton', href: '/programs/badminton' },
    { label: 'Football', href: '/programs/football' },
    { label: 'Roller Skating', href: '/programs/roller-skating' },
    { label: 'Cricket', href: '/programs/cricket' },
    { label: 'Martial Arts', href: '/programs/martial-arts' },
    { label: 'Fitness & Athletics', href: '/programs/fitness' },
  ];

  const phone = contactSettings?.phone || '+91 702 581 0722';
  const email = contactSettings?.email || 'growingfitofficial@gmail.com';
  const address = contactSettings?.headquarters || 'Calicut & Kochi, Kerala, India';
  const description =
    footerSettings?.brand_description ||
    'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow.';
  const copyright = footerSettings?.copyright_text || '© 2026 Growing Fit. All rights reserved.';
  const privacyUrl = footerSettings?.privacy_policy_url || '/privacy-policy';
  const termsUrl = footerSettings?.terms_conditions_url || '/terms-conditions';

  const defaultCentres = [
    { id: 'c-1', name: 'Calicut Centre' },
    { id: 'c-2', name: 'Kochi Centre' },
    { id: 'c-3', name: 'Bangalore Centre' },
    { id: 'c-4', name: 'Mumbai Centre' },
  ];

  const defaultSocials = [
    { platform: 'Facebook', url: 'https://facebook.com/growingfit' },
    { platform: 'Instagram', url: 'https://instagram.com/growingfit' },
    { platform: 'YouTube', url: 'https://youtube.com/@growingfit' },
  ];

  const renderSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('insta')) return <Instagram className="w-4 h-4" />;
    if (p.includes('face')) return <Facebook className="w-4 h-4" />;
    if (p.includes('you')) return <Youtube className="w-4 h-4" />;
    return <Mail className="w-4 h-4" />;
  };

  const activeSocials = socialLinks && socialLinks.length > 0 ? socialLinks : defaultSocials;
  const activeCentres = centres && centres.length > 0 ? centres : defaultCentres;

  return (
    <footer className="bg-[#0B1220] border-t border-slate-800/80 pt-14 sm:pt-16 pb-8 text-[#94A3B8]">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Main 5-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Socials (Span 3 on desktop) */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1 flex-shrink-0 group-hover:scale-105 transition-transform">
                <img src="/growfit logo.png" alt="Growing Fit" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight leading-none block">Growing Fit</span>
                <span className="text-[7.5px] font-bold tracking-widest text-[#94A3B8] uppercase block mt-1">School of Health &amp; Physical Education</span>
              </div>
            </Link>

            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
              {description}
            </p>

            {/* Social media links */}
            <div className="flex items-center space-x-2.5 pt-2">
              {activeSocials.map((item, idx) => (
                <a
                  key={(item as any).id || idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.platform}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E11D2A] text-white flex items-center justify-center transition-colors shadow-2xs"
                >
                  {renderSocialIcon(item.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Programs (Span 3) with 2 sub-columns */}
          <div className="lg:col-span-3">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4">Our Programs</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm">
              <Link href="/programs/kung-fu" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Kung Fu
              </Link>
              <Link href="/programs/badminton" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Badminton
              </Link>
              <Link href="/programs/muay-thai" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Muay Thai
              </Link>
              <Link href="/programs/cricket" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Cricket
              </Link>
              <Link href="/programs/boxing" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Boxing
              </Link>
              <Link href="/programs/table-tennis" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Table Tennis
              </Link>
              <Link href="/programs/roller-skating" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Roller Skating
              </Link>
              <Link href="/programs/martial-arts" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Martial Arts
              </Link>
              <Link href="/programs/football" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Football
              </Link>
              <Link href="/programs/fitness" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Fitness
              </Link>
              <Link href="/programs/swimming" className="text-[#94A3B8] hover:text-[#E11D2A] transition-colors">
                Swimming
              </Link>
            </div>
          </div>

          {/* Column 4: Our Centres (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4">Our Centres</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {activeCentres.map((centre) => (
                <li key={centre.id} className="text-[#94A3B8]">
                  {centre.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Get In Touch (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E11D2A] flex-shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-[#94A3B8] hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E11D2A] flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-[#94A3B8] hover:text-white transition-colors break-all"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E11D2A] flex-shrink-0 mt-0.5" />
                <span className="text-[#94A3B8]">
                  {address}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>{copyright}</p>
          <div className="flex items-center space-x-6">
            <Link href={privacyUrl} className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-800">|</span>
            <Link href={termsUrl} className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
