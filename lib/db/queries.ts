import { and, desc, eq, ne } from 'drizzle-orm';
import { db } from './index';
import { authors, categories, posts } from './schema';
import type { Author, Category, Post } from '@/lib/types/post';
import { categories as localCategories } from '@/lib/data/categories';
import { authors as localAuthors } from '@/lib/data/authors';
import { posts as localPosts } from '@/lib/data/posts';

type JoinedPost = { post: typeof posts.$inferSelect; category: typeof categories.$inferSelect; author: typeof authors.$inferSelect };
const activeCategorySlugs = new Set(localCategories.map((category) => category.slug));
const fallbackCategories = localCategories.map((category) => ({ ...category, id: category.slug }));
const toPost = ({ post, category }: JoinedPost): Post => ({ title: post.title, slug: post.slug, date: (post.publishedAt ?? post.createdAt).toISOString().slice(0, 10), updatedDate: post.updatedAt.toISOString().slice(0, 10), excerpt: post.excerpt, seoTitle: post.seoTitle || undefined, metaDescription: post.metaDescription || undefined, canonicalUrl: post.canonicalUrl || undefined, noIndex: post.noIndex, coverImage: post.coverImageUrl || '/home-maintenance-hero.png', coverAlt: post.coverAlt || post.title, category: category.slug, categoryName: category.name, tags: post.tags, author: post.authorId, content: post.content });
const toAuthor = (author: typeof authors.$inferSelect): Author => ({ id: author.id, name: author.name, credentials: author.credentials || '', bio: author.bio || '', avatar: author.avatarUrl || '' });
const joined = () => db.select({ post: posts, category: categories, author: authors }).from(posts).innerJoin(categories, eq(posts.categoryId, categories.id)).innerJoin(authors, eq(posts.authorId, authors.id));

export async function getPublishedPosts(): Promise<Post[]> {
  try { return (await joined().where(eq(posts.status, 'published')).orderBy(desc(posts.publishedAt))).filter(({ category }) => activeCategorySlugs.has(category.slug)).map(toPost); }
  catch { return localPosts; }
}
export async function getPublishedPost(slug: string) {
  try { const [row] = await joined().where(and(eq(posts.slug, slug), eq(posts.status, 'published'))).limit(1); if (row && activeCategorySlugs.has(row.category.slug)) return { post: toPost(row), author: toAuthor(row.author), category: { id: row.category.id, slug: row.category.slug, name: row.category.name, description: row.category.description || '' } }; }
  catch { /* local fallback below */ }
  const post = localPosts.find((item) => item.slug === slug); if (!post) return null;
  const category = fallbackCategories.find((item) => item.slug === post.category)!; const author = localAuthors.find((item) => item.id === post.author)!;
  return { post: { ...post, categoryName: category.name }, author, category };
}
export async function getPublishedPostsByCategory(slug: string) { try { return (await joined().where(and(eq(categories.slug, slug), eq(posts.status, 'published'))).orderBy(desc(posts.publishedAt))).map(toPost); } catch { return localPosts.filter((post) => post.category === slug).map((post) => ({ ...post, categoryName: localCategories.find((c) => c.slug === slug)?.name })); } }
export async function getRelatedPublishedPosts(slug: string, categoryId: string, tags: string[], limit = 2) { try { const rows = await joined().where(and(eq(posts.status, 'published'), ne(posts.slug, slug))); return rows.filter(({category}) => activeCategorySlugs.has(category.slug)).map((row) => ({ post: toPost(row), score: (row.post.categoryId === categoryId ? 2 : 0) + row.post.tags.filter((tag) => tags.includes(tag)).length })).sort((a,b) => b.score-a.score).slice(0,limit).map((x) => x.post); } catch { return localPosts.filter((post) => post.slug !== slug).slice(0, limit); } }
export async function getCategories(): Promise<(Category & { id: string })[]> { try { return (await db.select().from(categories).orderBy(categories.name)).filter((c) => activeCategorySlugs.has(c.slug)).map((c) => ({ id: c.id, slug: c.slug, name: c.name, description: c.description || '' })); } catch { return fallbackCategories; } }
export async function getCategoryBySlug(slug: string) { if (!activeCategorySlugs.has(slug)) return null; try { const [c] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1); if (c) return { id: c.id, slug: c.slug, name: c.name, description: c.description || '' }; } catch { /* local fallback below */ } return fallbackCategories.find((category) => category.slug === slug) || null; }
export async function getAuthors() { try { return (await db.select().from(authors).orderBy(authors.name)).map(toAuthor); } catch { return localAuthors; } }
