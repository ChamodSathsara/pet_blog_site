import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
export async function GET(request: Request) {
  const status = new URL(request.url).searchParams.get('status');
  const base = db.select().from(messages);
  const data = status === 'unread' || status === 'read' || status === 'replied'
    ? await base.where(eq(messages.status, status)).orderBy(desc(messages.createdAt))
    : await base.orderBy(desc(messages.createdAt));
  return Response.json(data);
}
