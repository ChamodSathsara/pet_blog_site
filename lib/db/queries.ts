import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { and, arrayContains, asc, count, desc, eq, ne, type SQL } from 'drizzle-orm';
import { db } from './index';
import { authors, categories, posts } from './schema';
import type { Author, Category, Post } from '@/lib/types/post';

const PUBLIC_CACHE_SECONDS = 60;

type JoinedPost = { post: typeof posts.$inferSelect; category: typeof categories.$inferSelect; author: typeof authors.$inferSelect };
export interface PublishedPostsPage { posts: Post[]; total: number; page: number; totalPages: number }

const toPost = ({ post, category }: JoinedPost): Post => ({
  title: post.title, slug: post.slug,
  date: (post.publishedAt ?? post.createdAt).toISOString().slice(0, 10),
  updatedDate: post.updatedAt.toISOString().slice(0, 10), excerpt: post.excerpt,
  seoTitle: post.seoTitle || undefined, metaDescription: post.metaDescription || undefined,
  canonicalUrl: post.canonicalUrl || undefined, noIndex: post.noIndex,
  coverImage: post.coverImageUrl || '/home-maintenance-hero.png', coverAlt: post.coverAlt || post.title,
  category: category.slug, categoryName: category.name, tags: post.tags, author: post.authorId, content: post.content,
});
const toAuthor = (author: typeof authors.$inferSelect): Author => ({
  id: author.id, name: author.name, credentials: author.credentials || '', bio: author.bio || '', avatar: author.avatarUrl || '',
});
const joined = () => db.select({ post: posts, category: categories, author: authors }).from(posts)
  .innerJoin(categories, eq(posts.categoryId, categories.id)).innerJoin(authors, eq(posts.authorId, authors.id));

const publishedPostsCached = unstable_cache(
  async () => (await joined().where(eq(posts.status, 'published')).orderBy(desc(posts.publishedAt))).map(toPost),
  ['published-posts'], { revalidate: PUBLIC_CACHE_SECONDS, tags: ['posts'] },
);
export const getPublishedPosts = cache(publishedPostsCached);

export const getPublishedPost = cache(async (slug: string) => unstable_cache(async () => {
  const [row] = await joined().where(and(eq(posts.slug, slug), eq(posts.status, 'published'))).limit(1);
  return row ? { post: toPost(row), author: toAuthor(row.author), category: {
    id: row.category.id, slug: row.category.slug, name: row.category.name, description: row.category.description || '',
  } } : null;
}, ['published-post', slug], { revalidate: PUBLIC_CACHE_SECONDS, tags: ['posts', `post-${slug}`] })());

export const getPublishedPostsByCategory = cache(async (slug: string) => unstable_cache(
  async () => (await joined().where(and(eq(categories.slug, slug), eq(posts.status, 'published'))).orderBy(desc(posts.publishedAt))).map(toPost),
  ['published-posts-by-category', slug], { revalidate: PUBLIC_CACHE_SECONDS, tags: ['posts', 'categories', `category-${slug}`] },
)());

export const getRelatedPublishedPosts = cache(async (slug: string, categoryId: string, tags: string[], limit = 2) => unstable_cache(async () => {
  const rows = await joined().where(and(eq(posts.status, 'published'), ne(posts.slug, slug)));
  return rows.map((row) => ({ post: toPost(row), score: (row.post.categoryId === categoryId ? 2 : 0) + row.post.tags.filter((tag) => tags.includes(tag)).length }))
    .sort((a, b) => b.score - a.score).slice(0, limit).map(({ post }) => post);
}, ['related-published-posts', slug, categoryId, tags.join('|'), String(limit)], {
  revalidate: PUBLIC_CACHE_SECONDS, tags: ['posts', `post-${slug}`],
})());

const categoriesCached = unstable_cache(async (): Promise<(Category & { id: string })[]> =>
  (await db.select().from(categories).orderBy(asc(categories.name))).map((category) => ({
    id: category.id, slug: category.slug, name: category.name, description: category.description || '',
  })), ['categories'], { revalidate: PUBLIC_CACHE_SECONDS, tags: ['categories'] });
export const getCategories = cache(categoriesCached);

export const getCategoryBySlug = cache(async (slug: string) => unstable_cache(async () => {
  const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return category ? { id: category.id, slug: category.slug, name: category.name, description: category.description || '' } : null;
}, ['category-by-slug', slug], { revalidate: PUBLIC_CACHE_SECONDS, tags: ['categories', `category-${slug}`] })());

const authorsCached = unstable_cache(async () => (await db.select().from(authors).orderBy(asc(authors.name))).map(toAuthor),
  ['authors'], { revalidate: PUBLIC_CACHE_SECONDS, tags: ['authors'] });
export const getAuthors = cache(authorsCached);

const publishedTagsCached = unstable_cache(async () => {
  const rows = await db.select({ tags: posts.tags }).from(posts).where(eq(posts.status, 'published'));
  return Array.from(new Set(rows.flatMap((row) => row.tags))).sort((a, b) => a.localeCompare(b));
}, ['published-tags'], { revalidate: PUBLIC_CACHE_SECONDS, tags: ['posts'] });
export const getPublishedTags = cache(publishedTagsCached);

export const getPublishedPostsPage = cache(async (categorySlug: string, tag: string, requestedPage: number, pageSize: number) => unstable_cache(async (): Promise<PublishedPostsPage> => {
  const conditions: SQL[] = [eq(posts.status, 'published')];
  if (categorySlug) conditions.push(eq(categories.slug, categorySlug));
  if (tag) conditions.push(arrayContains(posts.tags, [tag]));
  const where = and(...conditions);
  const [{ total }] = await db.select({ total: count() }).from(posts).innerJoin(categories, eq(posts.categoryId, categories.id)).where(where);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const rows = await joined().where(where).orderBy(desc(posts.publishedAt)).limit(pageSize).offset((page - 1) * pageSize);
  return { posts: rows.map(toPost), total, page, totalPages };
}, ['published-posts-page', categorySlug, tag, String(requestedPage), String(pageSize)], {
  revalidate: PUBLIC_CACHE_SECONDS, tags: ['posts', 'categories', ...(categorySlug ? [`category-${categorySlug}`] : [])],
})());
