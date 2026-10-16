'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { ContactSettings } from '@/types/database';

interface ContactSectionProps {
  contactSettings?: ContactSettings | null;
}

export function ContactSection({ contactSettings }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const phone = contactSettings?.phone || '+91 702 581 0722';
  const email = contactSettings?.email || 'growingfitofficial@gmail.com';
  const headquarters = contactSettings?.headquarters || 'Calicut & Kochi, Kerala, India';
  const hours = contactSettings?.opening_hours || 'Monday - Saturday: 6:00 AM - 7:00 PM';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact" className="py-10 sm:py-14 lg:py-16 bg-white border-b border-[#E8E8EC] overflow-hidden">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Admissions Info */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 lg:pl-3 xl:pl-6">
            <div className="space-y-3 sm:space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  ADMISSIONS &amp; ENQUIRY
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-[#172033] tracking-tight leading-[1.22]">
                Connect With Our <br className="hidden sm:inline" />
                <span className="text-[#E11D2A]">Admissions Team</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed max-w-md">
                Schedule a visit, learn about our programs, or get answers to your questions. We&apos;re here to help!
              </p>
            </div>

            <div className="space-y-5 pt-1">
              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-full bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">Phone</h4>
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="text-sm sm:text-base font-extrabold text-[#172033] hover:text-[#E11D2A] transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-full bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">Email</h4>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm sm:text-base font-extrabold text-[#172033] hover:text-[#E11D2A] transition-colors break-all"
                  >
                    {email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-full bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">Location</h4>
                  <p className="text-sm sm:text-base font-extrabold text-[#172033]">
                    {headquarters}
                  </p>
                  <p className="text-xs text-[#667085] mt-0.5">
                    {hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send an Enquiry Card */}
          <div className="lg:col-span-7 bg-white border border-[#E8E8EC] rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xs">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-[#172033]">Enquiry Received</h3>
                <p className="text-xs sm:text-sm text-[#667085] max-w-md leading-relaxed">
                  Thank you for reaching out to Growing Fit. Our admissions team will contact you shortly with program details and centre schedules.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-7 py-2.5 text-xs sm:text-sm font-bold text-[#E11D2A] border-2 border-[#E11D2A] rounded-full hover:bg-red-50/50 transition-colors"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#172033]">Send an Enquiry</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-black text-[#667085] uppercase tracking-wider mb-1.5">
                      PARENT / GUARDIAN NAME *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 bg-[#FAFAFC] border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D2A]/20 focus:border-[#E11D2A] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-black text-[#667085] uppercase tracking-wider mb-1.5">
                      CONTACT PHONE *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#FAFAFC] border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D2A]/20 focus:border-[#E11D2A] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-black text-[#667085] uppercase tracking-wider mb-1.5">
                      PROGRAM OF INTEREST *
                    </label>
                    <select className="w-full px-4 py-3 bg-[#FAFAFC] border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D2A]/20 focus:border-[#E11D2A] transition-all cursor-pointer">
                      <option value="">Select Program</option>
                      <option>Kung Fu</option>
                      <option>Muay Thai</option>
                      <option>Boxing</option>
                      <option>Roller Skating</option>
                      <option>Football</option>
                      <option>Swimming</option>
                      <option>Badminton</option>
                      <option>Cricket</option>
                      <option>Fitness</option>
                      <option>Athletics</option>
                      <option>Table Tennis</option>
                      <option>Martial Arts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-black text-[#667085] uppercase tracking-wider mb-1.5">
                      PREFERRED CENTRE *
                    </label>
                    <select className="w-full px-4 py-3 bg-[#FAFAFC] border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D2A]/20 focus:border-[#E11D2A] transition-all cursor-pointer">
                      <option>Calicut Center (Kerala)</option>
                      <option>Kozhikode Center (Kerala)</option>
                      <option>Bangalore Center</option>
                      <option>Manjeri Center</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black text-[#667085] uppercase tracking-wider mb-1.5">
                    MESSAGE / OPTIONAL *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share your child's age, any special training requirements..."
                    className="w-full px-4 py-3 bg-[#FAFAFC] border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D2A]/20 focus:border-[#E11D2A] transition-all resize-none"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 bg-[#E11D2A] hover:bg-[#C9141F] text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
                  >
                    <span>{loading ? 'Submitting...' : 'Submit Enquiry'}</span>
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
