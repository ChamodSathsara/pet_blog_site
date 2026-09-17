import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { PostCard } from '@/components/PostCard';
import { AdSlot } from '@/components/AdSlot';
import { Newsletter } from '@/components/Newsletter';
import { getCategories, getCategoryBySlug, getPublishedPostsByCategory } from '@/lib/db/queries';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils/cn';

interface CategoryPageProps {
  params: { category: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    return buildMetadata({
      title: 'Category not found',
      description: 'This category could not be found on Housewise Journal.',
      path: `/category/${params.category}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${category.name} Articles`,
    description: category.description,
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();
  const [categoryPosts, categories] = await Promise.all([getPublishedPostsByCategory(category.slug), getCategories()]);

  return (
    <>
      <PageHero eyebrow="Topic" title={category.name} description={category.description} />

      <div className="container py-12">
        <nav aria-label="All categories" className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              aria-current={item.slug === category.slug ? 'page' : undefined}
              className={cn(
                'rounded-full border px-4 py-2 text-[15px] font-medium transition-colors',
                item.slug === category.slug
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground/75 hover:border-primary/50 hover:text-primary'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            {categoryPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <h2 className="font-serif text-xl font-semibold text-foreground">Nothing published here yet</h2>
                <p className="mx-auto mt-2 max-w-md text-[17px] text-muted-foreground">
                  We're working on {category.name.toLowerCase()} guides now. Join the newsletter and you'll get the first one as it
                  goes live.
                </p>
                <Link href="/blog" className="mt-5 inline-block text-[17px] font-medium text-primary hover:underline">
                  Browse every article instead
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {categoryPosts.map((post) => (
                  <PostCard key={post.slug} post={post} headingLevel="h2" />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <AdSlot position="sidebar" />
            <Newsletter variant="inline" />
          </aside>
        </div>
      </div>
    </>
  );
}
