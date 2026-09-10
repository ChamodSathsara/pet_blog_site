import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { getAuthors, getCategories } from '@/lib/db/queries';
import { PostEditor } from '../../PostEditor';
export default async function EditPostPage({params}:{params:{id:string}}){const [[post],categories,authors]=await Promise.all([db.select().from(posts).where(eq(posts.id,params.id)).limit(1),getCategories(),getAuthors()]);if(!post)notFound();return <><h1 className="font-serif text-3xl font-semibold">Edit post</h1><PostEditor categories={categories} authors={authors} initial={{id:post.id,title:post.title,slug:post.slug,excerpt:post.excerpt,content:post.content,coverImageUrl:post.coverImageUrl||'',coverAlt:post.coverAlt||'',categoryId:post.categoryId,authorId:post.authorId,tags:post.tags,status:post.status}}/></>}
