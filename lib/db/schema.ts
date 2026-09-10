import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const postStatus = pgEnum('post_status', ['draft', 'published']);
export const messageStatus = pgEnum('message_status', ['unread', 'read', 'replied']);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
};

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  ...timestamps,
}, (table) => ({ slugIdx: uniqueIndex('categories_slug_idx').on(table.slug) }));

export const authors = pgTable('authors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  credentials: text('credentials'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  ...timestamps,
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImageUrl: text('cover_image_url'),
  coverAlt: text('cover_alt'),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'restrict' }),
  authorId: uuid('author_id').notNull().references(() => authors.id, { onDelete: 'restrict' }),
  tags: text('tags').array().default([]).notNull(),
  status: postStatus('status').default('draft').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  ...timestamps,
}, (table) => ({ slugIdx: uniqueIndex('posts_slug_idx').on(table.slug) }));

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  topic: text('topic').notNull(),
  message: text('message').notNull(),
  status: messageStatus('status').default('unread').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const subscribers = pgTable('subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({ emailIdx: uniqueIndex('subscribers_email_idx').on(table.email) }));

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({ emailIdx: uniqueIndex('admin_users_email_idx').on(table.email) }));

export type PostRow = typeof posts.$inferSelect;
