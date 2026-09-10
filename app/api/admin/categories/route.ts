import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { categorySchema } from '@/lib/validation';
export async function POST(request: Request) {
  try { const [item] = await db.insert(categories).values(categorySchema.parse(await jsonBody(request))).returning(); return Response.json(item, { status: 201 }); }
  catch (error) { return apiError(error); }
}
