import type { Author } from '../types/post';

export const authors: Author[] = [{
  id: 'daniel-brooks',
  name: 'Daniel Brooks',
  credentials: 'Home maintenance editor',
  bio: 'Daniel edits practical home-maintenance guides for clear sequencing, realistic costs, and the point where a homeowner should stop and call a licensed professional.',
  avatar: '/cd705750-f0c6-45f9-a495-4b5cbf9e091f.jpg',
}];

export const authorsById: Record<string, Author> = authors.reduce(
  (acc, author) => ({ ...acc, [author.id]: author }),
  {} as Record<string, Author>
);
