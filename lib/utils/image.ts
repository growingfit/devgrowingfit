/**
 * Optimizes image URLs, adding Cloudinary dynamic transformations (f_auto, q_auto)
 * and responsive width constraints for ultra-fast CDN delivery.
 */
export function optimizeImageUrl(
  url?: string | null,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco';
    format?: 'auto' | 'webp' | 'avif';
  } = {}
): string {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  // Cloudinary image URL transformation
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/upload/')) {
    // Avoid double-injecting if already has transformations
    if (trimmed.includes('/upload/f_auto') || trimmed.includes('/upload/q_auto')) {
      return trimmed;
    }

    const { width, height, quality = 'auto', format = 'auto' } = options;
    const transforms: string[] = [`f_${format}`, `q_${quality}`];

    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`, 'c_fill');

    const transformString = transforms.join(',');
    return trimmed.replace('/upload/', `/upload/${transformString}/`);
  }

  return trimmed;
}
