import "server-only";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { authenticateInstance } from "@/lib/auth";
import { db } from "@/lib/db";
import { animaInstances } from "@/lib/db/schema";

export async function POST(request: Request) {
	const instance = await authenticateInstance(request);
	if (!instance) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { slug, internalUrl } = body as { slug?: string; internalUrl?: string };

	if (!slug || !internalUrl) {
		return NextResponse.json({ error: "slug and internalUrl are required" }, { status: 400 });
	}

	await db
		.update(animaInstances)
		.set({
			internalUrl,
			lastSeenAt: new Date(),
			updatedAt: new Date(),
		})
		.where(eq(animaInstances.id, instance.id));

	return NextResponse.json({
		ok: true,
		slug: instance.slug,
		webhookBase: `https://anima.sylphx.com/${instance.slug}`,
	});
}
