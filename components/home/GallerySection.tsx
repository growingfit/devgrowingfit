'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { GalleryImage } from '@/types/database';

interface GallerySectionProps {
  images?: GalleryImage[];
}

interface GalleryItemData {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

export function GallerySection({ images = [] }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const mapImagesToItems = (imgList: any[]): GalleryItemData[] => {
    return (imgList || [])
      .filter((img) => img && img.is_published !== false && typeof img.image_url === 'string' && img.image_url.trim().length > 0)
      .map((img, idx) => ({
        id: img.id || `admin-${idx}`,
        title: img.title || (img as any).alt_text || `Academy Activity ${idx + 1}`,
        category: (img as any).category || 'Academy Training',
        image_url: img.image_url.trim(),
      }));
  };

  const [displayItems, setDisplayItems] = useState<GalleryItemData[]>(() => mapImagesToItems(images));
  const [loading, setLoading] = useState<boolean>(displayItems.length === 0);

  // Sync when server props change
  useEffect(() => {
    if (images && images.length > 0) {
      setDisplayItems(mapImagesToItems(images));
      setLoading(false);
    }
  }, [images]);

  // Always query Supabase directly on the client to ensure recently uploaded admin images appear immediately
  useEffect(() => {
    async function fetchGalleryFromSupabase() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('sort_order', { ascending: true });

        if (data && data.length > 0) {
          const fresh = mapImagesToItems(data);
          if (fresh.length > 0) {
            setDisplayItems(fresh);
          }
        }
      } catch (err) {
        console.error('Error fetching gallery images on client:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGalleryFromSupabase();
  }, []);

  // Keyboard navigation for lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayItems.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null && prev < displayItems.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, displayItems.length]);

  const activeItem = selectedIndex !== null ? displayItems[selectedIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayItems.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev !== null && prev < displayItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="gallery" className="py-8 sm:py-10 lg:py-12 bg-white border-b border-[#E8E8EC]">
      {/* Aligned container matching all section headings across the page */}
      <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Section Header: Matches mockup with red eyebrow bar and circular arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-3 sm:space-y-3.5 lg:pl-3 xl:pl-6">
            <div className="flex items-center gap-2.5">
              <span className="h-[2px] w-6 bg-[#E11D2A] rounded-full" />
              <span className="text-xs font-black tracking-[0.18em] text-[#E11D2A] uppercase">
                OUR GALLERY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-[#172033] tracking-tight leading-[1.2]">
              Moments That Inspire
            </h2>
          </div>

          {/* Right Header Action: "View Gallery ->" + Circular Navigation Arrows */}
          <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-end">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#E11D2A] hover:text-[#C9141F] transition-colors group"
            >
              <span>View Gallery</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : 0))}
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-[#E11D2A] hover:bg-red-50/50 text-slate-600 hover:text-[#E11D2A] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Previous gallery image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedIndex((prev) => (prev !== null && prev < displayItems.length - 1 ? prev + 1 : 0))}
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-[#E11D2A] hover:bg-red-50/50 text-slate-600 hover:text-[#E11D2A] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Next gallery image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Grid with smaller cards for admin uploaded photos */}
        {displayItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4 rounded-xl border border-dashed border-[#E8E8EC] bg-[#FAFAFC]">
            {loading ? (
              <p className="text-xs text-[#667085]">Loading gallery photographs...</p>
            ) : (
              <>
                <p className="text-sm sm:text-base font-bold text-[#172033]">No Gallery Images Uploaded Yet</p>
                <p className="text-xs text-[#667085] mt-1.5 max-w-md mx-auto">
                  Photos uploaded by the administrator in the Admin Gallery dashboard will appear here.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4">
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                className="group relative rounded-lg sm:rounded-xl overflow-hidden border border-[#E8E8EC]/90 bg-slate-100 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer aspect-[238/149]"
                title={`Click to view ${item.title}`}
              >
                {/* Photo Image */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Hover Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5 sm:p-3 text-white">
                  <div className="flex justify-end">
                    <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-2xs">
                      <ZoomIn className="w-3 h-3" />
                    </span>
                  </div>
                  <div>
                    <span className="inline-block text-[9px] font-bold tracking-wider uppercase text-white bg-[#E11D2A] px-2 py-0.5 rounded-full mb-1">
                      {item.category}
                    </span>
                    <p className="text-[11px] sm:text-xs font-semibold line-clamp-1 text-white leading-tight">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  {selectedIndex + 1} of {displayItems.length}
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
            <div className="relative bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-hidden">
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
                href="#contact"
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
    </section>
  );
}
