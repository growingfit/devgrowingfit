import { SportsCategory } from '@/types/database';

// 12 Reference sports matching exact user mockup
export const DEFAULT_REFERENCE_SPORTS: SportsCategory[] = [
  { id: 'ref-1', name: 'Kung Fu', slug: 'kung-fu', icon: 'kung-fu', sort_order: 1, is_active: true },
  { id: 'ref-2', name: 'Muay Thai', slug: 'muay-thai', icon: 'boxing', sort_order: 2, is_active: true },
  { id: 'ref-3', name: 'Boxing', slug: 'boxing', icon: 'boxing', sort_order: 3, is_active: true },
  { id: 'ref-4', name: 'Roller Skating', slug: 'roller-skating', icon: 'roller-skating', sort_order: 4, is_active: true },
  { id: 'ref-5', name: 'Football', slug: 'football', icon: 'football', sort_order: 5, is_active: true },
  { id: 'ref-6', name: 'Swimming', slug: 'swimming', icon: 'swimming', sort_order: 6, is_active: true },
  { id: 'ref-7', name: 'Badminton', slug: 'badminton', icon: 'badminton', sort_order: 7, is_active: true },
  { id: 'ref-8', name: 'Cricket', slug: 'cricket', icon: 'cricket', sort_order: 8, is_active: true },
  { id: 'ref-9', name: 'Fitness', slug: 'fitness', icon: 'fitness', sort_order: 9, is_active: true },
  { id: 'ref-10', name: 'Athletics', slug: 'athletics', icon: 'athletics', sort_order: 10, is_active: true },
  { id: 'ref-11', name: 'Table Tennis', slug: 'table-tennis', icon: 'table-tennis', sort_order: 11, is_active: true },
  { id: 'ref-12', name: 'Martial Arts', slug: 'martial-arts', icon: 'martial-arts', sort_order: 12, is_active: true },
];

export const getSportIconUrl = (iconName?: string, slug?: string): string => {
  if (!iconName && !slug) return '/icons/kung-fu.svg';

  const trimmedIcon = (iconName || '').trim();

  // 1. If an actual image URL or upload path was provided (Cloudinary, Supabase, data URL, local path)
  if (
    trimmedIcon.startsWith('http://') ||
    trimmedIcon.startsWith('https://') ||
    trimmedIcon.startsWith('data:') ||
    trimmedIcon.startsWith('blob:') ||
    trimmedIcon.startsWith('//') ||
    (trimmedIcon.startsWith('/') && !trimmedIcon.startsWith('/icons/'))
  ) {
    return trimmedIcon;
  }

  // 2. If it is already a direct path inside /icons/
  if (trimmedIcon.startsWith('/icons/')) {
    return trimmedIcon;
  }

  // 3. If iconName has an image extension (.svg, .png, .jpg, .webp)
  if (
    trimmedIcon.endsWith('.svg') ||
    trimmedIcon.endsWith('.png') ||
    trimmedIcon.endsWith('.jpg') ||
    trimmedIcon.endsWith('.jpeg') ||
    trimmedIcon.endsWith('.webp')
  ) {
    return trimmedIcon.startsWith('/') ? trimmedIcon : `/icons/${trimmedIcon}`;
  }

  // 4. Match exact predefined icon slugs only when not an uploaded image
  const key = (trimmedIcon || slug || '').toLowerCase().trim();
  if (key === 'kung-fu' || key === 'kungfu') return '/icons/kung-fu.svg';
  if (key === 'muay-thai' || key === 'muaythai') return '/icons/muay-thai.svg';
  if (key === 'boxing') return '/icons/boxing.svg';
  if (key === 'swimming') return '/icons/swimming.svg';
  if (key === 'wushu') return '/icons/wushu.svg';
  if (key === 'football' || key === 'soccer') return '/icons/football.svg';
  if (key === 'roller-skating' || key === 'skating') return '/icons/roller-skating.svg';
  if (key === 'yoga') return '/icons/yoga.svg';
  if (key === 'gymnastics') return '/icons/gymnastics.svg';
  if (key === 'badminton') return '/icons/badminton.svg';
  if (key === 'cricket') return '/icons/cricket.svg';
  if (key === 'fitness') return '/icons/fitness.svg';
  if (key === 'athletics') return '/icons/athletics.svg';
  if (key === 'table-tennis') return '/icons/table-tennis.svg';
  if (key === 'martial-arts') return '/icons/martial-arts.svg';
  if (key === 'basketball') return '/icons/basketball.svg';

  if (trimmedIcon) {
    return trimmedIcon.startsWith('/') ? trimmedIcon : `/icons/${trimmedIcon}.svg`;
  }

  return '/icons/kung-fu.svg';
};
