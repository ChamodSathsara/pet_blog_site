export interface Author {
  id: string;
  name: string;
  credentials: string;
  bio: string;
  avatar: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
}

/**
 * Mirrors the frontmatter of a `.mdx` file in `/content/posts/`:
 * title, slug, date, excerpt, coverImage, tags, author — plus the
 * markdown body in `content`.
 */
export interface Post {
  title: string;
  slug: string;
  date: string;
  updatedDate?: string;
  excerpt: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  coverImage: string;
  coverAlt: string;
  category: string;
  categoryName?: string;
  tags: string[];
  author?: string;
  featured?: boolean;
  content: string;
}
