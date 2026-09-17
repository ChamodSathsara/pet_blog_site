'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
type Row = { post: { id: string; title: string; status: string; updatedAt: string | Date }; categoryName: string };
export function PostsTable({ rows }: { rows: Row[] }) {
  const router = useRouter(); const [deleting, setDeleting] = useState<string | null>(null);
  const remove = async (id: string) => { if (!confirm('Delete this post?')) return; setDeleting(id); await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' }); setDeleting(null); router.refresh(); };
  return <div className="mt-6 overflow-x-auto rounded-2xl border bg-card"><table className="w-full text-left text-sm"><thead className="bg-secondary"><tr>{['Title', 'Category', 'Status', 'Date', 'Actions'].map((item) => <th key={item} className="p-3">{item}</th>)}</tr></thead><tbody>{rows.map(({ post, categoryName }) => <tr key={post.id} className="border-t"><td className="p-3 font-medium">{post.title}</td><td className="p-3">{categoryName}</td><td className="p-3 capitalize">{post.status}</td><td className="p-3">{new Date(post.updatedAt).toLocaleDateString()}</td><td className="p-3"><div className="flex gap-2"><Link className="rounded-lg border px-3 py-2" href={`/admin/posts/${post.id}/edit`}>Edit</Link><Button variant="ghost" disabled={Boolean(deleting)} onClick={() => remove(post.id)}>{deleting === post.id && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{deleting === post.id ? 'Deleting…' : 'Delete'}</Button></div></td></tr>)}</tbody></table></div>;
}
