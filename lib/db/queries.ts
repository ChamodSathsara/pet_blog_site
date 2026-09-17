import { and, asc, desc, eq, ne } from 'drizzle-orm';
import { db } from './index';
import { authors, categories, posts } from './schema';
import type { Author, Category, Post } from '@/lib/types/post';

type JoinedPost = {
  post: typeof posts.$inferSelect;
  category: typeof categories.$inferSelect;
  author: typeof authors.$inferSelect;
};

const toPost = ({ post, category }: JoinedPost): Post => ({
  title: post.title,
  slug: post.slug,
  date: (post.publishedAt ?? post.createdAt).toISOString().slice(0, 10),
  updatedDate: post.updatedAt.toISOString().slice(0, 10),
  excerpt: post.excerpt,
  seoTitle: post.seoTitle || undefined,
  metaDescription: post.metaDescription || undefined,
  canonicalUrl: post.canonicalUrl || undefined,
  noIndex: post.noIndex,
  coverImage: post.coverImageUrl || '/home-maintenance-hero.png',
  coverAlt: post.coverAlt || post.title,
  category: category.slug,
  categoryName: category.name,
  tags: post.tags,
  author: post.authorId,
  content: post.content,
});

const toAuthor = (author: typeof authors.$inferSelect): Author => ({
  id: author.id,
  name: author.name,
  credentials: author.credentials || '',
  bio: author.bio || '',
  avatar: author.avatarUrl || '',
});

const joined = () => db
  .select({ post: posts, category: categories, author: authors })
  .from(posts)
  .innerJoin(categories, eq(posts.categoryId, categories.id))
  .innerJoin(authors, eq(posts.authorId, authors.id));

export async function getPublishedPosts(): Promise<Post[]> {
  return (await joined().where(eq(posts.status, 'published')).orderBy(desc(posts.publishedAt))).map(toPost);
}

export async function getPublishedPost(slug: string) {
  const [row] = await joined().where(and(eq(posts.slug, slug), eq(posts.status, 'published'))).limit(1);
  return row ? {
    post: toPost(row),
    author: toAuthor(row.author),
    category: { id: row.category.id, slug: row.category.slug, name: row.category.name, description: row.category.description || '' },
  } : null;
}

export async function getPublishedPostsByCategory(slug: string) {
  return (await joined().where(and(eq(categories.slug, slug), eq(posts.status, 'published'))).orderBy(desc(posts.publishedAt))).map(toPost);
}

export async function getRelatedPublishedPosts(slug: string, categoryId: string, tags: string[], limit = 2) {
  const rows = await joined().where(and(eq(posts.status, 'published'), ne(posts.slug, slug)));
  return rows
    .map((row) => ({ post: toPost(row), score: (row.post.categoryId === categoryId ? 2 : 0) + row.post.tags.filter((tag) => tags.includes(tag)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export async function getCategories(): Promise<(Category & { id: string })[]> {
  return (await db.select().from(categories).orderBy(asc(categories.name))).map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description || '',
  }));
}

export async function getCategoryBySlug(slug: string) {
  const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return category ? { id: category.id, slug: category.slug, name: category.name, description: category.description || '' } : null;
}

export async function getAuthors() {
  return (await db.select().from(authors).orderBy(asc(authors.name))).map(toAuthor);
}
