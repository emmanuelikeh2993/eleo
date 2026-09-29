import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT'],
});

export const metadata: Metadata = {
  title: 'ELEO — Campus Egg Commerce',
  description: 'Fresh Eggs. Simple Ordering. Direct to your campus hostel with verified bank transfer.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0F2F1D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans min-h-screen bg-[#F9FAF8] text-[#1C201D] flex flex-col relative antialiased selection:bg-[#DCFCE7] selection:text-[#0F2F1D]">
        {/* Global Cinematic feTurbulence Noise Layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <StoreProvider>
          <ServiceWorkerRegister />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
