import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function BrandLogo({ className = 'h-10 sm:h-11 w-auto', width, height }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className="inline-flex items-center transition-opacity hover:opacity-95 flex-shrink-0"
      aria-label="Growing Fit Home"
    >
      <img
        src="/growfit logo.png"
        alt="Growing Fit — School of Health & Physical Education"
        className={`max-h-11 max-w-[190px] w-auto h-auto object-contain block ${className}`}
        style={{
          maxHeight: height ? `${height}px` : '44px',
          maxWidth: width ? `${width}px` : '185px',
        }}
      />
    </Link>
  );
}
