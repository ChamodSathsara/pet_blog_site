import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
export const dynamic = 'force-dynamic';
export async function GET() { return Response.json(await db.select().from(categories).orderBy(asc(categories.name)), { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', 'X-Robots-Tag': 'noindex' } }); }
