import "server-only";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { hashToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { animaInstances } from "@/lib/db/schema";

// ==========================================
// Platform API client (internal)
// ==========================================

const PLATFORM_API_URL =
	process.env.PLATFORM_API_URL ?? "https://sylphx.com";
const PLATFORM_API_TOKEN = process.env.PLATFORM_API_TOKEN ?? "";

async function platformFetch(
	path: string,
	options: RequestInit = {},
): Promise<unknown> {
	const res = await fetch(`${PLATFORM_API_URL}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${PLATFORM_API_TOKEN}`,
			"Content-Type": "application/json",
			...options.headers,
		},
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(
			`Platform API error (${res.status}): ${text.slice(0, 300)}`,
		);
	}
	return res.json();
}

// ==========================================
// Auth helper
// ==========================================

function checkAdminSecret(request: Request): boolean {
	const secret = request.headers.get("x-admin-secret");
	return secret === process.env.ADMIN_SECRET;
}

// ==========================================
// POST /api/admin/instances/provision
// ==========================================

/**
 * Provision a new Anima instance via Platform API.
 *
 * This is the idiomatic dogfooding path: anima-web orchestrates the
 * full lifecycle (infrastructure + deploy) through Platform HTTP API
 * without any direct coupling to the underlying deploy infrastructure.
 *
 * Request body:
 *   slug            — unique identifier, e.g. "alice"
 *   displayName     — human-readable name, e.g. "Alice"
 *   telegramBotToken — Telegram bot token for this instance
 *   anthropicApiKey? — defaults to ANTHROPIC_API_KEY env var
 *   openAiApiKey?   — defaults to OPENAI_API_KEY env var
 *   gatewayToken?   — OpenClaw gateway token; defaults to GATEWAY_TOKEN env var
 *
 * Returns:
 *   { slug, url, token, platformAppId, status: "deploying" }
 *   The token is returned ONCE and is never stored in plaintext.
 */
