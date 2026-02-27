CREATE TABLE "anima_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"token_hash" text NOT NULL,
	"internal_url" text,
	"org_name" text,
	"status" text DEFAULT 'active' NOT NULL,
	"last_seen_at" timestamp,
	"total_messages" integer DEFAULT 0 NOT NULL,
	"total_users" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "anima_instances_slug_unique" UNIQUE("slug"),
	CONSTRAINT "anima_instances_token_hash_unique" UNIQUE("token_hash")
);
