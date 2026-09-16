import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { postSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = postSchema.parse(await jsonBody(request));
    const [existing] = await db.select({ publishedAt: posts.publishedAt, slug: posts.slug }).from(posts).where(eq(posts.id, params.id)).limit(1);
    if (!existing) return Response.json({ error: 'Post not found' }, { status: 404 });
    const publishedAt = data.status === 'published' ? (data.publishedAt ? new Date(data.publishedAt) : existing.publishedAt ?? new Date()) : null;
    const [post] = await db.update(posts).set({ ...data, publishedAt, updatedAt: new Date() }).where(eq(posts.id, params.id)).returning();
    revalidatePath('/'); revalidatePath('/blog'); revalidatePath('/sitemap.xml'); revalidatePath(`/blog/${existing.slug}`); revalidatePath(`/blog/${data.slug}`);
    return post ? Response.json(post) : Response.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) { return apiError(error); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const [post] = await db.delete(posts).where(eq(posts.id, params.id)).returning({ id: posts.id, slug: posts.slug });
  if (post) { revalidatePath('/'); revalidatePath('/blog'); revalidatePath('/sitemap.xml'); revalidatePath(`/blog/${post.slug}`); }
  return post ? new Response(null, { status: 204 }) : Response.json({ error: 'Post not found' }, { status: 404 });
}
