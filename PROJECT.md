# Anima Web

Anima Web is a production web and provisioning surface currently presenting the Spiron AI-agent workforce product. It owns the Next.js marketing/provisioning app, Telegram webhook ingress, instance registration/provisioning APIs, database schema, Docker build input, and push-triggered platform redeploy workflow.

Lifecycle: `production`
Layer: `application`

## Goals

- Present and operate the public web surface for the Spiron/Anima agent product.
- Own instance registration, admin instance provisioning, stats, and Telegram webhook ingress implemented in this web app.
- Keep web/provisioning behavior separate from the underlying agent runtime and platform infrastructure.

## Non-Goals

- This repository does not own the Spiron agent runtime, sub-agent execution engine, memory system, or platform compute substrate.
- This repository does not own Sylphx Platform internals, central CI runners, enterprise release bots, or organization-wide delivery policy.
- This repository must not add product-runtime internals to the web/provisioning boundary.

## Boundaries

The machine-readable source of truth is [.doctrine/project.json](.doctrine/project.json). Agents must treat this repository as the web/provisioning adapter and route agent-runtime or platform-substrate behavior to the owning repositories.

## Public Surfaces

- Next.js app routes under `src/app/`.
- Telegram webhook route under `src/app/[slug]/webhook/telegram/[...path]/route.ts`.
- Instance registration and admin provisioning APIs under `src/app/api/`.
- Database schema and migrations under `src/lib/db/` and `drizzle/`.
- Docker image input in `Dockerfile`.
- Push-triggered deployment workflow in `.github/workflows/ci.yml`.

## Commercial Direction

Anima Web is the product web/provisioning surface and currently has no
repo-local pricing or metrics SSOT declared. Pricing, packaging, market
positioning, paid provisioning, and roadmap changes require a Commercial ADR
and must keep Spiron runtime commercial behavior in the owning product/runtime
boundary.

## Delivery

Behavior changes require build validation, migration proof for schema changes, platform deploy/readback, and smoke evidence for affected public, webhook, or provisioning routes. Webhook, provisioning, instance, and database side effects are forward-only in practice; recovery normally means halt ingress/provisioning, restore configuration where safe, or ship a forward fix.
