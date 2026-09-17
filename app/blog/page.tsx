import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { BlogClient } from './BlogClient';
import { buildMetadata } from '@/lib/seo';
import { getCategories, getPublishedPostsPage, getPublishedTags } from '@/lib/db/queries';

export const revalidate = 60;
const PAGE_SIZE = 6;

interface BlogPageProps {
  searchParams: { category?: string | string[]; tag?: string | string[]; page?: string | string[] };
}

function value(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] || '' : param || '';
}

function filters(searchParams: BlogPageProps['searchParams']) {
  const category = value(searchParams.category).trim();
  const tag = value(searchParams.tag).trim();
  const parsedPage = Number.parseInt(value(searchParams.page), 10);
  return { category, tag, page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1 };
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { category, tag, page } = filters(searchParams);
  const isFilteredView = Boolean(category || tag || page > 1);
  const metadata = buildMetadata({
    title: 'Home Maintenance Articles & DIY Guides',
    description: 'Browse expert-reviewed home maintenance guides covering seasonal upkeep, plumbing, HVAC, roofing, tools, and safe DIY repairs.',
    path: '/blog',
    noIndex: isFilteredView,
  });
  if (isFilteredView) metadata.robots = { index: false, follow: true };
  return metadata;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, tag, page: requestedPage } = filters(searchParams);
  const [result, categories, tags] = await Promise.all([
    getPublishedPostsPage(category, tag, requestedPage, PAGE_SIZE),
    getCategories(),
    getPublishedTags(),
  ]);
  return (
    <>
      <PageHero eyebrow="Article library" title="Every guide, in one place" description="Detailed, expert-reviewed guides for preventing damage, diagnosing common problems, and deciding what to repair yourself. Filter by topic to find the job in front of you." />
      <BlogClient posts={result.posts} categories={categories} tags={tags} activeCategory={category} activeTag={tag} page={result.page} total={result.total} totalPages={result.totalPages} />
    </>
  );
}
