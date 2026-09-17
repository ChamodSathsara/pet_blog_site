'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BookOpen, ChevronDown, Menu, Wrench, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Category } from '@/lib/types/post';

const primaryNav = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Guides' },
  { href: '/about', label: 'About' },
];

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ categories }: { categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const pathname = usePathname();
  const topicsRef = useRef<HTMLDivElement>(null);
  const topicsActive = pathname.startsWith('/category/');

  useEffect(() => {
    setMobileOpen(false);
    setTopicsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (topicsRef.current && !topicsRef.current.contains(event.target as Node)) setTopicsOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setTopicsOpen(false); setMobileOpen(false); }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape); };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_16px_rgba(15,33,51,.05)] backdrop-blur-xl">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white">Skip to content</a>

      <div className="container flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="Housewise Journal home" className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
          <Image src="/housewise-mark.png" alt="" width={495} height={422} priority className="h-12 w-auto shrink-0 transition-transform group-hover:-rotate-2" />
          <span className="min-w-0">
            <span className="block truncate font-serif text-[20px] font-semibold leading-none tracking-tight text-[#172033] sm:text-[22px]">Housewise Journal</span>
            <span className="mt-1 hidden text-[11px] font-semibold uppercase tracking-[.13em] text-slate-500 sm:block">Maintain smarter</span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActivePath(pathname, item.href) ? 'page' : undefined} className={cn('rounded-lg px-4 py-2.5 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30', isActivePath(pathname, item.href) ? 'bg-slate-100 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary')}>
              {item.label}
            </Link>
          ))}

          <div ref={topicsRef} className="relative">
            <button type="button" onClick={() => setTopicsOpen((value) => !value)} aria-expanded={topicsOpen} aria-controls="topics-menu" className={cn('inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30', topicsActive || topicsOpen ? 'bg-slate-100 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary')}>
              Topics <ChevronDown className={cn('h-4 w-4 transition-transform', topicsOpen && 'rotate-180')} aria-hidden="true" />
            </button>
            {topicsOpen && <div id="topics-menu" className="absolute right-0 top-[calc(100%+12px)] max-h-[66vh] w-[620px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_20px_55px_rgba(15,33,51,.18)]">
              <div className="px-3 pb-2 pt-2"><p className="text-xs font-bold uppercase tracking-[.15em] text-slate-400">Browse by topic</p></div>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} className={cn('group rounded-xl px-3 py-3 transition-colors hover:bg-slate-50', isActivePath(pathname, `/category/${category.slug}`) && 'bg-slate-100')}><span className="block text-[15px] font-semibold text-slate-800 group-hover:text-primary">{category.name}</span><span className="mt-0.5 line-clamp-1 block text-[13px] text-slate-500">{category.description}</span></Link>)}
              </div>
            </div>}
          </div>

          <Link href="/contact" className="ml-2 inline-flex items-center rounded-xl bg-[#173d63] px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1d4b78] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">Ask a question</Link>
        </nav>

        <button type="button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-controls="mobile-nav" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 lg:hidden">
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          <span className="sr-only">{mobileOpen ? 'Close navigation' : 'Open navigation'}</span>
        </button>
      </div>

      {mobileOpen && <div className="absolute inset-x-0 top-full z-50 max-h-[calc(100vh-72px)] overflow-y-auto border-t border-slate-200 bg-white shadow-2xl lg:hidden">
        <nav id="mobile-nav" aria-label="Mobile navigation" className="container pb-10 pt-5">
          <div className="grid gap-1">
            {primaryNav.map((item) => <Link key={item.href} href={item.href} aria-current={isActivePath(pathname, item.href) ? 'page' : undefined} className={cn('flex min-h-12 items-center rounded-xl px-4 text-[17px] font-semibold', isActivePath(pathname, item.href) ? 'bg-slate-100 text-primary' : 'text-slate-800')}>{item.label}</Link>)}
          </div>
          <div className="my-5 border-t border-slate-200" />
          <p className="px-4 text-xs font-bold uppercase tracking-[.16em] text-slate-400">Home topics</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {categories.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} className={cn('rounded-xl border border-slate-200 p-4', isActivePath(pathname, `/category/${category.slug}`) && 'border-primary bg-slate-50')}><span className="flex items-center gap-2 text-[16px] font-semibold text-slate-800"><Wrench className="h-4 w-4 text-[#f97316]" aria-hidden="true" />{category.name}</span><span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-slate-500">{category.description}</span></Link>)}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3"><Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 text-[15px] font-semibold text-white">Contact us</Link><Link href="/blog" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-[15px] font-semibold text-slate-800"><BookOpen className="h-4 w-4" aria-hidden="true" />All guides</Link></div>
        </nav>
      </div>}
    </header>
  );
}
