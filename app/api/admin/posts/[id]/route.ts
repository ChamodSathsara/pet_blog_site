import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { postSchema, postStatusUpdateSchema } from '@/lib/validation';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

async function categorySlug(id: string) {
  const [category] = await db.select({ slug: categories.slug }).from(categories).where(eq(categories.id, id)).limit(1);
  return category?.slug;
}

function revalidatePost(slugs: string[], categorySlugs: (string | undefined)[]) {
  revalidateTag('posts'); revalidateTag('homepage-featured'); revalidatePath('/'); revalidatePath('/blog'); revalidatePath('/sitemap.xml');
  for (const slug of new Set(slugs)) { revalidateTag(`post-${slug}`); revalidatePath(`/blog/${slug}`); }
  for (const slug of new Set(categorySlugs.filter((item): item is string => Boolean(item)))) { revalidateTag(`category-${slug}`); revalidatePath(`/category/${slug}`); }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = postSchema.parse(await jsonBody(request));
    const [existing] = await db.select({ publishedAt: posts.publishedAt, slug: posts.slug, categoryId: posts.categoryId }).from(posts).where(eq(posts.id, params.id)).limit(1);
    if (!existing) return Response.json({ error: 'Post not found' }, { status: 404 });
    const publishedAt = data.status === 'published' ? (data.publishedAt ? new Date(data.publishedAt) : existing.publishedAt ?? new Date()) : null;
    const homepageFeatured = data.status === 'published' && data.homepageFeatured;
    if (homepageFeatured) await db.update(posts).set({ homepageFeatured: false }).where(eq(posts.homepageFeatured, true));
    const [post] = await db.update(posts).set({ ...data, homepageFeatured, publishedAt, updatedAt: new Date() }).where(eq(posts.id, params.id)).returning();
    revalidatePost([existing.slug, data.slug], [await categorySlug(existing.categoryId), await categorySlug(data.categoryId)]);
    return post ? Response.json(post) : Response.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = postStatusUpdateSchema.parse(await jsonBody(request));
    const [existing] = await db.select({ publishedAt: posts.publishedAt, slug: posts.slug, categoryId: posts.categoryId }).from(posts).where(eq(posts.id, params.id)).limit(1);
    if (!existing) return Response.json({ error: 'Post not found' }, { status: 404 });
    const [post] = await db.update(posts).set({ status, ...(status === 'draft' ? { homepageFeatured: false } : {}), publishedAt: status === 'published' ? existing.publishedAt ?? new Date() : null, updatedAt: new Date() }).where(eq(posts.id, params.id)).returning();
    revalidatePost([existing.slug], [await categorySlug(existing.categoryId)]);
    return Response.json(post);
  } catch (error) { return apiError(error); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const [post] = await db.delete(posts).where(eq(posts.id, params.id)).returning({ id: posts.id, slug: posts.slug, categoryId: posts.categoryId });
  if (post) revalidatePost([post.slug], [await categorySlug(post.categoryId)]);
  return post ? new Response(null, { status: 204 }) : Response.json({ error: 'Post not found' }, { status: 404 });
}
