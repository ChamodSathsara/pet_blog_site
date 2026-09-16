import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { authors, categories, posts } from '@/lib/db/schema';
export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const [post] = await db.select({ post: posts, category: categories, author: authors }).from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id)).innerJoin(authors, eq(posts.authorId, authors.id))
    .where(and(eq(posts.slug, params.slug), eq(posts.status, 'published'))).limit(1);
  return post ? Response.json(post, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', 'X-Robots-Tag': 'noindex' } }) : Response.json({ error: 'Post not found' }, { status: 404, headers: { 'X-Robots-Tag': 'noindex' } });
}
