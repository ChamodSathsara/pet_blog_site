import React from 'react';
import { Info } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';
import { parseInline, parseMarkdown } from '@/lib/utils/markdown';
import type { InlineToken, MarkdownBlock } from '@/lib/utils/markdown';

interface MarkdownProps {
  source: string;
  /** Insert an in-article ad slot after this many top-level blocks. */
  adAfterBlock?: number;
}

function Inline({ text }: { text: string }) {
  const tokens: InlineToken[] = parseInline(text);
  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === 'strong') {
          return (
            <strong key={index} className="font-semibold text-foreground">
              {token.value}
            </strong>
          );
        }
        if (token.type === 'em') {
          return <em key={index}>{token.value}</em>;
        }
        if (token.type === 'link') {
          return (
            <a
              key={index}
              href={token.href}
              className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              {token.value}
            </a>
          );
        }
        return <React.Fragment key={index}>{token.value}</React.Fragment>;
      })}
    </>
  );
}

function Block({ block }: { block: MarkdownBlock }) {
  switch (block.type) {
    case 'heading':
      return block.level === 2 ? (
        <h2
          id={block.id}
          className="mt-12 scroll-mt-28 text-[26px] font-semibold leading-tight text-foreground md:text-[32px]"
        >
          {block.text}
        </h2>
      ) : (
        <h3 id={block.id} className="mt-9 scroll-mt-28 text-xl font-semibold leading-snug text-foreground md:text-2xl">
          {block.text}
        </h3>
      );

    case 'paragraph':
      return (
        <p className="mt-5 text-[19px] leading-[1.75] text-foreground/85">
          <Inline text={block.text} />
        </p>
      );

    case 'list':
      return block.ordered ? (
        <ol className="mt-5 space-y-3 pl-6 text-[19px] leading-[1.7] text-foreground/85 [counter-reset:item]">
          {block.items.map((item, index) => (
            <li key={index} className="list-decimal pl-1 marker:text-primary">
              <Inline text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="mt-5 space-y-3 pl-6 text-[19px] leading-[1.7] text-foreground/85">
          {block.items.map((item, index) => (
            <li key={index} className="list-disc pl-1 marker:text-primary">
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );

    case 'quote':
      return (
        <blockquote className="mt-7 border-l-4 border-primary/40 bg-secondary/60 px-6 py-4 text-[19px] italic leading-relaxed text-foreground/85">
          <Inline text={block.text} />
        </blockquote>
      );

    case 'callout':
      return (
        <div className="mt-8 rounded-2xl border border-terracotta/30 bg-sand p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-1 h-5 w-5 shrink-0 text-terracotta" aria-hidden="true" />
            <div>
              <p className="font-serif text-lg font-semibold text-foreground">{block.title}</p>
              <p className="mt-2 text-[18px] leading-relaxed text-foreground/85">
                <Inline text={block.text} />
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function Markdown({ source, adAfterBlock }: MarkdownProps) {
  const blocks = parseMarkdown(source);

  return (
    <div>
      {blocks.map((block, index) => (
        <React.Fragment key={index}>
          <Block block={block} />
          {adAfterBlock === index + 1 && <AdSlot position="in-article" className="my-10" />}
        </React.Fragment>
      ))}
    </div>
  );
}
