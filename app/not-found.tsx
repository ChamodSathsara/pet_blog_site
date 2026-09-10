import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage text-primary-foreground">
        <PawPrint className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-serif text-[34px] font-semibold leading-tight text-foreground md:text-[44px]">
        This page wandered off
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[18px] leading-relaxed text-muted-foreground">
        The page you're looking for doesn't exist — it may have been moved or the link may be out of date.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to home
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-11 items-center rounded-xl border border-input bg-card px-6 text-base font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Browse articles
        </Link>
      </div>
    </div>
  );
}
