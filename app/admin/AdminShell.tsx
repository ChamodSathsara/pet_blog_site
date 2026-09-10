'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-secondary/20 lg:grid lg:grid-cols-[240px_1fr]">
    <aside className="border-b border-border bg-card p-5 lg:min-h-screen lg:border-b-0 lg:border-r">
      <Link href="/admin" className="font-serif text-xl font-semibold text-primary">Grey Muzzle Admin</Link>
      <nav className="mt-6 flex flex-wrap gap-2 lg:flex-col">
        {['Dashboard','Posts','Categories','Messages'].map((name) => <Link key={name} href={name === 'Dashboard' ? '/admin' : `/admin/${name.toLowerCase()}`} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary">{name}</Link>)}
        <Button variant="ghost" className="justify-start" onClick={() => signOut({ callbackUrl: '/admin/login' })}>Logout</Button>
      </nav>
    </aside>
    <main className="p-5 md:p-8">{children}</main>
  </div>;
}
