import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { auth } from '@/auth';
import { AdminShell } from './AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return session ? <AdminShell>{children}</AdminShell> : children;
}
