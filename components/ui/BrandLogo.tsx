import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  logoUrl?: string | null;
}

export function BrandLogo({ className = 'h-10 sm:h-11 w-auto', width, height }: BrandLogoProps) {
  // Brand logo is hardcoded in code as specified
  const logoSrc = '/growfit logo.png';

  return (
    <Link
      href="/"
      className="inline-flex items-center transition-opacity hover:opacity-95 flex-shrink-0"
      aria-label="Growing Fit Home"
    >
      <img
        src={logoSrc}
        alt="Growing Fit"
        className={`max-h-11 max-w-[190px] w-auto h-auto object-contain block ${className}`}
        style={{
          maxHeight: height ? `${height}px` : '44px',
          maxWidth: width ? `${width}px` : '185px',
        }}
      />
    </Link>
  );
}
