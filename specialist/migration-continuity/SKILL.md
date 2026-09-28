---
name: migration-continuity
description: Temporarily audit this repository’s agent-instruction migration, continuity ledger, compatibility and retirement checks.
---

Load these generic skills explicitly (composition is not automatic):

- [team-coordinator](../../agent-library/skills/team-coordinator/SKILL.md)
- [team-regression-tester](../../agent-library/skills/team-regression-tester/SKILL.md)

Temporary specialist for this agent-library migration, authorized 2026-09-28. Read [migration record](MIGRATION.md), [manifest](manifest.json) and the historical baseline files listed there. Baselines are audit evidence, never active instructions.

Track every old AGENTS.md section and existing skill to its new active destination. Preserve latest user decisions, review independence, source privacy, model/tool provenance and authorization boundaries. Record intentional supersessions explicitly; do not silently drop requirements to shorten the guide. Compare current files with baseline hashes and keep compatibility entrypoints functioning.

Run `python3 scripts/check_agent_library.py` from the repository root and commission an independent team-regression-tester for realistic routing scenarios. The reviewer must not edit the implementation it signs off. Log actual evidence and gaps in MIGRATION.md. Current-session skill catalogs may be stale: read explicit paths; validate fresh-session auto-discovery separately.

Retire only after structural checks, independent continuity and scenario checks pass, and a fresh-session discovery check is recorded. Mark this specialist retired and remove its root routing entry at that point; retain baseline/manifest/report for audit. Do not delete it merely because the first pass looks good. Roll back only migration-owned files after checking intervening changes; never restore all of PLAN.md or reset the workspace.
