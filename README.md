# Anima

**AI agents that actually work.**

Anima deploys autonomous AI agents into your business workflows. Persistent teams, Docker-isolated sub-agents, 4-stage semantic memory, zero credential leakage.

→ **[anima.sylphx.com](https://anima.sylphx.com)**

---

## What It Does

Most AI platforms give you a chatbot. Anima gives you a workforce.

- **Persistent teams** — agents survive server restarts, communicate via inboxes and broadcast channels
- **Isolation by architecture** — every sub-agent runs in a Docker container. Not opt-in. Enforced.
- **4-stage memory** — semantic search + keyword search → fuse → re-rank → recency boost. Precision and recall, not just "closest in concept-space"
- **Secrets done right** — agents know key names, never key values. Nothing leaks through context overflow
- **~30 tools, all real** — only what a shell command genuinely can't do (vector search, Docker exec, image generation). No wrappers around things Claude already knows

## Use Cases

- **HR & People Ops** — onboarding, leave management, policy Q&A, staff communications
- **Operations** — approvals, status updates, task routing, internal knowledge base
- **Customer-facing** — intake, triage, escalation — always on, never off-brand

## Built On

Anima runs entirely on the [Sylphx Platform](https://sylphx.com) — our own AI-native PaaS. It's Customer Zero: proof that one key and 19 production services can run a full autonomous AI workforce in production.

---

## Tech Stack

- **Rust** — high-performance agent gateway
- **TypeScript / Next.js** — web interface
- **Docker** — mandatory sub-agent isolation
- **PostgreSQL** — persistent state
- **ChromaDB + OpenAI embeddings** — semantic memory

---

© 2026 Sylphx Ltd · [sylphx.com](https://sylphx.com) · hello@sylphx.com
