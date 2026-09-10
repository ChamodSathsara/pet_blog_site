'use client';

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { PostCard } from '@/components/PostCard';
import { AdSlot } from '@/components/AdSlot';
import { Newsletter } from '@/components/Newsletter';
import { Button } from '@/components/ui/Button';
import type { Category, Post } from '@/lib/types/post';
import { cn } from '@/lib/utils/cn';

const PAGE_SIZE = 6;

export function BlogClient({ allPosts, categories }: { allPosts: Post[]; categories: Category[] }) {
  const tags = useMemo(() => Array.from(new Set(allPosts.flatMap((post) => post.tags))).sort(), [allPosts]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return allPosts.filter((post) => {
      const categoryMatch = activeCategory === 'all' || post.category === activeCategory;
      const tagMatch = activeTag === 'all' || post.tags.includes(activeTag);
      return categoryMatch && tagMatch;
    });
  }, [allPosts, activeCategory, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveTag('all');
    setPage(1);
  };

  return (
    <div className="container py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {[{ slug: 'all', name: 'All topics' }, ...categories].map((category) => (
              <button
                key={category.slug}
                type="button"
                aria-pressed={activeCategory === category.slug}
                onClick={() => {
                  setActiveCategory(category.slug);
                  setPage(1);
                }}
                className={cn(
                  'rounded-full border px-4 py-2 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  activeCategory === category.slug
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground/75 hover:border-primary/50 hover:text-primary'
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
            <span className="text-sm font-medium text-muted-foreground">Tags:</span>
            {['all', ...tags].map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={activeTag === tag}
                onClick={() => {
                  setActiveTag(tag);
                  setPage(1);
                }}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[14px] transition-colors',
                  activeTag === tag ? 'bg-secondary font-medium text-secondary-foreground' : 'text-muted-foreground hover:text-primary'
                )}
              >
                {tag === 'all' ? 'all tags' : `#${tag}`}
              </button>
            ))}
          </div>

          <p role="status" className="mt-6 text-[15px] text-muted-foreground">
            Showing {visible.length} of {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          </p>

          {visible.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <SearchX className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">No articles match that combination yet</h2>
              <p className="mx-auto mt-2 max-w-md text-[17px] text-muted-foreground">
                We publish two to four new guides a month. Clear the filters to see everything currently in the library.
              </p>
              <Button onClick={resetFilters} variant="outline" size="lg" className="mt-5 h-11 px-5 text-base">
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {visible.map((post, index) => (
                <React.Fragment key={post.slug}>
                  <PostCard post={post} variant="horizontal" headingLevel="h2" />
                  {index === 1 && <AdSlot position="in-feed" />}
                </React.Fragment>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-between">
              <Button variant="outline" size="lg" className="h-11 px-4 text-base" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
                Previous
              </Button>
              <p className="text-[15px] text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-4 text-base"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            </nav>
          )}
        </div>

        <aside className="space-y-8">
          <AdSlot position="sidebar" />
          <Newsletter variant="inline" />
        </aside>
      </div>
    </div>
  );
}
