import "server-only";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { animaInstances } from "@/lib/db/schema";

export const revalidate = 60;

export async function GET() {
	const rows = await db.select().from(animaInstances).where(eq(animaInstances.status, "active"));

	const instances = rows.length;
	const totalMessages = rows.reduce((sum, r) => sum + r.totalMessages, 0);
	const totalUsers = rows.reduce((sum, r) => sum + r.totalUsers, 0);
	const orgs = new Set(rows.map((r) => r.orgName).filter(Boolean)).size;

	return NextResponse.json({ instances, totalMessages, totalUsers, orgs });
}
