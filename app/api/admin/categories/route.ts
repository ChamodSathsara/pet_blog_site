import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { categorySchema } from '@/lib/validation';
import { revalidatePath, revalidateTag } from 'next/cache';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try { const [item] = await db.insert(categories).values(categorySchema.parse(await jsonBody(request))).returning();
    revalidateTag('categories'); revalidateTag('posts'); revalidateTag(`category-${item.slug}`);
    revalidatePath('/'); revalidatePath('/blog'); revalidatePath('/sitemap.xml'); revalidatePath(`/category/${item.slug}`);
    return Response.json(item, { status: 201 }); }
  catch (error) { return apiError(error); }
}
