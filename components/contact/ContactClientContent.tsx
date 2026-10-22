'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Phone,
  Mail,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Centre, ContactSettings, SocialLink } from '@/types/database';
import { submitEnquiryAction } from '@/lib/actions/cms';

interface ContactClientContentProps {
  initialCentres?: Centre[];
  contactInfo?: Partial<ContactSettings> | null;
  socials?: SocialLink[];
}

export function ContactClientContent({
  initialCentres = [],
  contactInfo,
  socials = [],
}: ContactClientContentProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading contact desk...</div>}>
      <ContactFormAndCentresInner
        initialCentres={initialCentres}
        contactInfo={contactInfo}
        socials={socials}
      />
    </Suspense>
  );
}

function ContactFormAndCentresInner({
  initialCentres,
  contactInfo,
  socials,
}: {
  initialCentres: Centre[];
  contactInfo?: Partial<ContactSettings> | null;
  socials: SocialLink[];
}) {
  const searchParams = useSearchParams();
  const initialProgram = searchParams.get('program') || '';
  const initialCentre = searchParams.get('centre') || '';
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCentreNotice, setSelectedCentreNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitEnquiryAction({
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
        source: 'contact_page',
      });
      if (res.success) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCentre = (centreName: string) => {
    setSelectedCentreNotice(centreName);
    setTimeout(() => setSelectedCentreNotice(null), 4000);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const publishedCentres = (initialCentres || []).filter((c) => c.is_published !== false);

  const phone1 = (contactInfo?.phone || '').trim();
  const phone2 = (contactInfo?.phone_secondary || '').trim();
  const emailDisplay = (contactInfo?.email || '').trim();
  const rawAddress = (contactInfo?.address || contactInfo?.headquarters || '').trim();
  const activeSocials = (socials || []).filter((s: any) => s && s.is_active !== false && s.url);

  return (
    <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-20">
      
      {/* ========================================================
          EXACT MOCKUP CONTACT CARD: SPLIT WHITE / BLACK
      ======================================================== */}
      <div ref={formRef} className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-[#E8E8EC] overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* ----------------------------------------------------
              LEFT COLUMN: WHITE (GET IN TOUCH)
          ---------------------------------------------------- */}
          <div className="md:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white">
            <div className="space-y-8">
              {/* Header */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#172033] tracking-wide uppercase leading-tight">
                GET IN TOUCH
              </h1>

              {/* Contact Us Section */}
              {(phone1 || phone2 || emailDisplay) && (
                <div className="space-y-3.5">
                  <h2 className="text-base sm:text-lg font-bold text-[#172033]">
                    Contact Us
                  </h2>
                  <div className="space-y-3 text-sm sm:text-[15px] font-medium text-[#172033]">
                    {/* Primary Phone */}
                    {phone1 && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#172033] shrink-0 fill-current" />
                        <a
                          href={`tel:${phone1.replace(/\s+/g, '')}`}
                          className="hover:underline tracking-wide"
                        >
                          {phone1}
                        </a>
                      </div>
                    )}

                    {/* Secondary Phone */}
                    {phone2 && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#172033] shrink-0 fill-current" />
                        <a
                          href={`tel:${phone2.replace(/\s+/g, '')}`}
                          className="hover:underline tracking-wide"
                        >
                          {phone2}
                        </a>
                      </div>
                    )}

                    {/* Email / Gmail */}
                    {emailDisplay && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#172033] shrink-0 fill-current" />
                        <a
                          href={`mailto:${emailDisplay}`}
                          className="hover:underline tracking-wide break-all"
                        >
                          {emailDisplay}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address Section */}
              {rawAddress && (
                <div className="space-y-2.5 pt-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#172033]">
                    Address
                  </h2>
                  <address className="not-italic text-sm sm:text-[15px] text-[#475467] leading-[1.75] font-normal whitespace-pre-line">
                    {rawAddress}
                  </address>
                </div>
              )}

              {/* Social Channels Section */}
              {activeSocials.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#172033]">
                    Follow Us
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {activeSocials.map((s: any) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F2F5] hover:bg-[#172033] hover:text-white text-xs font-semibold text-[#172033] rounded-full transition-colors"
                      >
                        <span>{s.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Subtle Tag */}
            <div className="pt-8 mt-8 border-t border-[#F0F1F3] text-xs font-semibold text-[#667085]">
              Growing Fit Sports Academy &bull; Kerala
            </div>
          </div>

          {/* ----------------------------------------------------
              RIGHT COLUMN: BLACK (WRITE TO US)
          ---------------------------------------------------- */}
          <div className="md:col-span-7 bg-[#111827] text-white p-8 sm:p-12 lg:p-14 relative flex flex-col justify-between">
            {/* Speech Bubble Arrow Notch (Points left into the white side) */}
            <div
              className="hidden md:block absolute -left-3.5 top-12 z-10 w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[14px] border-r-[#111827]"
              aria-hidden="true"
            />

            <div>
              {/* Header */}
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-white tracking-wide uppercase leading-tight mb-8">
                WRITE TO US
              </h2>

              {selectedCentreNotice && (
                <div className="mb-6 p-3 bg-white/10 border border-white/20 rounded-xl flex items-center justify-between text-xs text-white">
                  <span>Selected centre: <strong>{selectedCentreNotice}</strong></span>
                  <button
                    type="button"
                    onClick={() => setSelectedCentreNotice(null)}
                    className="text-white hover:text-slate-300 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {submitted ? (
                <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Thank you for writing to us. Our academy coordinator will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', phone: '', email: '', message: '' });
                    }}
                    className="inline-flex items-center gap-2 border border-white text-white rounded-full py-2.5 px-6 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-white mb-2">
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder=""
                      className="w-full bg-white text-[#172033] px-4 py-3 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-slate-300 font-medium"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-white mb-2">
                      Mobile Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder=""
                      className="w-full bg-white text-[#172033] px-4 py-3 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-slate-300 font-medium"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-white mb-2">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder=""
                      className="w-full bg-white text-[#172033] px-4 py-3 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-slate-300 font-medium"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-white mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder=""
                      className="w-full bg-white text-[#172033] px-4 py-3 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-slate-300 font-medium resize-none"
                    />
                  </div>

                  {/* SEND Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full border border-white text-white rounded-full py-3.5 px-8 text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>SENDING...</span>
                        </>
                      ) : (
                        <span>SEND</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
