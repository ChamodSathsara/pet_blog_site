import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { posts } from '../lib/db/schema';

const markdownImage = /!\[[^\]]*\]\((\/uploads\/[^\s)]+)(?:\s+["'][^"']*["'])?\)/g;

async function uploadLocalImage(localUrl: string, token: string) {
  const relativePath = decodeURIComponent(localUrl).replace(/^\/+/, '');
  const absolutePath = path.resolve(process.cwd(), 'public', relativePath.replace(/^uploads[\\/]/, 'uploads/'));
  const uploadsRoot = path.resolve(process.cwd(), 'public', 'uploads');

  if (!absolutePath.startsWith(`${uploadsRoot}${path.sep}`)) throw new Error(`Unsafe upload path: ${localUrl}`);

  const extension = path.extname(absolutePath).toLowerCase() || '.jpg';
  const file = await readFile(absolutePath);
  const contentType = extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : extension === '.gif' ? 'image/gif' : 'image/jpeg';
  const blob = await put(`post-images/migrated-${crypto.randomUUID()}${extension}`, file, {
    access: 'public',
    token,
    contentType,
  });
  return blob.url;
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is required');

  const rows = await db.select({ id: posts.id, slug: posts.slug, coverImageUrl: posts.coverImageUrl, content: posts.content }).from(posts);
  const uploaded = new Map<string, string>();
  const migrate = async (url: string) => {
    const existing = uploaded.get(url);
    if (existing) return existing;
    const blobUrl = await uploadLocalImage(url, token);
    uploaded.set(url, blobUrl);
    return blobUrl;
  };

  for (const post of rows) {
    let coverImageUrl = post.coverImageUrl;
    let content = post.content;

    if (coverImageUrl?.startsWith('/uploads/')) coverImageUrl = await migrate(coverImageUrl);
    const inlineUrls = [...content.matchAll(markdownImage)].map((match) => match[1]);
    for (const localUrl of new Set(inlineUrls)) content = content.split(localUrl).join(await migrate(localUrl));

    if (coverImageUrl !== post.coverImageUrl || content !== post.content) {
      await db.update(posts).set({ coverImageUrl, content, updatedAt: new Date() }).where(eq(posts.id, post.id));
      console.log(`Migrated images for ${post.slug}`);
    }
  }

  console.log(`Uploaded ${uploaded.size} local image(s) to Vercel Blob.`);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
