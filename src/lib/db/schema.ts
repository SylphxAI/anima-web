import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Anima instance registry
 * Each row = one running Anima agent instance
 */
export const animaInstances = pgTable("anima_instances", {
	id: uuid("id").primaryKey().defaultRandom(),
	slug: text("slug").notNull().unique(), // e.g. "stanley", "vanessa"
	tokenHash: text("token_hash").notNull().unique(), // SHA-256 of registration token
	internalUrl: text("internal_url"), // e.g. "http://anima-stanley:3000"
	orgName: text("org_name"), // e.g. "Epiow Limited"
	/** Platform app ID if provisioned via Platform API */
	platformAppId: text("platform_app_id"),
	/** Public URL of the deployed instance, e.g. "https://anima-alice.sylphx.app" */
	deployUrl: text("deploy_url"),
	status: text("status").notNull().default("active"),
	lastSeenAt: timestamp("last_seen_at"),
	totalMessages: integer("total_messages").notNull().default(0),
	totalUsers: integer("total_users").notNull().default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
