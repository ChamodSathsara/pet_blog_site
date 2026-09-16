import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
export const dynamic = 'force-dynamic';
export async function GET() { return Response.json(await db.select().from(categories).orderBy(asc(categories.name))); }
