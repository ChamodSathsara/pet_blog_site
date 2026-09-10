export type InlineToken =
{type: 'text';value: string;} |
{type: 'strong';value: string;} |
{type: 'em';value: string;} |
{type: 'link';value: string;href: string;};

export type MarkdownBlock =
{type: 'heading';level: 2 | 3;text: string;id: string;} |
{type: 'paragraph';text: string;} |
{type: 'list';ordered: boolean;items: string[];} |
{type: 'quote';text: string;} |
{type: 'callout';title: string;text: string;};

export function slugify(value: string): string {
  return value.
  toLowerCase().
  replace(/[^a-z0-9\s-]/g, '').
  trim().
  replace(/\s+/g, '-');
}

export function parseMarkdown(source: string): MarkdownBlock[] {
  const chunks = source.trim().split(/\n{2,}/);
  const blocks: MarkdownBlock[] = [];

  for (const raw of chunks) {
    const chunk = raw.trim();
    if (!chunk) continue;

    if (chunk.startsWith('### ')) {
      const text = chunk.slice(4).trim();
      blocks.push({ type: 'heading', level: 3, text, id: slugify(text) });
      continue;
    }
    if (chunk.startsWith('## ')) {
      const text = chunk.slice(3).trim();
      blocks.push({ type: 'heading', level: 2, text, id: slugify(text) });
      continue;
    }
    if (chunk.startsWith(':::')) {
      const lines = chunk.split('\n');
      const title = lines[0].replace(/^:::\s*/, '').trim();
      blocks.push({
        type: 'callout',
        title: title || 'Good to know',
        text: lines.slice(1).join(' ').trim()
      });
      continue;
    }
    if (chunk.startsWith('> ')) {
      blocks.push({
        type: 'quote',
        text: chunk.
        split('\n').
        map((line) => line.replace(/^>\s?/, '')).
        join(' ').
        trim()
      });
      continue;
    }
    if (/^-\s/.test(chunk)) {
      blocks.push({
        type: 'list',
        ordered: false,
        items: chunk.
        split('\n').
        filter((line) => /^-\s/.test(line)).
        map((line) => line.replace(/^-\s+/, '').trim())
      });
      continue;
    }
    if (/^\d+\.\s/.test(chunk)) {
      blocks.push({
        type: 'list',
        ordered: true,
        items: chunk.
        split('\n').
        filter((line) => /^\d+\.\s/.test(line)).
        map((line) => line.replace(/^\d+\.\s+/, '').trim())
      });
      continue;
    }

    blocks.push({ type: 'paragraph', text: chunk.replace(/\n/g, ' ') });
  }

  return blocks;
}

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    const chunk = match[0];
    if (chunk.startsWith('**')) {
      tokens.push({ type: 'strong', value: chunk.slice(2, -2) });
    } else if (chunk.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(chunk);
      if (linkMatch) {
        tokens.push({ type: 'link', value: linkMatch[1], href: linkMatch[2] });
      }
    } else {
      tokens.push({ type: 'em', value: chunk.slice(1, -1) });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens;
}

export function countWords(source: string): number {
  return source.trim().split(/\s+/).filter(Boolean).length;
}

export function readingTime(source: string): number {
  return Math.max(1, Math.round(countWords(source) / 225));
}