'use client';

import { ShieldCheck, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  userEmail?: string;
}

export function AdminHeader({ title, description, userEmail }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-sm border-b border-[#E8E8EC] px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#172033] tracking-tight">{title}</h1>
        {description && <p className="text-xs text-[#667085] mt-0.5">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#FAFAFC] border border-[#E8E8EC] rounded-full text-xs font-medium text-[#172033]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />
          <span>Admin Session Verified</span>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#67238A]/10 text-[#67238A] flex items-center justify-center font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
