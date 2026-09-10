'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PawPrint, X } from 'lucide-react';
import { categories } from '@/lib/data/categories';
import { cn } from '@/lib/utils/cn';

const primaryNav = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'All Articles' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="container flex h-[70px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-primary-foreground">
            <PawPrint className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-serif text-[21px] font-semibold leading-none tracking-tight text-foreground">Grey Muzzle Guide</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-[16px] font-medium transition-colors hover:text-primary',
                isActivePath(pathname, item.href) ? 'text-primary' : 'text-foreground/75'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <div className="hidden border-t border-border bg-secondary/50 lg:block">
        <div className="container flex h-11 items-center gap-6 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={cn(
                'whitespace-nowrap text-[14px] font-medium uppercase tracking-[0.1em] transition-colors hover:text-primary',
                isActivePath(pathname, `/category/${category.slug}`) ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border bg-background lg:hidden">
          <div className="container flex flex-col py-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn('py-2.5 text-[17px] font-medium', isActivePath(pathname, item.href) ? 'text-primary' : 'text-foreground')}
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Categories</p>
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="py-2 text-[16px] text-foreground/80">
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
