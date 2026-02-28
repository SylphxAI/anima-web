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

const PLATFORM_API_URL = process.env.PLATFORM_API_URL ?? "https://sylphx.com";
const PLATFORM_API_TOKEN = process.env.PLATFORM_API_TOKEN ?? "";

// Anima git repo — compose template source
const ANIMA_GIT_REPO = "SylphxAI/anima";
const ANIMA_COMPOSE_PATH = "instances/generic/docker-compose.yml";
// Domain pattern for all Anima instances
const ANIMA_DOMAIN_SUFFIX = "anima.sylphx.com";

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
	return request.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

// ==========================================
// POST /api/admin/instances/provision
// ==========================================

/**
 * Provision a new Anima instance via Platform API (dogfooding path).
 *
 * Deployment: docker-compose git-based (SylphxAI/anima → instances/generic/docker-compose.yml)
 * This compose template includes all required Docker options:
 *   - /data:/data (JuiceFS persistent storage)
 *   - /var/run/docker.sock (sandbox spawning)
 *   - group_add: ["988"] (docker group)
 *   - ulimits: nofile=65535
 *
 * Request body:
 *   slug             — unique identifier, e.g. "alice"
 *   displayName      — human-readable name, e.g. "Alice"
 *   telegramBotToken — Telegram bot token for this instance
 *   gatewayToken?    — OpenClaw gateway token (falls back to GATEWAY_TOKEN env)
 *   platformToken?   — Pre-generated platform token (falls back to auto-generated)
 *   databaseUrl?     — Database URL (falls back to Platform-provisioned DB)
 *
 * Returns:
 *   { slug, url, token, platformAppId, status: "deploying" }
 *   token is returned ONCE and never stored in plaintext.
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
		gatewayToken,
		platformToken,
		databaseUrl,
	} = body as {
		slug?: string;
		displayName?: string;
		telegramBotToken?: string;
		gatewayToken?: string;
		platformToken?: string;
		databaseUrl?: string;
	};

	// Validate required fields
	if (!slug)
		return NextResponse.json({ error: "slug is required" }, { status: 400 });
	if (!displayName)
		return NextResponse.json(
			{ error: "displayName is required" },
			{ status: 400 },
		);
	if (!telegramBotToken)
		return NextResponse.json(
			{ error: "telegramBotToken is required" },
			{ status: 400 },
		);
	if (!/^[a-z0-9-]{2,48}$/.test(slug))
		return NextResponse.json(
			{
				error: "slug must be 2–48 lowercase alphanumeric characters or hyphens.",
			},
			{ status: 400 },
		);

	// Check slug uniqueness in anima-web DB
	const existing = await db.query.animaInstances.findFirst({
		where: eq(animaInstances.slug, slug),
	});
	if (existing) {
		return NextResponse.json(
			{ error: "An instance with this slug already exists." },
			{ status: 409 },
		);
	}

	// Instance registration token (returned once, stored as hash)
	const instanceToken = `anima_${randomBytes(32).toString("hex")}`;
	const tokenHash = hashToken(instanceToken);

	// Platform token for this instance (credential provider auth)
	// Caller may supply an existing token; otherwise we generate one.
	const instancePlatformToken =
		platformToken ?? `anima_plat_${randomBytes(24).toString("hex")}`;

	// Instance domain
	const instanceDomain = `${slug}.${ANIMA_DOMAIN_SUFFIX}`;
	const deployUrl = `https://${instanceDomain}`;

	// ==========================================
	// Step 1: Create app on Platform
	// Uses docker-compose git deployment — NOT dockerImage.
	// The compose template handles volumes, docker.sock, group_add, ulimits.
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
		const result = (await platformFetch("/api/v1/projects", {
			method: "POST",
			body: JSON.stringify({
				name: displayName,
				slug,
				description: `Anima instance: ${displayName}`,
				dockerComposeGit: {
					gitRepository: ANIMA_GIT_REPO,
					gitBranch: "main",
					dockerComposeLocation: ANIMA_COMPOSE_PATH,
				},
				domain: instanceDomain,
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

	// ==========================================
	// Step 2: Set instance env vars via Platform
	//
	// PLATFORM_TOKEN: Anima agent authenticates with Sylphx Platform
	//   (credential provider — currently passes through to env, future: Platform credential API)
	// ANTHROPIC_API_KEY / OPENAI_API_KEY: AI credentials
	//   (set as env vars; when Platform credential API exists, remove these)
	// ==========================================
	const envVars: Array<{ key: string; value: string }> = [
		{ key: "INSTANCE_ID", value: slug },
		{ key: "PLATFORM_TOKEN", value: instancePlatformToken },
		{ key: "TELEGRAM_BOT_TOKEN", value: telegramBotToken },
		{ key: "RUST_LOG", value: "anima=info,warn" },
	];

	// AI credentials — from anima-web defaults (set in its own env)
	if (process.env.ANTHROPIC_API_KEY) {
		envVars.push({ key: "ANTHROPIC_API_KEY", value: process.env.ANTHROPIC_API_KEY });
	}
	if (process.env.OPENAI_API_KEY) {
		envVars.push({ key: "OPENAI_API_KEY", value: process.env.OPENAI_API_KEY });
	}

	// Gateway token
	const gtoken = gatewayToken ?? process.env.GATEWAY_TOKEN;
	if (gtoken) {
		envVars.push({ key: "GATEWAY_TOKEN", value: gtoken });
	}

	// Override DATABASE_URL if Platform didn't provision one or caller supplies it
	const dbUrl =
		databaseUrl ??
		platformApp.infrastructure?.database?.url;
	if (dbUrl) {
		envVars.push({ key: "DATABASE_URL", value: dbUrl });
	}

	const envVarErrors: string[] = [];
	try {
		await platformFetch(`/api/v1/projects/${platformApp.id}/env-vars`, {
			method: "POST",
			body: JSON.stringify({ vars: envVars }),
		});
	} catch (err) {
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
			`/api/v1/projects/${platformApp.id}/deploy`,
			{ method: "POST" },
		)) as { deploymentId?: string };
		deploymentId = deployResult.deploymentId ?? null;
	} catch (err) {
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
			token: instanceToken,
			status: "deploying",
			warnings: envVarErrors.length > 0 ? envVarErrors : undefined,
		},
		{ status: 201 },
	);
}
