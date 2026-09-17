import { db } from '../lib/db';
import { posts } from '../lib/db/schema';

const localImage = /(?:^|\()\/uploads\//;
const blobImage = /https:\/\/[^\s)]+\.public\.blob\.vercel-storage\.com\/[^\s)]+/g;

async function main() {
  const rows = await db.select({ slug: posts.slug, coverImageUrl: posts.coverImageUrl, content: posts.content }).from(posts);
  const localReferences = rows.filter((post) => localImage.test(post.coverImageUrl || '') || localImage.test(post.content));
  const blobUrls = new Set<string>();

  for (const post of rows) {
    if (post.coverImageUrl?.includes('.public.blob.vercel-storage.com/')) blobUrls.add(post.coverImageUrl);
    for (const url of post.content.match(blobImage) || []) blobUrls.add(url);
  }

  const responses = await Promise.all([...blobUrls].map(async (url) => (await fetch(url, { method: 'HEAD' })).ok));
  console.log(JSON.stringify({ localReferences: localReferences.length, blobImages: blobUrls.size, accessibleBlobImages: responses.filter(Boolean).length }));
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
