import { db } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { apiError, jsonBody } from '@/lib/api';
import { subscribeSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const data = subscribeSchema.parse(await jsonBody(request));
    await db.insert(subscribers).values(data).onConflictDoNothing({ target: subscribers.email });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) { return apiError(error); }
}
