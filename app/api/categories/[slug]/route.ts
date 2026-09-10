import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';
export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const [category] = await db.select().from(categories).where(eq(categories.slug, params.slug)).limit(1);
  if (!category) return Response.json({ error: 'Category not found' }, { status: 404 });
  const items = await db.select().from(posts).where(and(eq(posts.categoryId, category.id), eq(posts.status, 'published'))).orderBy(desc(posts.publishedAt));
  return Response.json({ ...category, posts: items });
}
