ALTER TABLE "posts" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "no_index" boolean DEFAULT false NOT NULL;