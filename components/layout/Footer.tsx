import Link from 'next/link';
import { PawPrint } from 'lucide-react';
import { categories } from '@/lib/data/categories';

const siteLinks = [
  { href: '/blog', label: 'All Articles' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Medical Disclaimer' },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/60">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-primary-foreground">
                <PawPrint className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-serif text-lg font-semibold text-foreground">Grey Muzzle Guide</span>
            </div>
            <p className="mt-4 max-w-xs text-[16px] leading-relaxed text-muted-foreground">
              Practical, veterinarian-reviewed guidance for people caring for older dogs and cats across the US and Canada.
            </p>
          </div>

          <nav aria-labelledby="footer-categories">
            <h2 id="footer-categories" className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
              Topics
            </h2>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/category/${category.slug}`} className="text-[16px] text-muted-foreground hover:text-primary">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-site">
            <h2 id="footer-site" className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
              Site
            </h2>
            <ul className="mt-4 space-y-2.5">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[16px] text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
              Legal
            </h2>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[16px] text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="/sitemap.xml" className="text-[16px] text-muted-foreground hover:text-primary">
                  Sitemap
                </a>
              </li>
            </ul>
            <a href="mailto:hello@greymuzzleguide.com" className="mt-5 inline-block text-[15px] text-muted-foreground hover:text-primary">
              hello@greymuzzleguide.com
            </a>
          </nav>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Grey Muzzle Guide publishes general educational information about pet health. It is not veterinary advice and does not
            replace an examination by a licensed veterinarian. If your pet is unwell, contact your veterinarian or nearest emergency
            hospital.
          </p>
          <p className="mt-4 text-[15px] text-muted-foreground">© {new Date().getFullYear()} Grey Muzzle Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
