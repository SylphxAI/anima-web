import "server-only";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { animaInstances } from "@/lib/db/schema";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ slug: string; path: string[] }> },
) {
	const { slug, path } = await params;

	const instance = await db.query.animaInstances.findFirst({
		where: eq(animaInstances.slug, slug),
		columns: { internalUrl: true, id: true },
	});

	if (!instance?.internalUrl) {
		return NextResponse.json({ error: "instance not found" }, { status: 404 });
	}

	const targetUrl = `${instance.internalUrl}/webhook/telegram/${path.join("/")}`;
	const body = await request.arrayBuffer();

	try {
		const upstream = await fetch(targetUrl, {
			method: "POST",
			headers: {
				"content-type": request.headers.get("content-type") ?? "application/json",
				"x-telegram-bot-api-secret-token":
					request.headers.get("x-telegram-bot-api-secret-token") ?? "",
			},
			body,
			signal: AbortSignal.timeout(10000),
		});

		// fire-and-forget: increment message counter
		db.update(animaInstances)
			.set({ totalMessages: sql`${animaInstances.totalMessages} + 1` })
			.where(eq(animaInstances.id, instance.id))
			.execute()
			.catch(() => {});

		const resBody = await upstream.arrayBuffer();
		return new Response(resBody, {
			status: upstream.status,
			headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
		});
	} catch (err) {
		console.error("[webhook-relay] failed", { slug, targetUrl, err });
		return NextResponse.json({ error: "relay failed" }, { status: 502 });
	}
}
