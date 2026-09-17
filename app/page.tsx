import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Droplets,
  Hammer,
  House,
  ShieldCheck,
  Snowflake,
  Wrench,
} from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Newsletter } from "@/components/Newsletter";
import { AdSlot } from "@/components/AdSlot";
import { formatDate, getPostReadTime } from "@/lib/utils/posts";
import { getCategories, getHomepageFeaturedPost, getPublishedPosts } from "@/lib/db/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Home Maintenance Guides, Checklists & Repair Advice",
  description:
    "Expert-reviewed home maintenance guides with seasonal checklists, realistic repair costs, safe DIY instructions, and clear advice on when to call a professional.",
  path: "/",
});

export const revalidate = 60;

const topicIcons = {
  "seasonal-maintenance": CalendarCheck,
  plumbing: Droplets,
  "heating-cooling": Snowflake,
  "exterior-roof": House,
  "tools-materials": Hammer,
};

const fallTasks = [
  "Clear gutters and confirm downspout drainage",
  "Test heating before the first cold night",
  "Disconnect hoses and protect exposed pipes",
  "Check alarms, weatherstripping, and exterior lights",
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Safety-first guidance",
    body: "Clear stop points for licensed, permitted, or high-risk work.",
  },
  {
    icon: BadgeDollarSign,
    title: "Honest cost context",
    body: "Know the likely DIY spend and professional price range first.",
  },
  {
    icon: CalendarCheck,
    title: "Built around the season",
    body: "Do the highest-value jobs before weather exposes a weakness.",
  },
];

