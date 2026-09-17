import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { PostCard } from '@/components/PostCard';
import { AdSlot } from '@/components/AdSlot';
import { Newsletter } from '@/components/Newsletter';
import type { Category, Post } from '@/lib/types/post';
import { cn } from '@/lib/utils/cn';

interface BlogClientProps {
  posts: Post[];
  categories: Category[];
  tags: string[];
  activeCategory: string;
  activeTag: string;
  page: number;
  total: number;
  totalPages: number;
}

function blogHref(category: string, tag: string, page = 1) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (tag) params.set('tag', tag);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : '/blog';
}

export function BlogClient({ posts, categories, tags, activeCategory, activeTag, page, total, totalPages }: BlogClientProps) {
  return (
    <div className="container py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {[{ slug: '', name: 'All topics' }, ...categories].map((category) => (
              <Link
                key={category.slug || 'all'}
                href={blogHref(category.slug, activeTag)}
                aria-current={activeCategory === category.slug ? 'page' : undefined}
                className={cn(
                  'rounded-full border px-4 py-2 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  activeCategory === category.slug
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground/75 hover:border-primary/50 hover:text-primary'
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
            <span className="text-sm font-medium text-muted-foreground">Tags:</span>
            {['', ...tags].map((tag) => (
              <Link
                key={tag || 'all'}
                href={blogHref(activeCategory, tag)}
                aria-current={activeTag === tag ? 'page' : undefined}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  activeTag === tag ? 'bg-secondary font-medium text-secondary-foreground' : 'text-muted-foreground hover:text-primary'
                )}
              >
                {tag ? `#${tag}` : 'all tags'}
              </Link>
            ))}
          </div>

          <p role="status" className="mt-6 text-[15px] text-muted-foreground">
            Showing {posts.length} of {total} {total === 1 ? 'article' : 'articles'}
          </p>

          {posts.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <SearchX className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">No articles match that combination yet</h2>
              <p className="mx-auto mt-2 max-w-md text-[17px] text-muted-foreground">
                We publish two to four new guides a month. Clear the filters to see everything currently in the library.
              </p>
              <Link href="/blog" className="mt-5 inline-flex h-11 items-center justify-center rounded-xl border border-input bg-card px-5 text-base font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {posts.map((post, index) => (
                <React.Fragment key={post.slug}>
                  <PostCard post={post} variant="horizontal" headingLevel="h2" />
                  {index === 1 && <AdSlot position="in-feed" />}
                </React.Fragment>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-between">
              {page > 1 ? (
                <Link href={blogHref(activeCategory, activeTag, page - 1)} rel="prev" className="inline-flex h-11 items-center justify-center rounded-xl border border-input bg-card px-4 text-base font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                  <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" /> Previous
                </Link>
              ) : <span className="inline-flex h-11 items-center rounded-xl border border-input px-4 text-base opacity-50"><ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" /> Previous</span>}
              <p className="text-[15px] text-muted-foreground">Page {page} of {totalPages}</p>
              {page < totalPages ? (
                <Link href={blogHref(activeCategory, activeTag, page + 1)} rel="next" className="inline-flex h-11 items-center justify-center rounded-xl border border-input bg-card px-4 text-base font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                  Next <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              ) : <span className="inline-flex h-11 items-center rounded-xl border border-input px-4 text-base opacity-50">Next <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></span>}
            </nav>
          )}
        </div>

        <aside className="space-y-8"><AdSlot position="sidebar" /><Newsletter variant="inline" /></aside>
      </div>
    </div>
  );
}
