import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { adminUsers, authors as authorTable, categories as categoryTable, posts as postTable } from '../lib/db/schema';
import { categories } from '../lib/data/categories';
import { authors } from '../lib/data/authors';
import { posts } from '../lib/data/posts';

const client = postgres(process.env.DATABASE_URL!, { max: 1, ssl: 'require' });
const db = drizzle(client);

async function seed() {
  for (const category of categories) await db.insert(categoryTable).values(category).onConflictDoUpdate({ target: categoryTable.slug, set: { name: category.name, description: category.description, updatedAt: new Date() } });
  const categoryRows = await db.select().from(categoryTable);
  const categoryIds = new Map(categoryRows.map((item) => [item.slug, item.id]));
  const authorIds = new Map<string, string>();
  for (const author of authors) {
    const existing = (await db.select().from(authorTable).where(eq(authorTable.name, author.name)).limit(1))[0];
    const [row] = existing ? await db.update(authorTable).set({ credentials: author.credentials, bio: author.bio, avatarUrl: author.avatar, updatedAt: new Date() }).where(eq(authorTable.id, existing.id)).returning() : await db.insert(authorTable).values({ name: author.name, credentials: author.credentials, bio: author.bio, avatarUrl: author.avatar }).returning();
    authorIds.set(author.id, row.id);
  }
  for (const post of posts) {
    const values = { title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, coverImageUrl: post.coverImage, coverAlt: post.coverAlt, categoryId: categoryIds.get(post.category)!, authorId: authorIds.get(post.author)!, tags: post.tags, status: 'published' as const, publishedAt: new Date(`${post.date}T12:00:00Z`) };
    await db.insert(postTable).values(values).onConflictDoUpdate({ target: postTable.slug, set: values });
  }
  const email = process.env.ADMIN_EMAIL?.toLowerCase(); const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  const passwordHash = await hash(password, 12);
  await db.insert(adminUsers).values({ email, passwordHash }).onConflictDoUpdate({ target: adminUsers.email, set: { passwordHash } });
  console.log(`Seeded ${categories.length} categories, ${authors.length} authors, ${posts.length} posts, and one admin user.`);
  await client.end();
}
seed().catch((error) => { console.error(error); process.exit(1); });
