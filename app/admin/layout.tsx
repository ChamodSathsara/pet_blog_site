import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { auth } from '@/auth';
import { AdminShell } from './AdminShell';
import type { Metadata } from 'next';

export const metadata: Metadata = { robots: { index: false, follow: false, noarchive: true } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return session ? <AdminShell>{children}</AdminShell> : children;
}
