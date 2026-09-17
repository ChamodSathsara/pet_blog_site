import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock } from 'lucide-react';
import { Markdown } from '@/components/Markdown';
import { TableOfContents } from '@/components/TableOfContents';
import { AuthorBio } from '@/components/AuthorBio';
import { ShareButtons } from '@/components/ShareButtons';
import { AdSlot } from '@/components/AdSlot';
import { PostCard } from '@/components/PostCard';
import { Newsletter } from '@/components/Newsletter';
import { JsonLd } from '@/components/JsonLd';
import { formatDate, getPostReadTime } from '@/lib/utils/posts';
import { getPublishedPost, getPublishedPostSlugs, getRelatedPublishedPosts } from '@/lib/db/queries';
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

interface PostPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await getPublishedPostSlugs();
  return rows.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const result = await getPublishedPost(params.slug);
  if (!result) {
    return buildMetadata({
      title: 'Article not found',
      description: 'This article could not be found.',
      path: `/blog/${params.slug}`,
      noIndex: true,
    });
  }

  const { post, author } = result;
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.updatedDate,
    authorName: author?.name,
    tags: post.tags,
    noIndex: post.noIndex,
    canonicalUrl: post.canonicalUrl,
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const result = await getPublishedPost(params.slug);
  if (!result) notFound();
  const { post, author, category } = result;
  const related = await getRelatedPublishedPosts(post.slug, category.id, post.tags, 2);
  const readTime = getPostReadTime(post);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          image: post.coverImage,
          path: `/blog/${post.slug}`,
          publishedTime: post.date,
          modifiedTime: post.updatedDate,
          authorName: author?.name ?? 'Housewise Journal',
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Articles', path: '/blog' },
          ...(category ? [{ name: category.name, path: `/category/${category.slug}` }] : []),
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <div className="border-b border-border bg-secondary/40">
        <div className="container py-8 md:py-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-[14px] text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <li>
                <Link href="/blog" className="hover:text-primary">
                  Articles
                </Link>
              </li>
              {category && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <li>
                    <Link href={`/category/${category.slug}`} className="hover:text-primary">
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>

          <div className="mt-6 max-w-3xl">
            {category && (
              <Link href={`/category/${category.slug}`} className="text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:underline">
                {category.name}
              </Link>
            )}
            <h1 className="mt-3 font-serif text-[32px] font-semibold leading-[1.1] text-foreground md:text-[46px]">{post.title}</h1>
            <p className="mt-4 text-[20px] leading-relaxed text-muted-foreground">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-muted-foreground">
              {author && (
                <span className="flex items-center gap-2">
                  <Image src={author.avatar} alt="" width={64} height={64} className="h-8 w-8 rounded-full object-cover" />
                  <span className="font-medium text-foreground">{author.name}</span>
                </span>
              )}
              <time dateTime={post.date}>Published {formatDate(post.date)}</time>
              {post.updatedDate && post.updatedDate !== post.date && <time dateTime={post.updatedDate}>Updated {formatDate(post.updatedDate)}</time>}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {readTime} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10 md:py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article>
            <figure>
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-muted">
                <Image src={post.coverImage} alt={post.coverAlt} fill priority sizes="(min-width: 1024px) 65vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-[14px] text-muted-foreground">{post.coverAlt}</figcaption>
            </figure>

            <div className="mt-8 lg:hidden">
              <div className="rounded-2xl border border-border bg-card p-6">
                <TableOfContents source={post.content} />
              </div>
            </div>

            <div className="mt-8 max-w-prose">
              <Markdown source={post.content} adAfterBlock={6} />
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-[14px] text-secondary-foreground">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>

            <div className="mt-10">
              <AdSlot position="below-content" />
            </div>

            {author && (
              <div className="mt-10">
                <AuthorBio author={author} />
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-terracotta/30 bg-sand p-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">A note on home-repair safety</h2>
              <p className="mt-2 text-[17px] leading-relaxed text-foreground/80">
                This article is general education, not an on-site inspection. Conditions, codes, and risks vary by home; use a licensed professional when work exceeds your training or equipment. Read our full{' '}
                <Link href="/disclaimer" className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
                  safety disclaimer
                </Link>
                .
              </p>
            </div>
          </article>

          <aside className="space-y-8">
            <div className="hidden lg:block">
              <div className="sticky top-28 space-y-8">
                <TableOfContents source={post.content} />
                <AdSlot position="sidebar" />
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-16">
            <h2 id="related-heading" className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
              Keep reading
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <PostCard key={item.slug} post={item} headingLevel="h3" />
              ))}
            </div>
          </section>
        )}

        <div className="mt-16">
          <Newsletter />
        </div>
      </div>
    </>
  );
}
