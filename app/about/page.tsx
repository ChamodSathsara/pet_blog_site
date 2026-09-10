import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { Newsletter } from '@/components/Newsletter';
import { authors } from '@/lib/data/authors';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About Grey Muzzle Guide',
  description:
    'Why Grey Muzzle Guide exists, who writes it, how our articles are researched and veterinarian-reviewed, and how the site is funded.',
  path: '/about',
});

const process = [
  {
    step: 'Topic selection',
    body: "We pick topics from the questions owners actually ask in the exam room and in senior-pet support groups — not from keyword tools. If a subject cannot be covered responsibly without a veterinarian's input, we do not publish it.",
  },
  {
    step: 'Research',
    body: 'Drafts are built from peer-reviewed veterinary literature, consensus guidelines from bodies such as the AAHA and the International Society of Feline Medicine, and manufacturer prescribing information — not from other blogs.',
  },
  {
    step: 'Veterinary review',
    body: 'Every health article is written or reviewed line by line by a licensed veterinarian in general practice before it goes live, with particular attention to drug doses, red-flag symptoms, and anything that could delay urgent care.',
  },
  {
    step: 'Updates and corrections',
    body: 'Health guides are re-reviewed at least every 18 months, and sooner when a drug approval, recall, or guideline changes. Substantive corrections are noted at the foot of the article rather than quietly edited.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Built after a bad night at the emergency vet"
        description="Grey Muzzle Guide exists because the internet is full of pet health content written for search engines, and almost none of it is written for the moment you actually need it."
      />

      <div className="container py-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="max-w-prose">
            <h2 className="font-serif text-[26px] font-semibold leading-tight text-foreground md:text-[32px]">Why this site exists</h2>
            <p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">
              In early 2024, Rowan — a thirteen-year-old border collie mix belonging to our founder, Erin Vasquez — stopped getting up
              to greet people at the door. It took four months, two clinics, and a great deal of frantic 1 a.m. searching before
              anyone used the word osteoarthritis. What Erin found online in those months was overwhelmingly one of two things: thin,
              ad-choked listicles that said nothing, or dense veterinary journal abstracts that were impossible to act on.
            </p>
            <p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">
              What was missing was the middle. Something written in plain English, honest about uncertainty, specific about what to
              track at home, and clear about which symptoms mean call your vet on Monday versus get in the car now. That gap is the
              entire reason Grey Muzzle Guide exists.
            </p>

            <h2 className="mt-12 font-serif text-[26px] font-semibold leading-tight text-foreground md:text-[32px]">Who we write for</h2>
            <p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">
              Our readers are pet owners in the United States and Canada whose dog or cat has crossed into the last third of life,
              often with one or more chronic diagnoses attached. Many are managing arthritis, chronic kidney disease, feline
              diabetes, heart disease, or cognitive decline. Many are also budgeting carefully, because senior care is expensive and
              pet insurance rarely covers a condition once it has a name.
            </p>
            <p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">
              We design for that reader deliberately: large body type, generous line spacing, no autoplay video, no interstitial
              pop-ups, and no newsletter wall between you and the information. A number of our readers are themselves in their
              seventies and eighties, caring for an animal who has been with them for a decade and a half.
            </p>

            <h2 className="mt-12 font-serif text-[26px] font-semibold leading-tight text-foreground md:text-[32px]">
              How our articles are made
            </h2>
            <ol className="mt-6 space-y-5">
              {process.map((item, index) => (
                <li key={item.step} className="flex gap-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-[15px] font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{item.step}</h3>
                    <p className="mt-1.5 text-[18px] leading-relaxed text-foreground/85">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 font-serif text-[26px] font-semibold leading-tight text-foreground md:text-[32px]">
              What we will never do
            </h2>
            <ul className="mt-5 space-y-3 pl-6 text-[19px] leading-[1.7] text-foreground/85">
              <li className="list-disc pl-1 marker:text-primary">Tell you to skip or delay a veterinary visit</li>
              <li className="list-disc pl-1 marker:text-primary">Recommend a product because a brand paid us to</li>
              <li className="list-disc pl-1 marker:text-primary">Publish a dose, protocol, or home remedy a veterinarian has not reviewed</li>
              <li className="list-disc pl-1 marker:text-primary">Sell, rent, or trade your email address</li>
              <li className="list-disc pl-1 marker:text-primary">Use fear to sell supplements</li>
            </ul>

            <h2 className="mt-12 font-serif text-[26px] font-semibold leading-tight text-foreground md:text-[32px]">
              How this site is funded
            </h2>
            <p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">
              Grey Muzzle Guide is free to read and funded by display advertising, plus occasional affiliate links on product
              guides, which are disclosed on the article where they appear. Advertising never influences editorial content, and no
              advertiser sees an article before publication. Our full advertising and cookie disclosures are in the{' '}
              <Link href="/privacy-policy" className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
                privacy policy
              </Link>
              .
            </p>
            <p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">
              Rowan died in the autumn of 2025, at fifteen, comfortable and at home. The last two years of his life were better than
              they would have been, and that was entirely down to information his family eventually found. Everything published here
              is an attempt to put that information somewhere findable, earlier.
            </p>
          </div>

          <aside className="space-y-8">
            <section aria-labelledby="team-heading" className="rounded-2xl border border-border bg-card p-6">
              <h2 id="team-heading" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Our reviewer
              </h2>
              {authors.map((author) => (
                <div key={author.id} className="mt-4">
                  <Image src={author.avatar} alt={`Portrait of ${author.name}`} width={160} height={160} className="h-16 w-16 rounded-full object-cover" />
                  <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">{author.name}</h3>
                  <p className="text-[15px] text-primary">{author.credentials}</p>
                  <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{author.bio}</p>
                </div>
              ))}
              <div className="mt-6 border-t border-border pt-4">
                <h3 className="font-serif text-lg font-semibold text-foreground">Erin Vasquez</h3>
                <p className="text-[15px] text-primary">Founder and editor</p>
                <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">
                  Erin spent twelve years as a health writer and editor before starting this site. She handles commissioning,
                  editing, and every correction request personally.
                </p>
              </div>
            </section>

            <Newsletter variant="inline" />
          </aside>
        </div>
      </div>
    </>
  );
}
