import type { Metadata } from 'next';
import { Fraunces, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/JsonLd';
import { SITE_NAME, SITE_URL, DEFAULT_IMAGE, websiteJsonLd } from '@/lib/seo';
import { Analytics } from '@/components/Analytics';
import { getCategories } from '@/lib/db/queries';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Practical Home Maintenance Guides`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Practical, expert-reviewed home maintenance guides, seasonal checklists, repair costs, and clear advice on when to DIY or hire a professional.',
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [{ url: DEFAULT_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@housewisejournal',
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-screen w-full flex-col bg-background font-sans">
        <JsonLd data={websiteJsonLd()} />
        <Header categories={categories} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer categories={categories} />
        <Analytics />
      </body>
    </html>
  );
}
