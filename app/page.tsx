import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, HeartHandshake, Stethoscope } from 'lucide-react';
import { PostCard } from '@/components/PostCard';
import { Newsletter } from '@/components/Newsletter';
import { AdSlot } from '@/components/AdSlot';
import { categories } from '@/lib/data/categories';
import { formatDate, getAllPosts, getCategory, getFeaturedPost, getPostReadTime } from '@/lib/utils/posts';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Senior Pet Health Guides for Aging Dogs & Cats',
  description:
    'Veterinarian-reviewed guides on senior dog arthritis, diabetic cat diets, breed-specific health risks, and knowing when an older pet needs a vet. Written for pet owners in the US and Canada.',
  path: '/',
});

const trustPoints = [
  {
    icon: Stethoscope,
    title: 'Reviewed by a practicing vet',
    body: "Every health guide is written or reviewed by Dr. Maya Ellison, DVM, whose caseload is roughly half senior patients.",
  },
  {
    icon: HeartHandshake,
    title: 'Written for the exam room',
    body: 'We tell you what to track at home, what to ask your vet, and what a realistic cost range looks like in the US and Canada.',
  },
  {
    icon: Clock,
    title: 'Built for slow reading',
    body: 'Large type, plain language, no pop-ups. Guides you can read at the kitchen table with your dog at your feet.',
  },
];

export default function Home() {
  const featured = getFeaturedPost();
  const featuredCategory = getCategory(featured.category);
  const latest = getAllPosts().filter((post) => post.slug !== featured.slug);

  return (
    <>
      <section className="border-b border-border bg-sand">
        <div className="container grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              Senior pets · Chronic conditions · US &amp; Canada
            </p>
            <h1 className="mt-4 font-serif text-[38px] font-semibold leading-[1.05] text-foreground md:text-[56px]">
              The years after seven deserve better information.
            </h1>
            <p className="mt-5 max-w-xl text-[20px] leading-relaxed text-foreground/80">
              Grey Muzzle Guide is a plain-language health library for people caring for older dogs and cats — arthritis,
              kidney disease, feline diabetes, cognitive decline, and the breed-specific risks nobody warned you about.
              Written with a veterinarian, for the conversation you are about to have with yours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex h-12 items-center rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Browse all guides
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/category/senior-pet-care"
                className="inline-flex h-12 items-center rounded-xl border border-input bg-card px-6 text-base font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Start with senior care
              </Link>
            </div>
          </div>

          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl bg-muted">
            <Image
              src="/f6247036-a579-475d-9bef-68b7c8b1282b.jpg"
              alt="An older woman gently stroking the head of a senior golden retriever resting on a cream blanket by a sunlit window"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="container pt-10">
        <AdSlot position="header" />
      </div>

      <section aria-labelledby="featured-heading" className="container pt-14">
        <div className="flex items-end justify-between gap-6">
          <h2 id="featured-heading" className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            This week's guide
          </h2>
          <Link href="/blog" className="shrink-0 text-[16px] font-medium text-primary hover:underline">
            All articles
          </Link>
        </div>

        <article className="mt-6 overflow-hidden rounded-3xl border border-border bg-card lg:grid lg:grid-cols-[1.15fr_1fr]">
          <Link href={`/blog/${featured.slug}`} aria-hidden="true" tabIndex={-1} className="relative block aspect-[3/2] overflow-hidden bg-muted lg:aspect-auto lg:h-full">
            <Image
              src={featured.coverImage}
              alt={featured.coverAlt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </Link>
          <div className="flex flex-col justify-center p-7 md:p-10">
            {featuredCategory && (
              <Link href={`/category/${featuredCategory.slug}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:underline">
                {featuredCategory.name}
              </Link>
            )}
            <h3 className="mt-3 font-serif text-[27px] font-semibold leading-tight text-foreground md:text-[34px]">
              <Link href={`/blog/${featured.slug}`} className="hover:text-primary">
                {featured.title}
              </Link>
            </h3>
            <p className="mt-4 text-[18px] leading-relaxed text-muted-foreground">{featured.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{getPostReadTime(featured)} min read</span>
            </div>
            <Link href={`/blog/${featured.slug}`} className="mt-6 inline-flex items-center gap-2 text-[17px] font-semibold text-primary hover:underline">
              Read the guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </section>

      <section aria-labelledby="latest-heading" className="container pt-16">
        <h2 id="latest-heading" className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Latest articles
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} headingLevel="h3" />
          ))}
        </div>
      </section>

      <section aria-labelledby="topics-heading" className="container pt-16">
        <h2 id="topics-heading" className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Browse by topic
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary">{category.name}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="trust-heading" className="container pt-16">
        <h2 id="trust-heading" className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Why you can trust this site
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {trustPoints.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-secondary/50 p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage text-primary-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container pt-16">
        <Newsletter />
      </div>
    </>
  );
}
