'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
  Building,
  Sparkles,
} from 'lucide-react';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const initialProgram = searchParams.get('program') || '';
  const initialCentre = searchParams.get('centre') || '';

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

  useEffect(() => {
    if (initialProgram) {
      setForm((prev) => ({ ...prev, program: initialProgram }));
    }
    if (initialCentre) {
      setForm((prev) => ({ ...prev, centre: initialCentre }));
    }
  }, [initialProgram, initialCentre]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate swift submission & confirmation
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
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

  const centresList = [
    { label: 'Growing Fit — Calicut Central Hub', value: 'Calicut Central Hub' },
    { label: 'Growing Fit — Kochi Sports Arena', value: 'Kochi Sports Arena' },
    { label: 'Growing Fit — Thrissur Training Academy', value: 'Thrissur Training Academy' },
  ];

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

  return (
    <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* 2-Column Layout: Form on Left, Contact Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Interactive Admissions Form */}
        <div className="lg:col-span-7 bg-[#FAFAFC] border border-[#E8E8EC] rounded-3xl p-6 sm:p-10 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#172033]">Enquiry Received Successfully!</h3>
              <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. Our head admissions coordinator will contact you shortly at{' '}
                <span className="font-bold text-[#172033]">{form.phone}</span> with batch timings and free trial details.
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
                className="inline-flex items-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all"
              >
                <span>Submit Another Enquiry</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <span className="text-xs font-black tracking-widest text-[#E11D2A] uppercase">
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
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E11D2A] transition-colors"
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
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E11D2A] transition-colors"
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
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E11D2A] transition-colors"
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
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E11D2A] transition-colors"
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
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E11D2A] transition-colors"
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
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E11D2A] transition-colors"
                  >
                    <option value="">Select a centre...</option>
                    {centresList.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
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
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E11D2A] transition-colors"
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
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E11D2A] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white text-xs sm:text-sm font-bold py-3.5 px-6 rounded-full shadow-sm hover:shadow-md transition-all disabled:opacity-50"
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
            <span className="text-xs font-black tracking-widest text-[#E11D2A] uppercase">
              DIRECT REACH
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033]">
              Contact Coordinates
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Have urgent questions regarding batch availability, court bookings, or admissions? Reach out directly to our coordinators.
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone Card */}
            <div className="rounded-2xl border border-[#E8E8EC] bg-white p-5 flex items-start gap-4 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider">Admission Hotlines</h4>
                <div className="space-y-0.5">
                  <a href="tel:+917025810722" className="block text-sm font-bold text-[#172033] hover:text-[#E11D2A]">
                    +91 702 581 0722
                  </a>
                  <a href="tel:+917025810723" className="block text-sm font-bold text-[#172033] hover:text-[#E11D2A]">
                    +91 702 581 0723
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp Chat Card */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Quick WhatsApp Chat</h4>
                <p className="text-xs text-emerald-700">Chat directly with an admission counselor</p>
                <a
                  href="https://wa.me/917025810722?text=Hello%20Growing%20Fit%2C%20I%20would%20like%20to%20enquire%20about%20admissions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block pt-1 text-xs font-bold text-emerald-800 underline hover:text-emerald-900"
                >
                  Start WhatsApp Chat &rarr;
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="rounded-2xl border border-[#E8E8EC] bg-white p-5 flex items-start gap-4 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider">Email Correspondence</h4>
                <a href="mailto:growingfitofficial@gmail.com" className="block text-sm font-bold text-[#172033] hover:text-[#E11D2A]">
                  growingfitofficial@gmail.com
                </a>
                <p className="text-xs text-[#667085]">Monitored 7 days a week</p>
              </div>
            </div>

            {/* Office Card */}
            <div className="rounded-2xl border border-[#E8E8EC] bg-white p-5 flex items-start gap-4 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider">Headquarters &amp; Hub</h4>
                <p className="text-sm font-bold text-[#172033]">Calicut &amp; Kochi, Kerala, India</p>
                <div className="flex items-center gap-1.5 text-xs text-[#667085] pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#E11D2A]" />
                  <span>Mon – Sat: 6:00 AM – 7:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ summary */}
          <div className="rounded-2xl border border-[#E8E8EC] bg-[#FAFAFC] p-5 space-y-3">
            <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#E11D2A]" />
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

    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="flex-grow bg-white">
        {/* Breadcrumb Navigation & Hero Header */}
        <div className="bg-[#FAFAFC] border-b border-[#E8E8EC] py-10 sm:py-14">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#667085] mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E11D2A] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#172033] font-bold">Contact &amp; Admissions</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  ADMISSIONS &amp; ENQUIRY
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172033] tracking-tight leading-tight">
                Connect With Our <br className="hidden sm:inline" />
                <span className="text-[#E11D2A]">Admissions Team</span>
              </h1>
              <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                Schedule a complimentary trial session, explore batch timings, or locate our training centers in Calicut and Kochi.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading form...</div>}>
          <ContactFormInner />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
