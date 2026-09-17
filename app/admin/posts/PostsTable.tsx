'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Status = 'draft' | 'published';
type Row = { post: { id: string; title: string; status: Status; updatedAt: string | Date }; categoryName: string };

export function PostsTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [statuses, setStatuses] = useState<Record<string, Status>>(() => Object.fromEntries(rows.map(({ post }) => [post.id, post.status])));

  const changeStatus = async (id: string, status: Status) => {
    const previous = statuses[id]; setStatuses((current) => ({ ...current, [id]: status })); setUpdating(id); setError('');
    const response = await fetch(`/api/admin/posts/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) });
    setUpdating(null);
    if (!response.ok) { setStatuses((current) => ({ ...current, [id]: previous })); const body = await response.json().catch(() => ({})); setError(body.error || 'Could not update post status.'); return; }
    router.refresh();
  };
  const remove = async (id: string) => { if (!confirm('Delete this post?')) return; setDeleting(id); setError(''); const response = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' }); setDeleting(null); if (!response.ok) { const body = await response.json().catch(() => ({})); setError(body.error || 'Could not delete post.'); return; } router.refresh(); };

  return <div className="mt-6 space-y-3">{error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}<div className="overflow-x-auto rounded-2xl border bg-card"><table className="w-full text-left text-sm"><thead className="bg-secondary"><tr>{['Title', 'Category', 'Status', 'Date', 'Actions'].map((item) => <th key={item} className="p-3">{item}</th>)}</tr></thead><tbody>{rows.map(({ post, categoryName }) => <tr key={post.id} className="border-t"><td className="p-3 font-medium">{post.title}</td><td className="p-3">{categoryName}</td><td className="p-3"><div className="flex min-w-36 items-center gap-2"><select aria-label={`Status for ${post.title}`} className="h-9 rounded-lg border bg-background px-3 capitalize" value={statuses[post.id]} disabled={updating === post.id || deleting === post.id} onChange={(event) => changeStatus(post.id, event.target.value as Status)}><option value="draft">Draft</option><option value="published">Published</option></select>{updating === post.id && <LoaderCircle className="h-4 w-4 animate-spin text-primary" aria-label="Updating status" />}</div></td><td className="p-3">{new Date(post.updatedAt).toLocaleDateString()}</td><td className="p-3"><div className="flex gap-2"><Link className="rounded-lg border px-3 py-2" href={`/admin/posts/${post.id}/edit`}>Edit</Link><Button variant="ghost" disabled={Boolean(deleting) || Boolean(updating)} onClick={() => remove(post.id)}>{deleting === post.id && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{deleting === post.id ? 'Deleting…' : 'Delete'}</Button></div></td></tr>)}</tbody></table></div></div>;
}
