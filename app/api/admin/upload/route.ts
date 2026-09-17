import { put } from '@vercel/blob';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File) || !allowed.has(file.type) || file.size > 8 * 1024 * 1024) return Response.json({ error: 'Choose a JPG, PNG, WebP, or GIF under 8 MB' }, { status: 400 });
  const extension = ({ 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' } as const)[file.type];
  const baseName = path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'image';
  const safeName = `${crypto.randomUUID()}-${baseName}${extension}`;
  if (process.env.NODE_ENV === 'production' || process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKENS_READ_WRITE_TOKEN) {
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKENS_READ_WRITE_TOKEN || undefined;
      const oidcToken = process.env.VERCEL_OIDC_TOKEN || undefined;
      const storeId = process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN_STORE_ID || process.env.BLOB_READ_WRITE_TOKENS_STORE_ID || undefined;
      const blob = await put(`post-covers/${safeName}`, file, {
        access: 'public',
        ...(token ? { token } : {}),
        ...(!token && oidcToken ? { oidcToken } : {}),
        ...(!token && storeId ? { storeId } : {}),
      });
      return Response.json({ url: blob.url }, { status: 201 });
    } catch (error) {
      console.error('Blob upload failed', error);
      return Response.json({ error: 'Image storage is not connected to this deployment' }, { status: 503 });
    }
  }
  const directory = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, safeName), Buffer.from(await file.arrayBuffer()));
  return Response.json({ url: `/uploads/${safeName}` }, { status: 201 });
}
