import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from './site-data';

const editorial = Fraunces({
  variable: '--font-editorial',
  subsets: ['latin'],
  display: 'swap',
});

const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  title: 'Cabana Monet — Alto da Galícia',
  description:
    'Refúgio privativo para dois com piscina aquecida, banheira e vista para as montanhas em Bom Jesus dos Perdões.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Alto da Galícia',
    title: 'Cabana Monet — Alto da Galícia',
    description: 'Quando foi a última vez que você não teve pressa? Um refúgio privativo para dois entre montanhas.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Cabana Monet — Seu tempo pede outra paisagem.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cabana Monet — Alto da Galícia',
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
        className={`${editorial.variable} ${sans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
