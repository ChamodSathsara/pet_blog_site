import { count, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, messages, posts, subscribers } from '@/lib/db/schema';
export const dynamic = 'force-dynamic';
export default async function Dashboard() {
  const [[{ totalPosts }],[{ published }],[{ drafts }],[{ categoryCount }],[{ unread }],[{ subscriberCount }],recent] = await Promise.all([
    db.select({totalPosts:count()}).from(posts), db.select({published:count()}).from(posts).where(eq(posts.status,'published')), db.select({drafts:count()}).from(posts).where(eq(posts.status,'draft')),
    db.select({categoryCount:count()}).from(categories), db.select({unread:count()}).from(messages).where(eq(messages.status,'unread')), db.select({subscriberCount:count()}).from(subscribers), db.select().from(messages).orderBy(desc(messages.createdAt)).limit(5),
  ]);
  const cards=[['Total posts',totalPosts],['Published',published],['Drafts',drafts],['Categories',categoryCount],['Unread messages',unread],['Subscribers',subscriberCount]];
  return <><h1 className="font-serif text-3xl font-semibold">Dashboard</h1><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label,value])=><div key={String(label)} className="rounded-2xl border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</div><section className="mt-8 rounded-2xl border bg-card p-6"><h2 className="font-serif text-xl font-semibold">Recent messages</h2><div className="mt-4 divide-y">{recent.length?recent.map(m=><div key={m.id} className="py-3"><p className="font-medium">{m.name} · {m.topic}</p><p className="truncate text-sm text-muted-foreground">{m.message}</p></div>):<p className="text-muted-foreground">No messages yet.</p>}</div></section></>;
}
