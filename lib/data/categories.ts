import type { Category } from '../types/post';

export const categories: Category[] = [
  { slug: 'seasonal-maintenance', name: 'Seasonal Maintenance', description: 'Practical spring, summer, fall, and winter checklists that prevent small problems from becoming expensive repairs.' },
  { slug: 'plumbing', name: 'Plumbing', description: 'Find leaks, protect pipes, clear simple clogs, and know when a licensed plumber is the safer and cheaper choice.' },
  { slug: 'heating-cooling', name: 'Heating & Cooling', description: 'HVAC upkeep, filter schedules, efficiency checks, and troubleshooting for a comfortable, lower-cost home.' },
  { slug: 'exterior-roof', name: 'Exterior & Roof', description: 'Roof, gutter, siding, drainage, and foundation guidance for keeping weather outside where it belongs.' },
  { slug: 'tools-materials', name: 'Tools & Materials', description: 'Clear buying guides for the tools, sealants, fasteners, filters, and safety gear homeowners actually need.' },
];

export const categoriesBySlug: Record<string, Category> = categories.reduce(
  (acc, category) => ({ ...acc, [category.slug]: category }),
  {} as Record<string, Category>
);
