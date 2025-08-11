import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth/auth-context';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PipeGallery | Contemporary Art Gallery',
  description: 'Contemporary art gallery showcasing exhibitions, artists, and cultural events in Seoul',
  keywords: ['contemporary art', 'gallery', 'exhibitions', 'artists', 'culture', 'Seoul', 'Korea'],
  authors: [{ name: 'PipeGallery Team' }],
  openGraph: {
    title: 'PipeGallery | Contemporary Art Gallery',
    description: 'Contemporary art gallery showcasing exhibitions, artists, and cultural events in Seoul',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'PipeGallery',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PipeGallery | Contemporary Art Gallery',
    description: 'Contemporary art gallery showcasing exhibitions, artists, and cultural events in Seoul',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}