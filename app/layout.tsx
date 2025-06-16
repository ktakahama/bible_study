import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BIBLE DIVE IN!',
  description: '誰でも簡単、ひとりで学べる聖書スタディガイド',
  openGraph: {
    title: 'BIBLE DIVE IN!',
    description: '誰でも簡単、ひとりで学べる聖書スタディガイド',
    url: 'https://bible-study-zeta.vercel.app/',
    siteName: 'BIBLE DIVE IN!',
    images: [
      {
        url: 'https://bible-study-zeta.vercel.app/ogp.png',
        width: 1200,
        height: 630,
        alt: 'BIBLE DIVE IN! 誰でも簡単、ひとりで学べる聖書スタディガイド',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BIBLE DIVE IN!',
    description: 'BIBLE DIVE IN! 誰でも簡単、ひとりで学べる聖書スタディガイド',
    images: ['https://bible-study-zeta.vercel.app/ogp.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full bg-gray-50">
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
