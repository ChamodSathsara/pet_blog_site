import React from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <div className="border-b border-border bg-secondary/40">
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
          <h1 className="mt-3 font-serif text-[34px] font-semibold leading-[1.1] text-foreground md:text-[46px]">{title}</h1>
          {description && <p className="mt-4 text-[19px] leading-relaxed text-muted-foreground">{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