export default async function Home() {
  const [allPosts, categories, selectedMainArticle] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
    getHomepageFeaturedPost(),
  ]);
  const featured = selectedMainArticle ?? allPosts[0];
  const mainArticleHref = featured ? `/blog/${featured.slug}` : "/blog";
  const latest = featured
    ? allPosts.filter((post) => post.slug !== featured.slug)
    : allPosts;

  return (
    <>
      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#0d1b2a] text-white lg:min-h-[720px]">
        <Image
          src="/home-maintenance-hero.png"
          alt="A homeowner safely clearing leaves from a gutter"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[67%_center] opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,31,.96)_0%,rgba(7,18,31,.83)_42%,rgba(7,18,31,.18)_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d1b2a] to-transparent" />
        <div className="container relative flex min-h-[680px] items-center py-20 lg:min-h-[720px]">
          <div className="max-w-[720px]">
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#f97316]" /> Fall
              maintenance season
            </div> */}
            <h1 className="mt-7 max-w-[690px] font-serif text-[46px] font-semibold leading-[.98] tracking-[-.025em] text-white sm:text-[62px] lg:text-[78px]">
              Look after your home{" "}
              <span className="text-[#ff8a3d]">before</span> it asks for help.
            </h1>
            <p className="mt-7 max-w-[610px] text-[19px] leading-relaxed text-white/78 md:text-[21px]">
              Practical maintenance plans, safe repair guidance, and honest cost
              context for homeowners who want fewer surprises.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={mainArticleHref}
                className="inline-flex h-13 items-center rounded-xl bg-[#f97316] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-[#ff8430]"
              >
                Open the fall checklist <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex h-13 items-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
              >
                Explore all guides
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-6 text-sm text-white/65">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#ff8a3d]" /> Expert
                reviewed
              </span>
              <span className="inline-flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#ff8a3d]" /> DIY limits clearly
                marked
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4 text-[#ff8a3d]" />{" "}
                No-cost-first advice
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-16 pb-8">
        <div className="container grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-[#14283d] p-6 text-white shadow-2xl shadow-slate-950/20 md:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ff8a3d]">
                  Your priority list
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold">
                  Four jobs worth doing this month
                </h2>
              </div>
              <Link
                href={mainArticleHref}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
              >
                Full checklist <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {fallTasks.map((task, index) => (
                <div
                  key={task}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[.06] p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-sm font-bold">
                    {index + 1}
                  </span>
                  <p className="text-[15px] leading-snug text-white/82">
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[1.75rem] bg-[#f97316] p-7 text-white shadow-2xl shadow-orange-950/20 md:p-8">
            <div>
              <Clock3 className="h-7 w-7" />
              <p className="mt-8 text-sm font-bold uppercase tracking-[.16em] text-white/70">
                The 30-minute habit
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight">
                Inspect one system every weekend.
              </h2>
            </div>
            <p className="mt-6 text-[16px] leading-relaxed text-white/85">
              Small, documented checks catch the moisture, airflow, and drainage
              problems that become major repairs.
            </p>
          </div>
        </div>
      </section>

      <div className="container pt-6">
        <AdSlot position="header" />
      </div>

      <section className="container py-16 md:py-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-terracotta">
              Find your project
            </p>
            <h2 className="mt-2 max-w-xl font-serif text-3xl font-semibold leading-tight md:text-5xl">
              Every part of the house, clearly explained.
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-muted-foreground">
            Start with the system you need to inspect, maintain, or repair. Each
            topic includes safe DIY boundaries and professional call-out points.
          </p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => {
            const Icon =
              topicIcons[category.slug as keyof typeof topicIcons] || Wrench;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`group relative min-h-[230px] overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${index === 0 ? "border-primary bg-primary text-white lg:col-span-2" : "border-border bg-card text-foreground"}`}
              >
                <Icon
                  className={`h-7 w-7 ${index === 0 ? "text-[#ff8a3d]" : "text-terracotta"}`}
                />
                <h3 className="mt-10 font-serif text-2xl font-semibold leading-tight">
                  {category.name}
                </h3>
                <p
                  className={`mt-3 line-clamp-3 text-[15px] leading-relaxed ${index === 0 ? "text-white/70" : "text-muted-foreground"}`}
                >
                  {category.description}
                </p>
                <ArrowRight className="absolute bottom-5 right-5 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </section>

      {featured && (
        <section className="border-y border-border bg-white py-16 md:py-20">
          <div className="container">
            <div className="mb-7 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-terracotta">
                  Editor’s essential
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
                  Start with the highest-value work
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-2 font-semibold text-primary hover:underline sm:inline-flex"
              >
                All articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <article className="group grid overflow-hidden rounded-[1.75rem] border border-border bg-[#f4f6f8] lg:grid-cols-[1.15fr_.85fr]">
              <Link
                href={`/blog/${featured.slug}`}
                className="relative min-h-[340px] overflow-hidden lg:min-h-[520px]"
              >
                <Image
                  src={featured.coverImage}
                  alt={featured.coverAlt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
                <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-[.13em] text-primary shadow-sm">
                  Most useful now
                </span>
              </Link>
              <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                <Link
                  href={`/category/${featured.category}`}
                  className="text-xs font-bold uppercase tracking-[.16em] text-terracotta"
                >
                  {featured.categoryName || featured.category}
                </Link>
                <h3 className="mt-4 font-serif text-3xl font-semibold leading-[1.08] md:text-[44px]">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="hover:text-primary"
                  >
                    {featured.title}
                  </Link>
                </h3>
                <p className="mt-5 text-[18px] leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                  <time dateTime={featured.date}>
                    {formatDate(featured.date)}
                  </time>
                  <span>•</span>
                  <span>{getPostReadTime(featured)} min read</span>
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Read the complete guide <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="container py-16 md:py-20">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-terracotta">
                Fresh from the journal
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
                Latest practical guides
              </h2>
            </div>
            <Link
              href="/blog"
              className="font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {latest.map((post) => (
              <PostCard key={post.slug} post={post} headingLevel="h3" />
            ))}
          </div>
        </section>
      )}

      <section className="bg-[#0f2133] py-16 text-white md:py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ff8a3d]">
                Why Housewise
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
                Advice for real homes, not perfect renovations.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-white/70">
              We focus on prevention, practical diagnosis, and the moment a
              careful homeowner should put the tool down and call someone
              qualified.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {trustPoints.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[.05] p-6"
              >
                <Icon className="h-6 w-6 text-[#ff8a3d]" />
                <h3 className="mt-5 font-serif text-xl font-semibold">
                  {title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-white/65">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-6 rounded-[2rem] border border-border bg-white p-6 shadow-xl shadow-slate-900/5 md:p-10 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
          <div>
            <CheckCircle2 className="h-8 w-8 text-terracotta" />
            <h2 className="mt-5 font-serif text-3xl font-semibold">
              Stay ahead of the next season.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              One useful checklist each month. No clutter.
            </p>
          </div>
          <Newsletter className="!m-0 !rounded-2xl" />
        </div>
      </section>
    </>
  );
}
