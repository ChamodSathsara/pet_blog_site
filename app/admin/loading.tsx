import { LoaderCircle } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6" aria-label="Loading admin page">
      <div className="flex items-center gap-3">
        <LoaderCircle className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
        <p className="font-medium text-foreground">Loading…</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl border border-border bg-card" />)}
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
    </div>
  );
}
