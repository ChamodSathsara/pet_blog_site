import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
export async function GET() { return Response.json(await db.select().from(categories).orderBy(asc(categories.name))); }
