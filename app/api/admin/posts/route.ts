import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { postSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const data = await db.select({ post: posts, categoryName: categories.name }).from(posts).innerJoin(categories, eq(posts.categoryId, categories.id)).orderBy(desc(posts.updatedAt));
  return Response.json(data);
}
export async function POST(request: Request) {
  try {
    const data = postSchema.parse(await jsonBody(request));
    const [post] = await db.insert(posts).values({ ...data, publishedAt: data.status === 'published' ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null }).returning();
    revalidatePath('/'); revalidatePath('/blog'); revalidatePath('/sitemap.xml');
    return Response.json(post, { status: 201 });
  } catch (error) { return apiError(error); }
}
