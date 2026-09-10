'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import { parseMarkdown } from '@/lib/utils/markdown';
import type { MarkdownBlock } from '@/lib/utils/markdown';
import { cn } from '@/lib/utils/cn';

interface TableOfContentsProps {
  source: string;
  className?: string;
}

type HeadingBlock = Extract<MarkdownBlock, { type: 'heading' }>;

export function TableOfContents({ source, className }: TableOfContentsProps) {
  const headings = parseMarkdown(source).filter((block): block is HeadingBlock => block.type === 'heading');
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    );
    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  if (headings.length < 3) return null;

  return (
    <nav aria-labelledby="toc-heading" className={cn('', className)}>
      <p id="toc-heading" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <List className="h-4 w-4" aria-hidden="true" />
        In this guide
      </p>
      <ul className="mt-4 space-y-2 border-l border-border">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                '-ml-px block border-l-2 py-1 text-[15px] leading-snug transition-colors',
                heading.level === 3 ? 'pl-6' : 'pl-4',
                activeId === heading.id ? 'border-primary font-medium text-primary' : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
