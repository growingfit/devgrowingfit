import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center px-4 text-center">
      <BrandLogo className="h-14 w-auto mb-8" />
      <span className="text-sm font-bold tracking-widest text-[#F21F2B] uppercase">404 Error</span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#172033] mt-2 mb-4">
        Page Not Found
      </h1>
      <p className="text-base text-[#667085] max-w-md mb-8">
        The page you are looking for does not exist or has been moved to another location.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white font-bold text-sm px-6 py-3 rounded-full transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#172033] border border-[#E8E8EC] font-bold text-sm px-6 py-3 rounded-full transition-all"
        >
          <span>About Growing Fit</span>
        </Link>
      </div>
    </div>
  );
}
