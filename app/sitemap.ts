import type { MetadataRoute } from 'next';
import { getCategories, getPublishedPosts } from '@/lib/db/queries';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
