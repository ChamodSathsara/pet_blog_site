import { count, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { categorySchema } from '@/lib/validation';
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try { const [item] = await db.update(categories).set({ ...categorySchema.parse(await jsonBody(request)), updatedAt: new Date() }).where(eq(categories.id, params.id)).returning(); return item ? Response.json(item) : Response.json({ error: 'Category not found' }, { status: 404 }); }
  catch (error) { return apiError(error); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const [{ total }] = await db.select({ total: count() }).from(posts).where(eq(posts.categoryId, params.id));
  if (total > 0) return Response.json({ error: 'Category is referenced by posts' }, { status: 409 });
  const [item] = await db.delete(categories).where(eq(categories.id, params.id)).returning({ id: categories.id });
  return item ? new Response(null, { status: 204 }) : Response.json({ error: 'Category not found' }, { status: 404 });
}
