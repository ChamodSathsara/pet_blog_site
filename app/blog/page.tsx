import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { BlogClient } from './BlogClient';
import { buildMetadata } from '@/lib/seo';
import { getCategories, getPublishedPosts } from '@/lib/db/queries';

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: 'Home Maintenance Articles & DIY Guides',
  description:
    'Browse expert-reviewed home maintenance guides covering seasonal upkeep, plumbing, HVAC, roofing, tools, and safe DIY repairs.',
  path: '/blog',
});

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  return (
    <>
      <PageHero
        eyebrow="Article library"
        title="Every guide, in one place"
        description="Detailed, expert-reviewed guides for preventing damage, diagnosing common problems, and deciding what to repair yourself. Filter by topic to find the job in front of you."
      />
      <BlogClient allPosts={posts} categories={categories} />
    </>
  );
}
