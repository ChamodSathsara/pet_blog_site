import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Newsletter } from '@/components/Newsletter';
import { authors } from '@/lib/data/authors';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({ title: 'About Housewise Journal', description: 'Learn how Housewise Journal researches, reviews, and updates practical home maintenance guidance.', path: '/about' });
const process = [
  ['Start with the failure', 'We focus on the maintenance questions that prevent water, weather, heat, and wear from damaging a home.'],
  ['Check reliable sources', 'Guides are built from manufacturer instructions, adopted codes, trade standards, and experienced professionals—not copied advice.'],
  ['Test the sequence', 'Every article makes the order of work, required tools, safety limits, and stop points clear before the first step.'],
  ['Review and update', 'We revisit advice when standards, products, costs, or safety guidance change and note meaningful corrections.'],
];

export default function AboutPage() {
  const author = authors[0];
  return <><PageHero eyebrow="About us" title="Good maintenance advice should prevent the emergency" description="Housewise Journal helps homeowners understand what to inspect, what to fix, what it may cost, and when the right tool is a qualified professional." />
    <div className="container py-12"><div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="max-w-prose">
      <h2 className="font-serif text-3xl font-semibold">Why this site exists</h2><p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">Most home damage begins quietly: a failed bead of sealant, a blocked downspout, a filter left too long, or a damp patch nobody measures. Online advice often skips the diagnosis, the safety boundary, or the true cost. Housewise Journal was built to fill that gap.</p><p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">We write for owners of ordinary homes who want to protect their biggest asset without pretending every job is an easy weekend DIY.</p>
      <h2 className="mt-12 font-serif text-3xl font-semibold">How our guides are made</h2><ol className="mt-6 space-y-5">{process.map(([step,body],i)=><li key={step} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">{i+1}</span><div><h3 className="font-serif text-lg font-semibold">{step}</h3><p className="mt-1.5 text-[18px] leading-relaxed text-foreground/85">{body}</p></div></li>)}</ol>
      <h2 className="mt-12 font-serif text-3xl font-semibold">How the site is funded</h2><p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">Housewise Journal is free to read and supported by clearly separated display advertising and, where disclosed, affiliate links. Commercial relationships do not determine our conclusions or safety recommendations.</p>
    </div><aside className="space-y-8"><section className="rounded-2xl border border-border bg-card p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Editorial reviewer</p><h2 className="mt-4 font-serif text-xl font-semibold">{author.name}</h2><p className="text-sm text-primary">{author.credentials}</p><p className="mt-3 text-base leading-relaxed text-muted-foreground">{author.bio}</p></section><Newsletter variant="inline" /></aside></div></div></>;
}
