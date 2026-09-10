import type { Post } from '../../types/post';
import { seniorDogArthritis } from './senior-dog-arthritis';
import { diabeticCatDiet } from './diabetic-cat-diet';
import { seniorPetEmergencySigns } from './senior-pet-emergency-signs';

/**
 * In a Next.js build this array is produced by reading `/content/posts/*.mdx`
 * with gray-matter at build time. The shape is identical, so pages do not change.
 */
export const posts: Post[] = [
seniorDogArthritis,
diabeticCatDiet,
seniorPetEmergencySigns];