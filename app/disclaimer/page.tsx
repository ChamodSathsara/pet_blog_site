import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Markdown } from '@/components/Markdown';
import { disclaimer } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Medical Disclaimer',
  description:
    'Grey Muzzle Guide publishes general educational information about pet health. Read our full medical disclaimer before acting on anything you find on this site.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Medical Disclaimer" description="Please read this before acting on anything published on this site." />
      <div className="container py-12">
        <div className="max-w-prose">
          <Markdown source={disclaimer} />
        </div>
      </div>
    </>
  );
}
