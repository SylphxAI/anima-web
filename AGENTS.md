# Repository Instructions

Follow the enterprise doctrine in `SylphxAI/doctrine` and the local project boundary in [PROJECT.md](PROJECT.md). The machine-readable control-plane manifest is [.doctrine/project.json](.doctrine/project.json).

This repository owns the Anima/Spiron web and provisioning surface only. Do not add agent-runtime internals, memory-engine behavior, central CI, release-bot, or platform-substrate behavior here.

For production changes, record build validation, migration evidence when schema changes, platform deploy/readback, and smoke evidence for affected public, webhook, or provisioning routes. Treat webhook/provisioning/database side effects as forward-fix recovery unless a repo-local runbook proves a reversible path.
