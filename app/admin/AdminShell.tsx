'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  useEffect(() => setNavigating(false), [pathname]);
  const detectNavigation = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!anchor) return;
    const target = new URL(anchor.href, window.location.href);
    if (target.origin === window.location.origin && target.pathname.startsWith('/admin') && `${target.pathname}${target.search}` !== `${window.location.pathname}${window.location.search}`) setNavigating(true);
  };
  return <div onClickCapture={detectNavigation} className="min-h-screen bg-secondary/20 lg:grid lg:grid-cols-[240px_1fr]">
    {navigating && <div role="status" aria-live="polite" className="fixed inset-x-0 top-0 z-[100] flex h-1 items-center bg-primary/20"><span className="h-full w-full animate-pulse bg-primary" /><span className="sr-only">Loading admin page</span></div>}
    <aside className="border-b border-border bg-card p-5 lg:min-h-screen lg:border-b-0 lg:border-r">
      <Link href="/admin" className="font-serif text-xl font-semibold text-primary">Housewise Admin</Link>
      <nav className="mt-6 flex flex-wrap gap-2 lg:flex-col">
        {['Dashboard','Posts','Categories','Messages','Subscribers'].map((name) => <Link key={name} href={name === 'Dashboard' ? '/admin' : `/admin/${name.toLowerCase()}`} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary">{name}</Link>)}
        <Button variant="ghost" className="justify-start" disabled={navigating} onClick={async () => { setNavigating(true); await signOut({ callbackUrl: '/admin/login' }); }}>
          {navigating ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null} Logout
        </Button>
      </nav>
    </aside>
    <main className="p-5 md:p-8">{children}</main>
  </div>;
}
