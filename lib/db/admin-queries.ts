import { asc } from 'drizzle-orm';
import { db } from './index';
import { authors, categories } from './schema';

export async function getAdminCategories() {
  return (await db.select().from(categories).orderBy(asc(categories.name))).map((category) => ({ id: category.id, slug: category.slug, name: category.name, description: category.description || '' }));
}

export async function getAdminAuthors() {
  return (await db.select().from(authors).orderBy(asc(authors.name))).map((author) => ({ id: author.id, name: author.name, credentials: author.credentials || '', bio: author.bio || '', avatar: author.avatarUrl || '' }));
}
