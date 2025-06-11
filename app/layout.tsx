import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'バイブルスタディサポート',
  description: '聖書の教えを学び、深く理解するためのサポートツール',
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
