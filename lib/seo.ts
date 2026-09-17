import type { Metadata } from 'next';

export const SITE_NAME = 'Housewise Journal';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://housewisejournal.com';
export const DEFAULT_IMAGE = '/home-maintenance-hero.png';
export const TWITTER_HANDLE = '@housewisejournal';
// update test

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  tags?: string[];
  noIndex?: boolean;
  canonicalUrl?: string;
}

/**
 * Builds a Next.js Metadata object for a route. This is rendered server-side
 * into real <title>/<meta>/<link rel="canonical"> tags in the initial HTML,
 * so search engines and social crawlers see it without executing JavaScript —
 * unlike the previous client-side `useSeo` hook, which mutated `document.head`
 * after mount.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  authorName,
  tags,
  noIndex = false,
  canonicalUrl,
}: BuildMetadataInput): Metadata {
  const url = canonicalUrl || `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: tags,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
    openGraph: {
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      images: [{ url: image }],
      type,
      locale: 'en_US',
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
      ...(type === 'article' && authorName ? { authors: [authorName] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      site: TWITTER_HANDLE,
    },
  };
}

interface ArticleJsonLdInput {
  title: string;
  description: string;
  image: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
}

export function articleJsonLd({
  title,
  description,
  image,
  path,
  publishedTime,
  modifiedTime,
  authorName,
}: ArticleJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: image.startsWith('http') ? image : `${SITE_URL}${image}`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    ...(authorName ? { author: { '@type': 'Person', name: authorName } } : {}),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/housewise-logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
