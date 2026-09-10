import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { BlogClient } from './BlogClient';
import { buildMetadata } from '@/lib/seo';
import { getCategories, getPublishedPosts } from '@/lib/db/queries';

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: 'All Senior Pet Health Articles',
  description:
    'Every Grey Muzzle Guide article on senior dog and cat health — arthritis, diabetes, nutrition, mobility aids, and urgent warning signs. Filter by topic or tag.',
  path: '/blog',
});

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  return (
    <>
      <PageHero
        eyebrow="Article library"
        title="Every guide, in one place"
        description="Long-form, veterinarian-reviewed explainers on the conditions that show up most in dogs and cats over seven. Filter by topic to find what applies to your pet."
      />
      <BlogClient allPosts={posts} categories={categories} />
    </>
  );
}
