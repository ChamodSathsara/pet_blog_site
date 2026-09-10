import { posts } from '../data/posts';
import { authorsById } from '../data/authors';
import { categoriesBySlug } from '../data/categories';
import type { Author, Category, Post } from '../types/post';
import { readingTime } from './markdown';

export function getAllPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter((post) => post.category === categorySlug);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getFeaturedPost(): Post {
  const all = getAllPosts();
  return all.find((post) => post.featured) ?? all[0];
}

export function getRelatedPosts(post: Post, limit = 2): Post[] {
  const others = getAllPosts().filter((item) => item.slug !== post.slug);
  const scored = others.map((item) => {
    const sharedTags = item.tags.filter((tag) => post.tags.includes(tag)).length;
    const sameCategory = item.category === post.category ? 2 : 0;
    return { item, score: sharedTags + sameCategory };
  });
  return scored.
  sort((a, b) => b.score - a.score).
  slice(0, limit).
  map((entry) => entry.item);
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => set.add(tag)));
  return Array.from(set).sort();
}

export function getAuthor(id: string): Author | undefined {
  return authorsById[id];
}

export function getCategory(slug: string): Category | undefined {
  return categoriesBySlug[slug];
}

export function getPostReadTime(post: Post): number {
  return readingTime(post.content);
}

export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}