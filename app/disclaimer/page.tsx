import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Markdown } from '@/components/Markdown';
import { disclaimer } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Home Repair Safety Disclaimer',
  description:
    'Housewise Journal publishes general educational home maintenance information. Review our safety and liability limits before starting a repair.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Safety Disclaimer" description="Understand the limits of general home-repair guidance before starting work." />
      <div className="container py-12">
        <div className="max-w-prose">
          <Markdown source={disclaimer} />
        </div>
      </div>
    </>
  );
}
