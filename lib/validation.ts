import { z } from 'zod';

export const slugSchema = z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens');
export const messageSchema = z.object({
  name: z.string().trim().min(1).max(120), email: z.string().trim().email().max(320),
  topic: z.string().trim().min(1).max(160), message: z.string().trim().min(20).max(10000),
});
export const subscribeSchema = z.object({ email: z.string().trim().email().max(320).transform((v) => v.toLowerCase()) });
export const categorySchema = z.object({ name: z.string().trim().min(1).max(120), slug: slugSchema, description: z.string().trim().max(1000).optional().default('') });
export const postSchema = z.object({
  title: z.string().trim().min(1).max(250), slug: slugSchema, excerpt: z.string().trim().min(1).max(1000),
  seoTitle: z.string().trim().max(250).optional().default(''), metaDescription: z.string().trim().max(320).optional().default(''),
  canonicalUrl: z.union([z.literal(''), z.string().trim().url().max(2000)]).optional().default(''), noIndex: z.boolean().optional().default(false),
  content: z.string().trim().min(1), coverImageUrl: z.string().trim().max(2000).optional().default(''),
  coverAlt: z.string().trim().max(500).optional().default(''), categoryId: z.string().uuid(), authorId: z.string().uuid(),
  tags: z.array(z.string().trim().min(1).max(80)).max(30).default([]), status: z.enum(['draft', 'published']),
  publishedAt: z.string().datetime().nullable().optional(),
});
export const messageStatusSchema = z.object({ status: z.enum(['unread', 'read', 'replied']) });

export function validationError(error: z.ZodError) {
  return Response.json({ error: 'Invalid request', issues: error.flatten() }, { status: 400 });
}
