import type { Author } from '../types/post';

export const authors: Author[] = [
{
  id: 'dr-maya-ellison',
  name: 'Dr. Maya Ellison',
  credentials: 'DVM, small animal practice',
  bio: "Maya has spent eleven years in general practice in Portland, Oregon, where roughly half her caseload is pets over the age of nine. She writes Grey Muzzle Guide's health explainers to give owners the same context she gives in the exam room — plain language, realistic options, and honest cost expectations.",
  avatar: "/cd705750-f0c6-45f9-a495-4b5cbf9e091f.jpg"

}];


export const authorsById: Record<string, Author> = authors.reduce(
  (acc, author) => ({ ...acc, [author.id]: author }),
  {} as Record<string, Author>
);