export async function POST(request: Request): Promise<NextResponse> {
	if (!checkAdminSecret(request)) {
		return NextResponse.json({ error: "forbidden" }, { status: 403 });
	}

	if (!PLATFORM_API_TOKEN) {
		return NextResponse.json(
			{ error: "PLATFORM_API_TOKEN is not configured." },
			{ status: 503 },
		);
	}

	const body = await request.json();
	const {
		slug,
		displayName,
		telegramBotToken,
		anthropicApiKey,
		openAiApiKey,
		gatewayToken,
	} = body as {
		slug?: string;
		displayName?: string;
		telegramBotToken?: string;
		anthropicApiKey?: string;
		openAiApiKey?: string;
		gatewayToken?: string;
	};

	if (!slug) {
		return NextResponse.json({ error: "slug is required" }, { status: 400 });
	}
	if (!displayName) {
		return NextResponse.json(
			{ error: "displayName is required" },
			{ status: 400 },
		);
	}
	if (!telegramBotToken) {
		return NextResponse.json(
			{ error: "telegramBotToken is required" },
			{ status: 400 },
		);
	}
	if (!/^[a-z0-9-]{2,48}$/.test(slug)) {
		return NextResponse.json(
			{
				error: "slug must be 2–48 lowercase alphanumeric characters or hyphens.",
			},
			{ status: 400 },
		);
	}

	// Check slug is not already taken in anima-web DB
	const existing = await db.query.animaInstances.findFirst({
		where: eq(animaInstances.slug, slug),
	});
	if (existing) {
		return NextResponse.json(
			{ error: "An instance with this slug already exists." },
			{ status: 409 },
		);
	}

	// Generate instance registration token (returned once, stored as hash)
	const instanceToken = `anima_${randomBytes(32).toString("hex")}`;
	const tokenHash = hashToken(instanceToken);

	// ==========================================
	// Step 1: Create app on Platform
	// ==========================================
	let platformApp: {
		id: string;
		slug: string;
		environments: Array<{
			id: string;
			envType: string;
			secretKey: string;
			deployAppId: string | null;
		}>;
		infrastructure: {
			database: { url: string } | null;
		};
	};

	try {
		const result = (await platformFetch("/api/v1/apps", {
			method: "POST",
			body: JSON.stringify({
				name: displayName,
				slug,
				description: `Anima instance: ${displayName}`,
				dockerImage: "ghcr.io/sylphxai/anima:latest",
				port: 3000,
			}),
		})) as { app: typeof platformApp };
		platformApp = result.app;
	} catch (err) {
		return NextResponse.json(
			{
				error: `Failed to provision via Platform: ${err instanceof Error ? err.message : String(err)}`,
			},
			{ status: 502 },
		);
	}

	const deployUrl = `https://${slug}.sylphx.app`;
	const animaWebUrl =
		process.env.NEXT_PUBLIC_APP_URL ?? "https://anima.sylphx.com";

	// ==========================================
	// Step 2: Set environment variables on Platform
	// ==========================================
	const envVars: Array<{ key: string; value: string }> = [
		{ key: "INSTANCE_ID", value: slug },
		{ key: "DATA_ROOT", value: "/data" },
		{ key: "RUST_LOG", value: "anima=info,warn" },
		{ key: "PORT", value: "3000" },
		{ key: "TELEGRAM_BOT_TOKEN", value: telegramBotToken },
		// Anima-web registry: lets the agent self-register its internal URL on boot
		{ key: "ANIMA_WEB_URL", value: animaWebUrl },
		{ key: "ANIMA_WEB_TOKEN", value: instanceToken },
	];

	if (anthropicApiKey ?? process.env.ANTHROPIC_API_KEY) {
		envVars.push({
			key: "ANTHROPIC_API_KEY",
			value: anthropicApiKey ?? (process.env.ANTHROPIC_API_KEY as string),
		});
	}
	if (openAiApiKey ?? process.env.OPENAI_API_KEY) {
		envVars.push({
			key: "OPENAI_API_KEY",
			value: openAiApiKey ?? (process.env.OPENAI_API_KEY as string),
		});
	}
	if (gatewayToken ?? process.env.GATEWAY_TOKEN) {
		envVars.push({
			key: "GATEWAY_TOKEN",
			value: gatewayToken ?? (process.env.GATEWAY_TOKEN as string),
		});
	}

	const envVarErrors: string[] = [];
	try {
		await platformFetch(`/api/v1/apps/${platformApp.id}/env-vars`, {
			method: "POST",
			body: JSON.stringify({ vars: envVars }),
		});
	} catch (err) {
		// Non-fatal: env vars can be set manually if needed
		envVarErrors.push(
			`env-vars: ${err instanceof Error ? err.message : String(err)}`,
		);
	}

	// ==========================================
	// Step 3: Trigger deploy
	// ==========================================
	let deploymentId: string | null = null;
	try {
		const deployResult = (await platformFetch(
			`/api/v1/apps/${platformApp.id}/deploy`,
			{ method: "POST" },
		)) as { deploymentId?: string };
		deploymentId = deployResult.deploymentId ?? null;
	} catch (err) {
		// Non-fatal: deploy can be triggered manually
		envVarErrors.push(
			`deploy: ${err instanceof Error ? err.message : String(err)}`,
		);
	}

	// ==========================================
	// Step 4: Register instance in anima-web DB
	// ==========================================
	const [instance] = await db
		.insert(animaInstances)
		.values({
			slug,
			orgName: displayName,
			tokenHash,
			platformAppId: platformApp.id,
			deployUrl,
			status: "deploying",
		})
		.returning({ id: animaInstances.id, slug: animaInstances.slug });

	return NextResponse.json(
		{
			ok: true,
			id: instance.id,
			slug: instance.slug,
			url: deployUrl,
			platformAppId: platformApp.id,
			deploymentId,
			// Returned ONCE — not stored in plaintext
			token: instanceToken,
			status: "deploying",
			warnings: envVarErrors.length > 0 ? envVarErrors : undefined,
		},
		{ status: 201 },
	);
}
