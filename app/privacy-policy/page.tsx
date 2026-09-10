import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Markdown } from '@/components/Markdown';
import { privacyPolicy } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How Grey Muzzle Guide collects and uses information, our use of cookies, and disclosures about third-party advertising including Google AdSense.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect, why we collect it, how advertising works on this site, and how to exercise your rights."
      />
      <div className="container py-12">
        <div className="max-w-prose">
          <Markdown source={privacyPolicy} />
        </div>
      </div>
    </>
  );
}
