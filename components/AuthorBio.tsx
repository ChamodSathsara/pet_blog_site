import Image from 'next/image';
import Link from 'next/link';
import type { Author } from '@/lib/types/post';

interface AuthorBioProps {
  author: Author;
}

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <section aria-labelledby="author-heading" className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Image
          src={author.avatar}
          alt={`Portrait of ${author.name}`}
          width={160}
          height={160}
          className="h-20 w-20 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Written and reviewed by
          </p>
          <h2 id="author-heading" className="mt-1 font-serif text-xl font-semibold text-foreground">
            {author.name}
          </h2>
          <p className="text-[15px] text-primary">{author.credentials}</p>
          <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{author.bio}</p>
          <Link
            href="/about"
            className="mt-3 inline-block text-[15px] font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            More about our editorial process
          </Link>
        </div>
      </div>
    </section>
  );
}
