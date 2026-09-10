import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { messageSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const data = messageSchema.parse(await jsonBody(request));
    const [message] = await db.insert(messages).values(data).returning({ id: messages.id });
    return Response.json(message, { status: 201 });
  } catch (error) { return apiError(error); }
}
