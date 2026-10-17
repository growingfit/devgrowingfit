'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  Navigation,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Centre, ContactSettings, SocialLink } from '@/types/database';

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
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading admissions desk...</div>}>
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
    studentName: '',
    studentAge: '',
    parentName: '',
    phone: '',
    email: '',
    program: initialProgram,
    centre: initialCentre,
    message: '',
  });

  const [selectedCentreNotice, setSelectedCentreNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialProgram) {
      setForm((prev) => ({ ...prev, program: initialProgram }));
    }
    if (initialCentre) {
      setForm((prev) => ({ ...prev, centre: initialCentre }));
    }
  }, [initialProgram, initialCentre]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate swift submission confirmation
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleSelectCentre = (centreName: string) => {
    setForm((prev) => ({ ...prev, centre: centreName }));
    setSelectedCentreNotice(centreName);
    setTimeout(() => setSelectedCentreNotice(null), 4000);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const programsList = [
    { label: 'Badminton Academy', value: 'badminton' },
    { label: 'Grassroots Football', value: 'football' },
    { label: 'Roller Skating Academy', value: 'roller-skating' },
    { label: 'Martial Arts & Karate', value: 'martial-arts' },
    { label: 'Junior Cricket Academy', value: 'cricket' },
    { label: 'Swimming Academy', value: 'swimming' },
    { label: 'Athletics & Track Speed', value: 'athletics' },
    { label: 'Physical Fitness & Agility', value: 'fitness' },
  ];

  const publishedCentres = (initialCentres || []).filter((c) => c.is_published !== false);

  const faqs = [
    {
      q: 'How quickly will the admission coordinator contact us?',
      a: 'Our admissions desk typically reaches out within 2 to 4 business hours to confirm your trial session timing and answer any questions.',
    },
    {
      q: 'Is the trial class completely free?',
      a: 'Yes, the first evaluation session is 100% complimentary. It allows your child to experience the training arena and coaches firsthand with zero commitment.',
    },
    {
      q: 'Can we switch batch timings if school hours change?',
      a: 'Yes, we offer flexible morning and evening batch slots and accommodate batch schedule changes whenever requested.',
    },
  ];

  const phoneDisplay = contactInfo?.phone || '+91 702 581 0722';
  const emailDisplay = contactInfo?.email || 'growingfitofficial@gmail.com';
  const waUrl = contactInfo?.whatsapp || 'https://wa.me/917025810722?text=Hello%20Growing%20Fit%2C%20I%20would%20like%20to%20enquire%20about%20admissions.';
  const hqDisplay = contactInfo?.headquarters || 'Calicut & Kochi, Kerala, India';
  const hoursDisplay = contactInfo?.opening_hours || 'Monday – Saturday: 6:00 AM – 7:30 PM';

  return (
    <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      
      {/* 2-Column Section: Form on Left, Direct Coordinates on Right */}
      <div ref={formRef} id="enquiry-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start scroll-mt-24">
        
        {/* Left Column: Interactive Admissions Form */}
        <div className="lg:col-span-7 bg-[#FAFAFC] border border-[#E8E8EC] rounded-3xl p-6 sm:p-10 shadow-xs relative">
          
          {selectedCentreNotice && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Selected centre: <strong>{selectedCentreNotice}</strong></span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedCentreNotice(null)}
                className="text-emerald-700 hover:text-emerald-950 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#172033]">Enquiry Received Successfully!</h3>
              <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. Our head admissions coordinator will contact you shortly at{' '}
                <span className="font-bold text-[#172033]">{form.phone}</span> with batch timings and free trial details
                {form.centre ? <> for <strong>{form.centre}</strong></> : ''}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    studentName: '',
                    studentAge: '',
                    parentName: '',
                    phone: '',
                    email: '',
                    program: '',
                    centre: '',
                    message: '',
                  });
                }}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#172033] hover:text-black border border-[#D0D5DD] text-xs font-bold px-6 py-2.5 rounded-full shadow-2xs transition-all"
              >
                <span>Submit Another Enquiry</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <span className="text-xs font-black tracking-widest text-[#172033] uppercase">
                  ONLINE ENROLMENT &amp; TRIAL BOOKING
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] mt-1">
                  Book A Trial Session
                </h2>
                <p className="text-xs text-[#667085] mt-1">
                  Fill in your details below and our team will get in touch within a few hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                    Student&apos;s Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Aryan Nair"
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#172033] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                    Student&apos;s Age *
                  </label>
                  <input
                    required
                    type="number"
                    min="3"
                    max="18"
                    placeholder="e.g. 8"
                    value={form.studentAge}
                    onChange={(e) => setForm({ ...form, studentAge: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#172033] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                    Parent / Guardian Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Suresh Nair"
                    value={form.parentName}
                    onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#172033] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#172033] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                    Preferred Sport Category *
                  </label>
                  <select
                    required
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#172033] transition-colors"
                  >
                    <option value="">Select a sport...</option>
                    {programsList.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                    Preferred Training Centre
                  </label>
                  <select
                    value={form.centre}
                    onChange={(e) => setForm({ ...form, centre: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#172033] transition-colors"
                  >
                    <option value="">Select a training centre...</option>
                    {publishedCentres.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. parent@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#172033] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                  Any Specific Requirements or Questions
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your child's sports background or preferred training timings..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#172033] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#172033] hover:text-black border border-[#D0D5DD] text-xs sm:text-sm font-bold py-3.5 px-6 rounded-full shadow-xs hover:shadow-sm transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Enquiry...</span>
                ) : (
                  <>
                    <span>Submit Trial &amp; Admission Request</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Direct Contact & Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-black tracking-widest text-[#172033] uppercase">
              DIRECT REACH
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033]">
              Contact Coordinates
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Have questions regarding batch availability, court bookings, or admissions? Reach out directly to our coordinators.
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone Card */}
            <div className="rounded-2xl border border-[#E8E8EC] bg-white p-5 flex items-start gap-4 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center text-[#172033] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider">Admission Hotlines</h4>
                <div className="space-y-0.5">
                  <a href={`tel:${phoneDisplay}`} className="block text-sm font-bold text-[#172033] hover:underline">
                    {phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp Chat Card */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Quick WhatsApp Chat</h4>
                <p className="text-xs text-emerald-700">Chat directly with an admission counselor</p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block pt-1 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  Start WhatsApp Chat &rarr;
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="rounded-2xl border border-[#E8E8EC] bg-white p-5 flex items-start gap-4 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center text-[#172033] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider">Email Correspondence</h4>
                <a href={`mailto:${emailDisplay}`} className="block text-sm font-bold text-[#172033] hover:underline">
                  {emailDisplay}
                </a>
                <p className="text-xs text-[#667085]">Monitored 7 days a week</p>
              </div>
            </div>

            {/* Office Card */}
            <div className="rounded-2xl border border-[#E8E8EC] bg-white p-5 flex items-start gap-4 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-[#F0F2F5] border border-[#E4E7EC] flex items-center justify-center text-[#172033] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider">Headquarters &amp; Hub</h4>
                <p className="text-sm font-bold text-[#172033]">{hqDisplay}</p>
                <div className="flex items-center gap-1.5 text-xs text-[#667085] pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#172033]" />
                  <span>{hoursDisplay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ summary */}
          <div className="rounded-2xl border border-[#E8E8EC] bg-[#FAFAFC] p-5 space-y-3">
            <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#172033]" />
              <span>Admissions FAQ</span>
            </h4>
            <div className="space-y-3 text-xs text-[#667085]">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1 border-t border-[#E8E8EC] pt-2 first:border-0 first:pt-0">
                  <p className="font-bold text-[#172033]">{faq.q}</p>
                  <p className="leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Dedicated Section: Training Centres & Arenas Showcase */}
      <div id="centres-section" className="border-t border-[#E8E8EC] pt-14 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[2px] bg-[#172033]" />
              <span className="text-xs font-black tracking-widest text-[#172033] uppercase">
                ACADEMY CAMPUSES &amp; HUBS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033] tracking-tight">
              Our Training Centres
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] max-w-2xl leading-relaxed">
              Growing Fit operates premier multi-sport facilities with international-standard courts, turf arenas, and licensed coaches across Kerala.
            </p>
          </div>

          <div className="text-xs font-bold text-[#667085] flex items-center gap-2 bg-[#F0F2F5] px-3.5 py-2 rounded-full self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{publishedCentres.length} Active Training Locations</span>
          </div>
        </div>

        {/* Centres Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedCentres.map((centre, index) => (
            <div
              key={centre.id || index}
              className="bg-white border border-[#E8E8EC] rounded-2xl p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#172033] transition-all group"
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black tracking-wider text-white bg-[#172033] px-2.5 py-1 rounded-md">
                    ARENA {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Admissions Open
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#172033] group-hover:text-black transition-colors">
                    {centre.name}
                  </h3>
                </div>

                {/* Location Details */}
                <div className="space-y-2.5 text-xs text-[#667085]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#172033] shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-[#4A5568]">{centre.address}</span>
                  </div>

                  {centre.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#172033] shrink-0" />
                      <a
                        href={`tel:${centre.phone}`}
                        className="font-bold text-[#172033] hover:underline"
                      >
                        {centre.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 mt-6 border-t border-[#F0F2F5] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectCentre(centre.name)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-[#172033] hover:text-black border border-[#D0D5DD] text-xs font-bold py-2.5 px-4 rounded-xl shadow-2xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <span>Select &amp; Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {centre.map_url && (
                  <a
                    href={centre.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Google Maps"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#E8E8EC] text-[#172033] hover:bg-slate-100 hover:border-[#172033] transition-colors shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Support Banner */}
        <div className="bg-[#FAFAFC] border border-[#E8E8EC] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#172033]">Looking for training in another city?</h4>
            <p className="text-xs text-[#667085]">
              Growing Fit regularly launches seasonal camps and partner school batches across Malabar and Central Kerala.
            </p>
          </div>
          <a
            href={`tel:${phoneDisplay}`}
            className="inline-flex items-center gap-2 bg-white border border-[#E8E8EC] hover:border-[#172033] text-[#172033] text-xs font-bold px-5 py-2.5 rounded-full transition-colors shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Speak to Campus Coordinator</span>
          </a>
        </div>
      </div>

    </div>
  );
}
