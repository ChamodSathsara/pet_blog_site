import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { Post } from '@/lib/types/post';
import { formatDate, getPostReadTime } from '@/lib/utils/posts';
import { cn } from '@/lib/utils/cn';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'horizontal' | 'compact';
  className?: string;
  headingLevel?: 'h2' | 'h3';
}

export function PostCard({ post, variant = 'default', className, headingLevel = 'h3' }: PostCardProps) {
  const category = post.categoryName ? { slug: post.category, name: post.categoryName } : null;
  const readTime = getPostReadTime(post);
  const Heading = headingLevel;

  if (variant === 'compact') {
    return (
      <article className={cn('group', className)}>
        <Link href={`/blog/${post.slug}`} className="flex items-start gap-4">
          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              width={320}
              height={213}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <Heading className="font-serif text-base font-semibold leading-snug text-foreground group-hover:text-primary">
              {post.title}
            </Heading>
            <p className="mt-1 text-sm text-muted-foreground">{readTime} min read</p>
          </div>
        </Link>
      </article>
    );
  }

  const isHorizontal = variant === 'horizontal';

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[0_12px_32px_-18px_rgba(46,42,38,0.35)]',
        isHorizontal && 'md:grid md:grid-cols-2 md:items-stretch',
        className
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden bg-muted" tabIndex={-1} aria-hidden="true">
        <div className={cn('relative w-full', isHorizontal ? 'h-56 md:h-full' : 'aspect-[3/2]')}>
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="flex flex-col p-6">
        {category && (
          <Link href={`/category/${category.slug}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:underline">
            {category.name}
          </Link>
        )}
        <Heading className="mt-3 font-serif text-xl font-semibold leading-snug text-foreground md:text-[23px]">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {readTime} min read
          </span>
        </div>
      </div>
    </article>
  );
}
