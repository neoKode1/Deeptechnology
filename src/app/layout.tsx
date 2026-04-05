import type { Metadata } from 'next';
import { Inter, Poppins, Manrope, Roboto } from 'next/font/google';
import { Suspense } from 'react';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import Analytics from '@/components/Analytics';
import CookieBanner from '@/components/CookieBanner';
import ConsultChat from '@/components/ConsultChat';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Deep Tech — Software & Robotics',
  description: 'A multi-disciplinary technology company building at the intersection of AI and real-world systems. Software development and robotics consulting.',
  keywords: 'Deep Tech, AI, software development, robotics, automation, AI agents, edge compute, autonomous systems, Chad Neo',
  authors: [{ name: 'Deep Tech' }],
  metadataBase: new URL('https://deeptechnologies.dev'),
  openGraph: {
    title: 'Deep Tech',
    description: 'Software & Robotics — building at the intersection of AI and real-world systems.',
    siteName: 'Deep Tech',
    type: 'website',
    url: 'https://deeptechnologies.dev',
    images: [{ url: '/media/deeptech.png', width: 1200, height: 630, alt: 'Deep Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deep Tech',
    description: 'Software & Robotics — building at the intersection of AI and real-world systems.',
    images: ['/media/deeptech.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        poppins.variable,
        manrope.variable,
        roboto.variable
      )}>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <CookieBanner />
        <ConsultChat />
        {children}
      </body>
    </html>
  );
} 