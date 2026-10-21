'use client';

import React, { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, ArrowUpCircle } from 'lucide-react';

interface ImageUploaderProps {
  value?: string | null;
  publicId?: string | null;
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  label?: string;
  fit?: 'cover' | 'contain';
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
}

/**
 * Fast client-side image compression & WebP conversion.
 * Resizes oversized images (max 2048px) and converts to WebP at 0.82 quality.
 * Reduces 5MB-10MB files to ~150KB-300KB in milliseconds for ultra-fast uploads.
 */
async function compressImageToWebP(
  file: File,
  quality = 0.82,
  maxDimension = 2048
): Promise<File> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(file);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file);
          }

          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const webpFile = new File([blob], `${baseName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export function ImageUploader({
  value,
  publicId,
  onChange,
  folder = 'growing_fit',
  label = 'Upload Image',
  fit = 'cover',
  aspectRatio = 'video',
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP, SVG, GIF).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds the 20MB limit. Please upload a smaller image.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fast client-side WebP compression for 10x faster uploads
      const optimizedFile = await compressImageToWebP(file);

      const formData = new FormData();
      formData.append('file', optimizedFile);
      formData.append('folder', folder);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image.');
      }

      onChange(data.url, data.publicId);
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate if leaving the container itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUpload(file);
    }
  };

  const handleRemove = async () => {
    if (publicId) {
      try {
        await fetch('/api/media/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId }),
        });
      } catch (err) {
        console.error('Failed to delete media from Cloudinary:', err);
      }
    }
    onChange('', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider">
        {label}
      </label>

      {value ? (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group ${
            aspectRatio === 'square'
              ? 'w-48 h-48 rounded-2xl'
              : aspectRatio === 'portrait'
              ? 'w-48 max-w-full aspect-[9/16] rounded-xl'
              : 'w-full max-w-sm aspect-video rounded-xl'
          } overflow-hidden border transition-all ${
            isDragging
              ? 'border-2 border-dashed border-[#67238A] bg-purple-50/40 ring-4 ring-[#67238A]/10'
              : 'border-[#E8E8EC] bg-slate-50'
          }`}
        >
          <img
            src={value}
            alt="Preview"
            className={`w-full h-full ${
              fit === 'contain' ? 'object-contain p-3.5 bg-white' : 'object-cover'
            }`}
          />

          {/* Loading overlay when uploading/replacing */}
          {loading && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center text-white z-30">
              <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
              <p className="text-xs font-bold tracking-wide">Uploading...</p>
            </div>
          )}

          {/* Drag over overlay when replacing */}
          {isDragging && (
            <div className="absolute inset-0 bg-[#67238A]/85 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
              <ArrowUpCircle className="w-10 h-10 animate-bounce mb-2" />
              <p className="text-xs font-bold">Drop to replace this image</p>
            </div>
          )}

          {/* Quick Remove & Replace controls */}
          <div className="absolute top-2 right-2 flex items-center space-x-1.5 z-10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full shadow text-[10px] px-2.5 transition-colors font-medium flex items-center gap-1"
              title="Replace image"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center ${
            aspectRatio === 'portrait'
              ? 'w-48 max-w-full aspect-[9/16]'
              : 'w-full max-w-sm h-40'
          } border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragging
              ? 'border-[#67238A] bg-purple-50/60 ring-4 ring-[#67238A]/15 scale-[1.01]'
              : 'border-[#E8E8EC] hover:border-[#67238A] bg-[#FAFAFC] hover:bg-purple-50/20'
          }`}
        >
          <div className="flex flex-col items-center justify-center py-5 text-center px-4">
            {loading ? (
              <Loader2 className="w-9 h-9 text-[#67238A] animate-spin mb-2.5" />
            ) : isDragging ? (
              <ArrowUpCircle className="w-9 h-9 text-[#67238A] animate-bounce mb-2.5" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-purple-100/60 text-[#67238A] flex items-center justify-center mb-2.5">
                <Upload className="w-5 h-5" />
              </div>
            )}

            <p className="text-xs font-bold text-[#172033]">
              {loading
                ? 'Uploading...'
                : isDragging
                ? 'Drop image here to upload'
                : 'Drag & drop image here, or browse'}
            </p>
            <p className="text-[11px] text-[#667085] mt-1">
              Supports JPEG, PNG, WebP (auto-compressed to WebP)
            </p>
          </div>
        </div>
      )}

      {/* Hidden native input accessible via click */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        disabled={loading}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
