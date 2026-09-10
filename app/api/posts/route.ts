import { and, arrayContains, count, desc, eq, SQL } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const page = Math.max(1, Number(query.get('page')) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.get('limit')) || 10));
  const conditions: SQL[] = [eq(posts.status, 'published')];
  if (query.get('tag')) conditions.push(arrayContains(posts.tags, [query.get('tag')!]));
  if (query.get('category')) {
    const [category] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, query.get('category')!)).limit(1);
    if (!category) return Response.json({ data: [], page, limit, total: 0 });
    conditions.push(eq(posts.categoryId, category.id));
  }
  const where = and(...conditions);
  const [items, [{ total }]] = await Promise.all([
    db.select().from(posts).where(where).orderBy(desc(posts.publishedAt)).limit(limit).offset((page - 1) * limit),
    db.select({ total: count() }).from(posts).where(where),
  ]);
  return Response.json({ data: items, page, limit, total });
}
