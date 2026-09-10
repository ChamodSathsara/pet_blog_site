import type { Category } from '../types/post';

export const categories: Category[] = [
{
  slug: 'senior-pet-care',
  name: 'Senior Pet Care',
  description:
  'Day-to-day care for dogs and cats in their last third of life — mobility, comfort, cognition, and knowing when something has genuinely changed.'
},
{
  slug: 'dog-health',
  name: 'Dog Health',
  description:
  'Conditions that show up most often in aging dogs, from osteoarthritis and laryngeal paralysis to breed-specific risks in Labs, Dachshunds, and Goldens.'
},
{
  slug: 'cat-health',
  name: 'Cat Health',
  description:
  'Chronic kidney disease, diabetes, hyperthyroidism, and dental pain — the quiet conditions cats are famously good at hiding.'
},
{
  slug: 'nutrition',
  name: 'Nutrition',
  description:
  'Therapeutic diets, protein needs in older pets, weight management, and how to read a label without falling for marketing.'
},
{
  slug: 'product-guides',
  name: 'Product Guides',
  description:
  'Orthopedic beds, ramps, harnesses, glucose monitors, and mobility aids — what actually helps, and what is worth skipping.'
}];


export const categoriesBySlug: Record<string, Category> = categories.reduce(
  (acc, category) => ({ ...acc, [category.slug]: category }),
  {} as Record<string, Category>
);