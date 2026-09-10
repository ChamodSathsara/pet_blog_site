import { ZodError } from 'zod';

export function apiError(error: unknown) {
  if (error instanceof ZodError) return Response.json({ error: 'Invalid request', issues: error.flatten() }, { status: 400 });
  if (error && typeof error === 'object' && 'code' in error && error.code === '23505') return Response.json({ error: 'A record with that value already exists' }, { status: 409 });
  console.error(error);
  return Response.json({ error: 'Internal server error' }, { status: 500 });
}

export async function jsonBody(request: Request) {
  try { return await request.json(); } catch { throw new ZodError([]); }
}
