'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ImagePlus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Markdown } from '@/components/Markdown';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
type Option = { id: string; name: string };
type Initial = { id?: string; title: string; slug: string; excerpt: string; seoTitle: string; metaDescription: string; canonicalUrl: string; noIndex: boolean; content: string; coverImageUrl: string; coverAlt: string; categoryId: string; authorId: string; tags: string[]; status: 'draft' | 'published' };

export function PostEditor({ initial, categories, authors }: { initial: Initial; categories: Option[]; authors: Option[] }) {
  const router = useRouter(); const [form, setForm] = useState(initial); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const [inlineFile, setInlineFile] = useState<File | null>(null); const [inlineAlt, setInlineAlt] = useState(''); const [inlineCaption, setInlineCaption] = useState(''); const [uploadingInline, setUploadingInline] = useState(false); const [inlineError, setInlineError] = useState(''); const [inlineNotice, setInlineNotice] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const inlineFileRef = useRef<HTMLInputElement>(null);
  const set = (key: keyof Initial, value: unknown) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (form.coverImageUrl && !form.coverAlt.trim()) { setError('Add descriptive alt text for the cover image before saving.'); return; } setSaving(true); setError(''); const response = await fetch(initial.id ? `/api/admin/posts/${initial.id}` : '/api/admin/posts', { method: initial.id ? 'PUT' : 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) }); setSaving(false); if (!response.ok) { const body = await response.json().catch(() => ({})); setError(body.error || 'Could not save post'); return; } router.push('/admin/posts'); router.refresh(); };
  const uploadInlineImage = async () => {
    const alt = inlineAlt.trim();
    if (!inlineFile) { setInlineError('Choose an image first.'); return; }
    if (!alt) { setInlineError('Alt text is required for accessibility and image SEO.'); return; }
    setUploadingInline(true); setInlineError(''); setInlineNotice('');
    const data = new FormData(); data.set('file', inlineFile);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: data });
    const body = await response.json().catch(() => ({}));
    setUploadingInline(false);
    if (!response.ok) { setInlineError(body.error || 'Could not upload image.'); return; }
    const safeAlt = alt.replace(/\]/g, '');
    const safeCaption = inlineCaption.trim().replace(/"/g, "'");
    const markdown = `![${safeAlt}](${body.url}${safeCaption ? ` "${safeCaption}"` : ''})`;
    const textarea = editorRef.current?.querySelector('textarea');
    const start = textarea?.selectionStart ?? form.content.length;
    const end = textarea?.selectionEnd ?? start;
    const before = form.content.slice(0, start);
    const after = form.content.slice(end);
    const prefix = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    const suffix = after && !after.startsWith('\n\n') ? (after.startsWith('\n') ? '\n' : '\n\n') : '';
    const nextContent = `${before}${prefix}${markdown}${suffix}${after}`;
    set('content', nextContent); setInlineFile(null); setInlineAlt(''); setInlineCaption(''); setInlineNotice('Image uploaded and inserted. Check it in the preview pane.');
    if (inlineFileRef.current) inlineFileRef.current.value = '';
    requestAnimationFrame(() => {
      const nextTextarea = editorRef.current?.querySelector('textarea');
      const cursor = before.length + prefix.length + markdown.length;
      nextTextarea?.focus(); nextTextarea?.setSelectionRange(cursor, cursor);
    });
  };
  return <form onSubmit={submit} className="mt-6 space-y-5">
    <div className="grid gap-5 md:grid-cols-2"><Field label="Title"><Input required value={form.title} onChange={(e) => { set('title', e.target.value); if (!initial.id) set('slug', e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')); }} /></Field><Field label="Slug"><Input required value={form.slug} onChange={(e) => set('slug', e.target.value)} /></Field></div>
    <Field label="Excerpt"><Textarea required value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></Field>
    <div className="grid gap-5 md:grid-cols-3"><Field label="Category"><select className="h-10 w-full rounded-lg border bg-background px-3" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Author"><select className="h-10 w-full rounded-lg border bg-background px-3" value={form.authorId} onChange={(e) => set('authorId', e.target.value)}>{authors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Status"><select className="h-10 w-full rounded-lg border bg-background px-3" value={form.status} onChange={(e) => set('status', e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></Field></div>
    <Field label="Tags (comma separated)"><Input value={form.tags.join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} /></Field>
    <div className="grid gap-5 md:grid-cols-2"><Field label="Cover image URL"><Input value={form.coverImageUrl} onChange={(e) => set('coverImageUrl', e.target.value)} /><input className="mt-2 text-sm" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const data = new FormData(); data.set('file', file); const response = await fetch('/api/admin/upload', { method: 'POST', body: data }); const body = await response.json(); if (response.ok) set('coverImageUrl', body.url); else setError(body.error); }} /></Field><Field label="Cover alt text"><Input required={Boolean(form.coverImageUrl)} placeholder="Describe what is visible in the image" value={form.coverAlt} onChange={(e) => set('coverAlt', e.target.value)} /><span className="mt-1 block text-xs text-muted-foreground">Required when a cover image is used. Describe the image naturally; do not stuff keywords.</span></Field></div>
    <section className="rounded-2xl border bg-secondary/30 p-5"><h2 className="font-serif text-xl font-semibold">Search appearance</h2><p className="mt-1 text-sm text-muted-foreground">Optional. Blank fields use the article title, excerpt, and normal public URL.</p><div className="mt-4 grid gap-5 md:grid-cols-2"><Field label="SEO title"><Input maxLength={250} value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} /></Field><Field label="Meta description"><Textarea maxLength={320} value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} /></Field></div><Field label="Canonical override"><Input type="url" placeholder="Leave blank for the normal article URL" value={form.canonicalUrl} onChange={(e) => set('canonicalUrl', e.target.value)} /></Field><label className="mt-4 flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4" checked={form.noIndex} onChange={(e) => set('noIndex', e.target.checked)} /><span><strong className="block">Hide this published article from search engines</strong><span className="text-muted-foreground">Use only for intentional exclusions. Drafts are never public.</span></span></label></section>
    <section className="rounded-2xl border bg-secondary/30 p-5">
      <div className="flex items-start gap-3"><ImagePlus className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="font-serif text-lg font-semibold">Add an image inside the article</h2><p className="mt-1 text-sm text-muted-foreground">Choose an image, write useful alt text, then insert it wherever your cursor is in the editor. The preview uses the same renderer as the published article.</p></div></div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Image file"><Input ref={inlineFileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { setInlineFile(event.target.files?.[0] || null); setInlineError(''); setInlineNotice(''); }} /></Field>
        <Field label="Alt text (required)"><Input value={inlineAlt} maxLength={250} placeholder="e.g. Plumber tightening a copper pipe joint" onChange={(event) => { setInlineAlt(event.target.value); setInlineError(''); }} /><span className="mt-1 block text-xs text-muted-foreground">Describe the image for readers who cannot see it. Keep it specific and concise.</span></Field>
      </div>
      <div className="mt-4 grid items-end gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <Field label="Caption (optional)"><Input value={inlineCaption} maxLength={300} placeholder="Extra context shown below the image" onChange={(event) => setInlineCaption(event.target.value)} /></Field>
        <Button type="button" variant="outline" className="h-10" disabled={uploadingInline} onClick={uploadInlineImage}><Upload className="h-4 w-4" aria-hidden="true" />{uploadingInline ? 'Uploading…' : 'Upload and insert'}</Button>
      </div>
      {inlineError && <p role="alert" className="mt-3 text-sm text-destructive">{inlineError}</p>}
      {inlineNotice && <p role="status" className="mt-3 text-sm font-medium text-primary">{inlineNotice}</p>}
    </section>
    <Field label="Content (Markdown)"><div ref={editorRef} data-color-mode="light"><MDEditor value={form.content} onChange={(value) => set('content', value || '')} height={520} components={{ preview: (source: string) => <div className="px-5 pb-8"><Markdown source={source} /></div> }} /></div></Field>
    {error && <p role="alert" className="text-destructive">{error}</p>}<div className="flex gap-3"><Button size="lg" disabled={saving}>{saving ? 'Saving…' : 'Save post'}</Button><Button type="button" size="lg" variant="outline" onClick={() => router.push('/admin/posts')}>Cancel</Button></div>
  </form>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}</label>; }
