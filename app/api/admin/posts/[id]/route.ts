import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { postSchema } from '@/lib/validation';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = postSchema.parse(await jsonBody(request));
    const [post] = await db.update(posts).set({ ...data, publishedAt: data.status === 'published' ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null, updatedAt: new Date() }).where(eq(posts.id, params.id)).returning();
    return post ? Response.json(post) : Response.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) { return apiError(error); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const [post] = await db.delete(posts).where(eq(posts.id, params.id)).returning({ id: posts.id });
  return post ? new Response(null, { status: 204 }) : Response.json({ error: 'Post not found' }, { status: 404 });
}
