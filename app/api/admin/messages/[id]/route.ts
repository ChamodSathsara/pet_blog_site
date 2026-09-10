import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { messageStatusSchema } from '@/lib/validation';
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try { const [item] = await db.update(messages).set(messageStatusSchema.parse(await jsonBody(request))).where(eq(messages.id, params.id)).returning(); return item ? Response.json(item) : Response.json({ error: 'Message not found' }, { status: 404 }); }
  catch (error) { return apiError(error); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const [item] = await db.delete(messages).where(eq(messages.id, params.id)).returning({ id: messages.id });
  return item ? new Response(null, { status: 204 }) : Response.json({ error: 'Message not found' }, { status: 404 });
}
