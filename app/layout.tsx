import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Cabana Monet | Alto da Galícia',
  description:
    'Refúgio privativo para dois com piscina aquecida, banheira e vista para as montanhas em Bom Jesus dos Perdões.',
  openGraph: {
    title: 'Cabana Monet | Alto da Galícia',
    description: 'Quando foi a última vez que você não teve pressa? Um refúgio privativo para dois entre montanhas.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Cabana Monet — Seu tempo pede outra paisagem.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cabana Monet | Alto da Galícia',
    description: 'Quando foi a última vez que você não teve pressa? Um refúgio privativo para dois entre montanhas.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
