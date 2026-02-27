import "server-only";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { animaInstances } from "./db/schema";

export function hashToken(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}

export async function authenticateInstance(request: Request) {
	const auth = request.headers.get("authorization");
	if (!auth?.startsWith("Bearer ")) return null;
	const hash = hashToken(auth.slice(7));
	return db.query.animaInstances
		.findFirst({
			where: eq(animaInstances.tokenHash, hash),
		})
		.then((r) => r ?? null);
}
