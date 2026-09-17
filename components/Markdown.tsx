import React from 'react';
import Image from 'next/image';
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

    case 'image':
      return (
        <figure className="mt-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
            <Image src={block.src} alt={block.alt} fill sizes="(max-width: 768px) 100vw, 760px" className="object-contain" />
          </div>
          {block.caption && <figcaption className="mt-2 text-center text-[15px] leading-relaxed text-muted-foreground"><Inline text={block.caption} /></figcaption>}
        </figure>
      );

    case 'code':
      return (
        <div className="mt-7 overflow-hidden rounded-2xl border border-border bg-foreground text-background">
          {block.language && <div className="border-b border-background/15 px-5 py-2 font-mono text-xs uppercase tracking-wide text-background/70">{block.language}</div>}
          <pre className="overflow-x-auto p-5 text-[15px] leading-relaxed"><code className="font-mono" data-language={block.language}>{block.code}</code></pre>
        </div>
      );

    case 'table':
      return (
        <div className="mt-7 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[560px] border-collapse text-left text-[17px] text-foreground/85">
            <thead className="bg-secondary/70 text-foreground">
              <tr>{block.headers.map((header, index) => <th key={index} scope="col" className="border-b border-border px-4 py-3 font-semibold"><Inline text={header} /></th>)}</tr>
            </thead>
            <tbody>{block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border last:border-b-0">
                {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top leading-relaxed"><Inline text={cell} /></td>)}
              </tr>
            ))}</tbody>
          </table>
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
