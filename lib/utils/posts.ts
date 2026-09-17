import type { Post } from '../types/post';
import { readingTime } from './markdown';

export function getPostReadTime(post: Post): number {
  return readingTime(post.content);
}

export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
