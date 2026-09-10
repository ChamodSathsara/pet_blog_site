import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';
import { PostsTable } from './PostsTable';
export const dynamic='force-dynamic';
export default async function PostsPage(){const rows=await db.select({post:posts,categoryName:categories.name}).from(posts).innerJoin(categories,eq(posts.categoryId,categories.id)).orderBy(desc(posts.updatedAt));return <><div className="flex items-center justify-between"><h1 className="font-serif text-3xl font-semibold">Posts</h1><Link href="/admin/posts/new" className="rounded-xl bg-primary px-4 py-2 text-primary-foreground">New post</Link></div><PostsTable rows={rows}/></>}
