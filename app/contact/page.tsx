import type { Metadata } from 'next';
import { AlertTriangle, Mail, MapPin } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from './ContactForm';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Grey Muzzle Guide',
  description: 'Send Grey Muzzle Guide a question, an article suggestion, or a correction. We reply to every message within three business days.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Questions, corrections, article suggestions, and advertising enquiries all reach the same inbox. A real person reads every message."
      />

      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
              <p className="text-[17px] leading-relaxed text-foreground/85">
                <strong className="font-semibold">We cannot answer medical questions about your pet.</strong> We are not able to
                diagnose, advise on treatment, or triage symptoms by email. If something is wrong, please contact your veterinarian
                or the nearest emergency animal hospital.
              </p>
            </div>

            <ContactForm />
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-secondary/50 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Reach us directly</h2>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[16px] font-medium text-foreground">General</p>
                    <a href="mailto:hello@greymuzzleguide.com" className="text-[16px] text-primary hover:underline">
                      hello@greymuzzleguide.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[16px] font-medium text-foreground">Corrections</p>
                    <a href="mailto:corrections@greymuzzleguide.com" className="text-[16px] text-primary hover:underline">
                      corrections@greymuzzleguide.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[16px] font-medium text-foreground">Mailing address</p>
                    <p className="text-[16px] text-muted-foreground">
                      Grey Muzzle Guide
                      <br />
                      2140 SE Division St, Suite 4
                      <br />
                      Portland, OR 97202, USA
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">Response times</h2>
              <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">
                Monday to Friday, we reply within three business days. Corrections are prioritized and usually answered the same
                day.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
