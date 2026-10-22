import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SplashScreen } from '@/components/layout/SplashScreen';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Growing Fit — School of Health & Physical Education',
  description:
    'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow. Professional training in Badminton, Football, Roller Skating, Martial Arts & Swimming.',
  keywords: [
    'Growing Fit',
    'School of Health & Physical Education',
    'Kids Sports Academy',
    'Badminton for kids',
    'Football Academy',
    'Roller Skating Academy',
    'Physical Education Kerala',
    'Calicut Sports Centre',
    'Kochi Sports Centre',
  ],
  authors: [{ name: 'Growing Fit Academy' }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://growingfit.in')
  ),
  openGraph: {
    title: 'Growing Fit — School of Health & Physical Education',
    description:
      'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow.',
    url: '/',
    siteName: 'Growing Fit',
    images: [
      {
        url: '/growfit logo.png',
        width: 1200,
        height: 630,
        alt: 'Growing Fit Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/growfit logo.png',
    apple: '/growfit logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preload" as="image" href="/growingfit-whitelogo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('gf_splash_shown')==='true'){document.documentElement.classList.add('gf-no-splash');}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-[#172033] bg-white">
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
