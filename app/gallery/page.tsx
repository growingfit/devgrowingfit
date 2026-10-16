'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Instagram,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

const CATEGORIES = ['All', 'Martial Arts', 'Roller Skating', 'Football', 'Swimming', 'Coaching'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin uploaded images dynamically from Supabase
  useEffect(() => {
    async function loadDbImages() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('gallery_images')
          .select('*')
          .order('sort_order', { ascending: true });

        if (data && data.length > 0) {
          const dbItems: GalleryItem[] = data
            .filter((img: any) => img && img.is_published !== false && typeof img.image_url === 'string' && img.image_url.trim().length > 0)
            .map((img: any, idx: number) => ({
              id: img.id || `admin-${idx}`,
              title: img.title || img.alt_text || `Academy Photo ${idx + 1}`,
              category: img.category || 'Academy Training',
              image_url: img.image_url.trim(),
            }));

          setItems(dbItems);
        } else {
          setItems([]);
        }
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadDbImages();
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) =>
          item.category.toLowerCase().includes(activeCategory.toLowerCase())
        );

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems.length]);

  const activeItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <Header />

      <main className="flex-grow bg-white">
        {/* Breadcrumbs & Header Hero */}
        <div className="bg-[#FAFAFC] border-b border-[#E8E8EC] py-10 sm:py-14">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#667085] mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#E11D2A] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#172033] font-bold">Gallery</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
                <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                  OUR GALLERY
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172033] tracking-tight leading-tight">
                Moments That <span className="text-[#E11D2A]">Inspire</span>
              </h1>
              <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
                Step inside Growing Fit Academy. Explore snapshots of real training sessions, sparring matches, speed skating tournaments, and youth achievements.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills & Gallery Grid */}
        <section className="py-10 sm:py-14 border-b border-[#E8E8EC]">
          <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-8">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      setSelectedIndex(null);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#172033] text-white shadow-sm'
                        : 'bg-[#FAFAFC] text-[#667085] hover:text-[#172033] border border-[#E8E8EC]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Gallery Grid */}
            {loading ? (
              <div className="py-20 text-center text-slate-400 font-medium text-sm">
                Loading academy gallery photos...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#E8E8EC] bg-[#FAFAFC]">
                <p className="text-base font-bold text-[#172033]">No Gallery Images Uploaded Yet</p>
                <p className="text-xs text-[#667085] mt-1.5 max-w-md mx-auto">
                  Photos uploaded by the administrator in the Admin Gallery dashboard will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {filteredItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    onClick={() => setSelectedIndex(index)}
                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8E8EC]/90 bg-slate-100 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer aspect-[238/149]"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-4 text-white">
                      <div className="flex justify-end">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-2xs">
                          <ZoomIn className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div>
                        <span className="inline-block text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-white bg-[#E11D2A] px-2 py-0.5 rounded-full mb-1">
                          {item.category}
                        </span>
                        <p className="text-xs sm:text-sm font-semibold line-clamp-1 text-white leading-tight">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* Social Instagram Callout */}
        <section className="py-12 sm:py-16 bg-[#FAFAFC] border-b border-[#E8E8EC]">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center text-[#E11D2A] mx-auto">
              <Instagram className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#172033]">
              Follow Our Daily Training Stories
            </h3>
            <p className="text-xs sm:text-sm text-[#667085] max-w-xl mx-auto leading-relaxed">
              Tag @growingfitofficial on Instagram to share your child&apos;s training moments, tournament medals, and sports milestones.
            </p>
            <div className="pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#172033] hover:bg-black text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full transition-all"
              >
                <span>Follow @growingfitofficial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Accessible Interactive Lightbox Modal */}
      {activeItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF1F2] border border-[#FFE4E6] text-[10px] font-bold text-[#E11D2A] uppercase tracking-wider">
                  {activeItem.category}
                </span>
                <span className="text-xs text-slate-400">
                  {selectedIndex + 1} of {filteredItems.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Image Area with Left/Right Controls */}
            <div className="relative bg-slate-950 flex items-center justify-center min-h-[320px] max-h-[70vh] overflow-hidden">
              <img
                src={activeItem.image_url}
                alt={activeItem.title}
                className="w-full max-h-[70vh] object-contain"
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Footer Caption */}
            <div className="px-5 py-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#172033]">{activeItem.title}</h3>
                <p className="text-xs text-[#667085] mt-0.5">Growing Fit Academy — Physical &amp; Sports Training</p>
              </div>
              <Link
                href="/contact"
                onClick={() => setSelectedIndex(null)}
                className="inline-flex items-center gap-1.5 bg-[#E11D2A] hover:bg-[#C9141F] text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xs hover:shadow-xs transition-all"
              >
                <span>Enquire For Admissions</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
