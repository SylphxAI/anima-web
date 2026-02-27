import "server-only";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { hashToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { animaInstances } from "@/lib/db/schema";

function checkAdminSecret(request: Request) {
	const secret = request.headers.get("x-admin-secret");
	return secret === process.env.ADMIN_SECRET;
}

export async function POST(request: Request) {
	if (!checkAdminSecret(request)) {
		return NextResponse.json({ error: "forbidden" }, { status: 403 });
	}

	const body = await request.json();
	const { slug, orgName } = body as { slug?: string; orgName?: string };

	if (!slug) {
		return NextResponse.json({ error: "slug is required" }, { status: 400 });
	}

	const token = randomBytes(32).toString("hex");
	const tokenHash = hashToken(token);

	const [instance] = await db
		.insert(animaInstances)
		.values({ slug, orgName: orgName ?? null, tokenHash })
		.returning({ id: animaInstances.id, slug: animaInstances.slug });

	// Return token ONCE — it is not stored in plaintext
	return NextResponse.json({ ok: true, id: instance.id, slug: instance.slug, token });
}

export async function GET(request: Request) {
	if (!checkAdminSecret(request)) {
		return NextResponse.json({ error: "forbidden" }, { status: 403 });
	}

	const rows = await db
		.select({
			slug: animaInstances.slug,
			orgName: animaInstances.orgName,
			status: animaInstances.status,
			lastSeenAt: animaInstances.lastSeenAt,
			totalMessages: animaInstances.totalMessages,
		})
		.from(animaInstances);

	return NextResponse.json(rows);
}
